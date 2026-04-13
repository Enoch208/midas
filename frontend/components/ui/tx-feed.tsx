"use client";

import { AnimatePresence, motion } from "motion/react";
import { useAgent, type LiveTx } from "@/components/midas/agent-provider";

const rowClass =
  "grid grid-cols-[1.4fr_1.6fr_1fr_1fr_0.6fr] items-center gap-4 border-b border-white/[0.06] px-6 py-4 font-mono text-xs text-zinc-400";

function Row({ tx, flash = false }: { tx: LiveTx; flash?: boolean }) {
  if (!flash) {
    return (
      <div className={rowClass}>
        <RowInner tx={tx} />
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, backgroundColor: "rgba(245, 158, 11, 0.2)" }}
      animate={{ opacity: 1, y: 0, backgroundColor: "rgba(245, 158, 11, 0)" }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        opacity: { duration: 0.35 },
        y: { type: "spring", stiffness: 400, damping: 30 },
        backgroundColor: { duration: 1.6, delay: 0.4 },
      }}
      className={rowClass}
    >
      <RowInner tx={tx} />
    </motion.div>
  );
}

function RowInner({ tx }: { tx: LiveTx }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        <span className="text-zinc-100">{tx.hash}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-zinc-200">{tx.track}</span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
          {tx.artist}
        </span>
      </div>
      <div className="text-zinc-400">{tx.to}</div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[#D4AF37]">{tx.amount}</span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
          $BEAT
        </span>
      </div>
      <div className="flex items-center justify-end gap-2 text-zinc-500">
        <span className="rounded-full border border-amber-500/30 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-400">
          50/50
        </span>
        <span>{tx.ago}</span>
      </div>
    </>
  );
}

export function TxFeed() {
  const { liveSplits } = useAgent();

  // Fresh rows drop in at the top; stable rows keep the existing marquee.
  const fresh = liveSplits.filter((t) => t.fresh);
  const stable = liveSplits.filter((t) => !t.fresh);
  const marquee = [...stable, ...stable];

  return (
    <div className="relative h-[520px] overflow-hidden">
      {/* Fresh ledger drops — static, above the scroll */}
      <div className="relative z-10">
        <AnimatePresence initial={false}>
          {fresh.map((tx) => (
            <Row key={tx.hash} tx={tx} flash />
          ))}
        </AnimatePresence>
      </div>

      {/* Existing infinite-scroll marquee */}
      <motion.div
        animate={{ y: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {marquee.map((tx, i) => (
          <Row key={`${tx.hash}-${i}`} tx={tx} />
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-[#111113] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-[#111113] to-transparent" />
    </div>
  );
}
