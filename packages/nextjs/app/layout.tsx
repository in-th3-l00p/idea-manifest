import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "idea manifest",
  description: "turn your ideas into reality by receiving the funding you need",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={``}>
      <body className="max-w-full w-full min-h-screen">
        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>
            <div className="w-full max-w-5xl mx-auto space-y-20 pt-40 pb-20">
              {children}
            </div>
          </ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
