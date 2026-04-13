"use client";

import type { ReactNode } from "react";
import { AppKitProvider } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { bscTestnet } from "@reown/appkit/networks";

const projectId =
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ||
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "REOWN_PROJECT_ID_REQUIRED";

const metadata = {
  name: "Midas",
  description: "Autonomous feature agent for Audiera on BNB Chain",
  url: "http://localhost:3000",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

export function ReownProvider({ children }: { children: ReactNode }) {
  return (
    <AppKitProvider
      adapters={[new EthersAdapter()]}
      networks={[bscTestnet]}
      defaultNetwork={bscTestnet}
      metadata={metadata}
      projectId={projectId}
      features={{ analytics: false }}
      themeMode="dark"
    >
      {children}
    </AppKitProvider>
  );
}
