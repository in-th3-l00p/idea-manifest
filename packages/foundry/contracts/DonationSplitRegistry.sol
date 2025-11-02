// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20 <0.9.0;

/**
 * @title DonationSplitRegistry
 * @notice Stores per-user donation splits (recipients + basis points).
 *         Used by a yield vault to route a user's accrued yield according to their configured percentages.
 */
contract DonationSplitRegistry {
    uint16 public constant MAX_SPLIT_COUNT = 10;
    uint16 public constant BPS_DENOMINATOR = 10_000; // 100%

    struct Splits {
        address[] recipients;
        uint16[] bps;
    }

    mapping(address => Splits) private _splitsOf;

    event SplitsUpdated(address indexed user, address[] recipients, uint16[] bps);

    /**
     * @notice Set or update the caller's donation splits.
     * @param recipients Addresses to receive donations.
     * @param bps Basis points for each recipient. Must sum to 10_000.
     */
    function setMySplits(address[] calldata recipients, uint16[] calldata bps) external {
        _validateSplits(recipients, bps);
        // Store
        _splitsOf[msg.sender] = Splits({ recipients: recipients, bps: bps });
        emit SplitsUpdated(msg.sender, recipients, bps);
    }

    /**
     * @notice Returns the split config for a user.
     */
    function getSplits(address user) external view returns (address[] memory recipients, uint16[] memory bps) {
        Splits storage s = _splitsOf[user];
        return (s.recipients, s.bps);
    }

    /**
     * @notice Returns true if the user has set a valid split config.
     */
    function hasSplits(address user) external view returns (bool) {
        Splits storage s = _splitsOf[user];
        if (s.recipients.length == 0 || s.recipients.length != s.bps.length) return false;
        uint256 len = s.bps.length;
        uint256 sum;
        for (uint256 i = 0; i < len; i++) sum += s.bps[i];
        return sum == BPS_DENOMINATOR;
    }

    function _validateSplits(address[] calldata recipients, uint16[] calldata bps) internal pure {
        require(recipients.length > 0, "NO_RECIPIENTS");
        require(recipients.length == bps.length, "LENGTH_MISMATCH");
        require(recipients.length <= MAX_SPLIT_COUNT, "TOO_MANY");
        uint256 sum;
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "ZERO_RECIPIENT");
            sum += bps[i];
        }
        require(sum == BPS_DENOMINATOR, "BPS_NOT_100%");
    }
}


