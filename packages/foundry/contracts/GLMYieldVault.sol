// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20 <0.9.0;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC4626 } from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GLMYieldVault
 * @notice ERC4626 vault for GLM that routes realized yield to user-configured project splits.
 *         Principal remains withdrawable by users; only yield is donated.
 *
 * @dev This contract models yield via a keeper-reported function `reportYield(amount)` that
 *      transfers GLM into the vault and updates a global accumulator (yieldPerShare).
 *      Users can donate their accrued yield according to their splits stored in a registry.
 */
contract GLMYieldVault is ERC4626, Ownable {
    using SafeERC20 for IERC20;

    /// @notice Registry of per-user donation splits
    address public immutable splitRegistry;

    /// @notice Scaler for per-share accumulator
    uint256 private constant ACC_PRECISION = 1e18;

    /// @notice global accumulator of donated yield per share
    uint256 public yieldPerShare;
    /// @notice pending yield to distribute when shares > 0
    uint256 public pendingYield;

    mapping(address => uint256) public userYieldPerSharePaid;
    mapping(address => uint256) public userAccruedYield; // in underlying token units (GLM)

    /// @notice address permitted to call reportYield
    address public keeper;

    event KeeperUpdated(address indexed keeper);
    event YieldReported(address indexed caller, uint256 amount, uint256 newYieldPerShare);
    event YieldAccrued(address indexed user, uint256 amount);
    event YieldDonated(address indexed user, uint256 amount);

    constructor(IERC20 glmToken, address _splitRegistry, address _owner)
        ERC20("GLM Yield Vault Share", "glmYVS")
        ERC4626(glmToken)
        Ownable(_owner)
    {
        require(_splitRegistry != address(0), "BAD_REGISTRY");
        splitRegistry = _splitRegistry;
    }

    /*//////////////////////////////////////////////////////////////
                                ADMIN
    //////////////////////////////////////////////////////////////*/
    function setKeeper(address _keeper) external onlyOwner {
        keeper = _keeper;
        emit KeeperUpdated(_keeper);
    }

    /*//////////////////////////////////////////////////////////////
                             YIELD ACCOUNTING
    //////////////////////////////////////////////////////////////*/

    function _syncPending() internal {
        uint256 supply = totalSupply();
        if (pendingYield > 0 && supply > 0) {
            yieldPerShare += (pendingYield * ACC_PRECISION) / supply;
            pendingYield = 0;
        }
    }

    function _accrue(address user) internal {
        _syncPending();
        uint256 paid = userYieldPerSharePaid[user];
        uint256 current = yieldPerShare;
        if (current == paid) return;
        uint256 balance = balanceOf(user);
        if (balance > 0) {
            uint256 delta = ((balance * (current - paid)) / ACC_PRECISION);
            if (delta > 0) {
                userAccruedYield[user] += delta;
                emit YieldAccrued(user, delta);
            }
        }
        userYieldPerSharePaid[user] = current;
    }

    /**
     * @notice Called by keeper to report newly realized yield (in GLM). Pulls tokens from caller.
     * @param amount Amount of GLM yield to distribute.
     */
    function reportYield(uint256 amount) external {
        require(msg.sender == keeper, "NOT_KEEPER");
        require(amount > 0, "NO_YIELD");
        asset().safeTransferFrom(msg.sender, address(this), amount);
        uint256 supply = totalSupply();
        if (supply == 0) {
            pendingYield += amount;
        } else {
            yieldPerShare += (amount * ACC_PRECISION) / supply;
        }
        emit YieldReported(msg.sender, amount, yieldPerShare);
    }

    /**
     * @notice Returns the accrued yield (GLM) for a user, including pending accumulator.
     */
    function accruedYield(address user) public view returns (uint256) {
        uint256 supply = totalSupply();
        uint256 yps = yieldPerShare;
        if (pendingYield > 0 && supply > 0) {
            yps += (pendingYield * ACC_PRECISION) / supply;
        }
        uint256 paid = userYieldPerSharePaid[user];
        uint256 bal = balanceOf(user);
        uint256 delta = bal > 0 ? (bal * (yps - paid)) / ACC_PRECISION : 0;
        return userAccruedYield[user] + delta;
    }

    /*//////////////////////////////////////////////////////////////
                           USER INTERACTIONS
    //////////////////////////////////////////////////////////////*/

    function donateAllMyYield() external {
        _accrue(msg.sender);
        uint256 amount = userAccruedYield[msg.sender];
        require(amount > 0, "NO_ACCRUED");
        userAccruedYield[msg.sender] = 0;
        _distribute(msg.sender, amount);
        emit YieldDonated(msg.sender, amount);
    }

    function donateMyYield(uint256 amount) external {
        _accrue(msg.sender);
        require(amount > 0, "ZERO_AMOUNT");
        require(userAccruedYield[msg.sender] >= amount, "INSUFFICIENT_ACCRUED");
        userAccruedYield[msg.sender] -= amount;
        _distribute(msg.sender, amount);
        emit YieldDonated(msg.sender, amount);
    }

    function _distribute(address user, uint256 amount) internal {
        (bool ok, bytes memory data) = splitRegistry.staticcall(
            abi.encodeWithSignature("getSplits(address)", user)
        );
        require(ok, "SPLIT_QUERY_FAIL");
        (address[] memory recipients, uint16[] memory bps) = abi.decode(data, (address[], uint16[]));
        require(recipients.length > 0 && recipients.length == bps.length, "BAD_SPLITS");

        uint256 len = bps.length;
        uint256 sent;
        for (uint256 i = 0; i < len; i++) {
            uint256 share = (amount * bps[i]) / 10_000;
            if (share > 0) {
                IERC20(asset()).safeTransfer(recipients[i], share);
                sent += share;
            }
        }
        // send remainder to first recipient to avoid dust
        uint256 remainder = amount - sent;
        if (remainder > 0) {
            IERC20(asset()).safeTransfer(recipients[0], remainder);
        }
    }

    /*//////////////////////////////////////////////////////////////
                       ERC4626 HOOKS OVERRIDES
    //////////////////////////////////////////////////////////////*/

    function deposit(uint256 assets, address receiver) public override returns (uint256) {
        _syncPending();
        _accrue(receiver);
        return super.deposit(assets, receiver);
    }

    function mint(uint256 shares, address receiver) public override returns (uint256) {
        _syncPending();
        _accrue(receiver);
        return super.mint(shares, receiver);
    }

    function withdraw(uint256 assets, address receiver, address owner_) public override returns (uint256) {
        _syncPending();
        _accrue(owner_);
        return super.withdraw(assets, receiver, owner_);
    }

    function redeem(uint256 shares, address receiver, address owner_) public override returns (uint256) {
        _syncPending();
        _accrue(owner_);
        return super.redeem(shares, receiver, owner_);
    }
}


