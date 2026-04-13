"use client";

import { motion, AnimatePresence } from "motion/react";
import { useAgent, type PipelineResult } from "./agent-provider";

function short(addr: string | null | undefined, head = 6, tail = 4) {
  if (!addr) return "0x…";
  if (addr.length <= head + tail + 1) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

function formatBeat(raw: string | undefined | null) {
  if (!raw) return "0.00";
  const n = Number(raw);
  if (!Number.isFinite(n)) return raw;
  return n.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

function musicStatusLabel(status: PipelineResult["audieraMusicStatus"]) {
  if (status === "completed") return "completed";
  if (status === "processing") return "processing";
  return "error";
}

function musicStatusTone(status: PipelineResult["audieraMusicStatus"]) {
  if (status === "completed") return "text-emerald-300";
  if (status === "processing") return "text-amber-300";
  return "text-rose-300";
}

function IdleState() {
  return (
    <motion.div
      key="idle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center"
    >
      <div className="relative flex h-24 w-24 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-amber-500/20" />
        <span className="absolute inset-2 rounded-full border border-amber-500/30" />
        <span className="absolute inset-4 rounded-full border border-amber-500/40" />
        <span className="relative h-6 w-6 rounded-full bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)]" />
      </div>
      <div className="flex max-w-xs flex-col gap-2">
        <span className="font-display text-2xl font-semibold text-zinc-100">
          Waiting for a stem
        </span>
        <span className="text-sm text-zinc-500">
          Upload a track in the Studio and Midas will write the feature, mint
          the split, and settle on-chain — live.
        </span>
      </div>
    </motion.div>
  );
}

function AnalyzingState() {
  return (
    <motion.div
      key="analyzing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center"
    >
      <div className="relative flex h-24 w-24 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full border border-amber-500/40"
          animate={{ scale: [1, 1.3], opacity: [0.8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.span
          className="absolute inset-0 rounded-full border border-amber-500/40"
          animate={{ scale: [1, 1.3], opacity: [0.8, 0] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeOut",
            delay: 0.5,
          }}
        />
        <span className="relative h-8 w-8 rounded-full bg-amber-500 shadow-[0_0_24px_rgba(245,158,11,0.7)]" />
      </div>
      <div className="flex max-w-xs flex-col gap-2">
        <motion.span
          className="font-display text-xl font-semibold text-zinc-100"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          Extracting features
        </motion.span>
        <span className="text-sm text-zinc-500">
          Pulling BPM, key and texture from the stem.
        </span>
      </div>
    </motion.div>
  );
}

function LyricCard({ result }: { result: PipelineResult }) {
  return (
    <motion.div
      key="synthesizing"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-full flex-col gap-5 p-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300">
          <span className="h-1 w-1 rounded-full bg-amber-500" />
          Genre Detected
        </span>
        <span className="font-display text-xl font-semibold text-zinc-100">
          {result.genre}
        </span>
      </motion.div>

      <div className="relative flex-1 border border-amber-500/50 bg-[#111113] p-6 shadow-[0_0_30px_rgba(245,158,11,0.08)]">
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            midas · featured verse
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-400">
            4 bars
          </span>
        </div>

        <div className="flex flex-col gap-3 font-display text-lg leading-relaxed text-zinc-100 md:text-xl">
          {result.lyrics.length === 0 ? (
            <span className="text-zinc-500">No lyrics returned.</span>
          ) : (
            result.lyrics.map((line, i) => (
              <motion.p
                key={`${line}-${i}`}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.65,
                  ease: "easeOut",
                }}
              >
                {line}
              </motion.p>
            ))
          )}
        </div>

        {result.lyrics.length > 0 ? (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: result.lyrics.length * 0.65 }}
            className="terminal-cursor mt-3 inline-block h-[14px] w-[7px] bg-amber-400"
          />
        ) : null}

        <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            <span className="h-1 w-1 rounded-full bg-amber-500" />
            Audiera Native Synthesis
          </span>
          <span
            className={[
              "font-mono text-[10px] uppercase tracking-[0.2em]",
              musicStatusTone(result.audieraMusicStatus),
            ].join(" ")}
          >
            music · {musicStatusLabel(result.audieraMusicStatus)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function SplitGraphic({
  result,
  wallet,
  animate,
}: {
  result: PipelineResult;
  wallet: string | null;
  animate: boolean;
}) {
  const creatorShort = short(wallet ?? result.creatorWallet);
  const amount = formatBeat(result.amountCreator);

  return (
    <div className="relative flex items-stretch gap-4">
      <WalletCard
        label="Your Wallet"
        address={creatorShort}
        amount={amount}
        tone="creator"
      />
      <div className="relative flex w-20 flex-col items-center justify-center">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-amber-500/20 via-amber-400 to-amber-500/20" />
        {animate ? (
          <>
            <motion.span
              className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 shadow-[0_0_16px_rgba(252,211,77,0.9)]"
              initial={{ x: 0 }}
              animate={{ x: [-46, 0, 46, 0, -46] }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
          </>
        ) : (
          <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400" />
        )}
        <span className="absolute -top-6 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300">
          50 / 50
        </span>
      </div>
      <WalletCard
        label="Midas Protocol"
        address="0xeab5…Ea994"
        amount={amount}
        tone="protocol"
      />
    </div>
  );
}

function WalletCard({
  label,
  address,
  amount,
  tone,
}: {
  label: string;
  address: string;
  amount: string;
  tone: "creator" | "protocol";
}) {
  return (
    <div
      className={[
        "flex flex-1 flex-col gap-3 border p-5 transition-colors duration-300",
        tone === "creator"
          ? "border-amber-500/50 bg-[#141410]"
          : "border-white/15 bg-[#111113]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
          {label}
        </span>
        <span className="h-2 w-2 rounded-full bg-amber-500" />
      </div>
      <span className="break-all font-mono text-xs text-zinc-200">
        {address}
      </span>
      <div className="mt-auto flex items-baseline gap-2 border-t border-white/[0.06] pt-3">
        <span className="font-display text-2xl font-semibold text-[#D4AF37]">
          {amount}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          $BEAT
        </span>
      </div>
    </div>
  );
}

function SettlingState({ result }: { result: PipelineResult }) {
  const { wallet } = useAgent();
  return (
    <motion.div
      key="settling"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-full flex-col gap-6 p-8"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300">
          <span className="h-1 w-1 rounded-full bg-amber-500" />
          Settling on-chain
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          bnb · testnet
        </span>
      </div>

      <div className="flex-1">
        <SplitGraphic result={result} wallet={wallet} animate />
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.06] pt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
        <span>routing 50 / 50</span>
        <motion.span
          className="text-amber-300"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          awaiting confirmation
        </motion.span>
      </div>
    </motion.div>
  );
}

function ConfirmedState({ result }: { result: PipelineResult }) {
  const { wallet } = useAgent();
  return (
    <motion.div
      key="confirmed"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-full flex-col gap-6 p-8"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 400, damping: 30 }}
        className="flex items-center gap-3"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-500 bg-amber-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-200">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-3 w-3 text-amber-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Settlement Confirmed
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          block · next
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <SplitGraphic result={result} wallet={wallet} animate={false} />
      </motion.div>

      <motion.a
        href={result.bscScanUrl}
        target="_blank"
        rel="noreferrer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="group flex items-center justify-between border border-white/10 bg-[#0d0d10] px-5 py-4 font-mono text-xs transition-colors duration-300 hover:border-amber-500/50"
      >
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            on-chain proof
          </span>
          <span className="text-zinc-100">
            View settlement transaction on BscScan
          </span>
          <span className="break-all text-zinc-500">{short(result.txHash, 10, 8)}</span>
        </div>
        <span className="ml-4 shrink-0 text-amber-300 transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </motion.a>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="border border-white/10 bg-[#0d0d10] px-5 py-4 font-mono text-xs"
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            generated music
          </span>
          <span
            className={[
              "text-[10px] uppercase tracking-[0.25em]",
              musicStatusTone(result.audieraMusicStatus),
            ].join(" ")}
          >
            {musicStatusLabel(result.audieraMusicStatus)}
          </span>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <span className="text-zinc-100">
            {result.audieraMusicStatus === "completed"
              ? "Your AI feature track is ready."
              : result.audieraMusicStatus === "processing"
              ? "Your AI feature track is still rendering."
              : "Music generation did not complete this run."}
          </span>
          <span className="break-all text-zinc-300">
            voice · {result.audieraArtistName ?? "unknown"}
          </span>
          {result.audieraMusicError ? (
            <span className="break-all text-rose-300">
              generation issue · {result.audieraMusicError}
            </span>
          ) : null}
          {result.audieraMusicUrl ? (
            <a
              href={result.audieraMusicUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between border border-white/10 px-3 py-2 transition-colors duration-300 hover:border-amber-500/50"
            >
              <span className="break-all text-zinc-100">listen now</span>
              <span className="ml-4 shrink-0 text-amber-300 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          ) : null}
          <details className="mt-1 border border-white/10 px-3 py-2 text-zinc-500">
            <summary className="cursor-pointer text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              technical details
            </summary>
            <div className="mt-2 flex flex-col gap-1 break-all">
              <span>artist id · {result.audieraArtistId ?? "n/a"}</span>
              <span>job id · {result.audieraMusicJobId ?? "not-started"}</span>
              <span>poll path · {result.audieraMusicPollUrl ?? "n/a"}</span>
            </div>
          </details>
        </div>
      </motion.div>

      {result.splitterContract ? (
        <div className="border border-white/10 bg-[#0d0d10] px-5 py-4 font-mono text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              revenue split contract
            </span>
            <span className="text-zinc-100">{short(result.splitterContract, 10, 8)}</span>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}

export function MidasFeed() {
  const { phase, result } = useAgent();

  return (
    <div className="relative flex h-full flex-col border border-white/10 bg-[#111113]">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span
              className={[
                "absolute inline-flex h-full w-full rounded-full bg-amber-400",
                phase === "idle" ? "opacity-0" : "animate-ping opacity-60",
              ].join(" ")}
            />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-400">
            The Agent
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
          {phase === "idle"
            ? "standby"
            : phase === "analyzing"
            ? "extract"
            : phase === "synthesizing"
            ? "synthesize"
            : phase === "settling"
            ? "enrich"
            : "confirmed"}
        </span>
      </div>

      <div className="relative min-h-[520px] flex-1">
        <AnimatePresence mode="wait" initial={false}>
          {phase === "idle" && <IdleState />}
          {phase === "analyzing" && <AnalyzingState />}
          {phase === "synthesizing" && result && <LyricCard result={result} />}
          {phase === "settling" && result && <SettlingState result={result} />}
          {phase === "confirmed" && result && <ConfirmedState result={result} />}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-6 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
        <span className="flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-amber-500" />
          audiera · bnb
        </span>
        <span>midas.agent/v1</span>
      </div>
    </div>
  );
}
