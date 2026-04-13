"use client";

import { motion, type Transition } from "motion/react";
import { useAgent } from "./agent-provider";

const spring: Transition = { type: "spring", stiffness: 400, damping: 30 };

function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function WalletConnect() {
  const { wallet, walletConnecting, walletError, connectWallet, disconnectWallet } =
    useAgent();

  if (wallet) {
    return (
      <motion.button
        onClick={disconnectWallet}
        whileHover={{ scale: 0.98 }}
        transition={spring}
        className="group inline-flex items-center gap-2.5 rounded-full border border-amber-500/50 bg-amber-500/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-amber-300 transition-colors duration-300 hover:border-amber-500 hover:bg-amber-500/10"
        title="Click to disconnect"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
        </span>
        <span>{short(wallet)}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={connectWallet}
      disabled={walletConnecting}
      whileHover={{ scale: 0.98 }}
      transition={spring}
      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-200 transition-colors duration-300 hover:border-amber-500/50 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
      title={walletError ?? undefined}
    >
      <span className="h-1 w-1 rounded-full bg-amber-500" />
      {walletConnecting ? "Connecting…" : "Connect Wallet"}
    </motion.button>
  );
}
