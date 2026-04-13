"use client";

import { motion, AnimatePresence, type Transition } from "motion/react";
import { useRef, useState, type ChangeEvent } from "react";
import { useAgent } from "./agent-provider";

const spring: Transition = { type: "spring", stiffness: 400, damping: 30 };

const BAR_COUNT = 42;

const BAR_PROFILE = Array.from({ length: BAR_COUNT }, (_, i) => {
  const center = (BAR_COUNT - 1) / 2;
  const dist = Math.abs(i - center) / center;
  const base = 0.18 + 0.82 * (1 - dist * 0.85);
  return {
    base,
    peak: base * (0.9 + 0.35 * Math.sin(i * 1.31)),
    delay: (i * 0.04) % 1.2,
  };
});

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex h-24 w-full items-center justify-center gap-[3px]">
      {BAR_PROFILE.map((bar, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-amber-500/80"
          animate={
            active
              ? { scaleY: [bar.base, bar.peak, bar.base * 0.6, bar.peak] }
              : { scaleY: bar.base * 0.35 }
          }
          transition={
            active
              ? {
                  duration: 1.1 + (i % 5) * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: bar.delay,
                }
              : { duration: 0.4 }
          }
          style={{
            height: "100%",
            transformOrigin: "center",
            boxShadow: active
              ? "0 0 6px rgba(245,158,11,0.45)"
              : "none",
          }}
        />
      ))}
    </div>
  );
}

function WavePlaceholder() {
  return (
    <div className="flex h-24 w-full items-center justify-center gap-[3px]">
      {BAR_PROFILE.map((bar, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-zinc-700"
          style={{ height: `${bar.base * 64}%` }}
        />
      ))}
    </div>
  );
}

export function UploadZone() {
  const { phase, runMidasAgent, result, wallet } = useAgent();
  const isRunning = phase !== "idle";
  const isAnalyzing = phase === "analyzing";
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const canRun = !isRunning && !!wallet && !!selectedFile;

  const openPicker = () => {
    inputRef.current?.click();
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file ?? null);
  };

  return (
    <div
      className={[
        "relative flex h-full flex-col border bg-[#111113] transition-colors duration-500",
        isRunning ? "border-amber-500/50" : "border-white/10",
      ].join(" ")}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-400">
            The Studio
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
          stem · 01
        </span>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-8 px-8 py-12">
        <div
          className={[
            "relative flex w-full flex-col items-center justify-center gap-6 border border-dashed px-6 py-10 transition-colors duration-500",
            isRunning ? "border-amber-500/50" : "border-white/15",
          ].join(" ")}
        >
          <AnimatePresence mode="wait" initial={false}>
            {phase === "idle" ? (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-6"
              >
                <WavePlaceholder />
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="font-display text-2xl font-semibold text-zinc-100">
                    {selectedFile ? "Stem ready" : "Drop your stem"}
                  </span>
                  <span className="max-w-xs text-sm text-zinc-500">
                    {selectedFile
                      ? selectedFile.name
                      : ".wav / .mp3 — Midas will extract, feature and settle in one pass."}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="running"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-6"
              >
                <Waveform active={isAnalyzing} />
                <div className="flex flex-col items-center gap-2 text-center">
                  <motion.span
                    animate={{ opacity: isAnalyzing ? [0.6, 1, 0.6] : 1 }}
                    transition={{
                      duration: 1.4,
                      repeat: isAnalyzing ? Infinity : 0,
                      ease: "easeInOut",
                    }}
                    className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-300"
                  >
                    {phase === "analyzing"
                      ? "Midas is analyzing your track…"
                      : phase === "synthesizing"
                      ? "Feature synthesis live"
                      : phase === "settling"
                      ? "Routing settlement"
                      : "Settlement confirmed"}
                  </motion.span>
                  {result ? (
                    <div className="mt-3 grid grid-cols-3 gap-4 font-mono text-xs text-zinc-400">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                          bpm
                        </span>
                        <span className="text-zinc-100">{result.bpm}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                          key
                        </span>
                        <span className="text-zinc-100">{result.keyName}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                          dur
                        </span>
                        <span className="text-zinc-100">
                          {Math.floor(result.durationSec / 60)}:
                          {String(result.durationSec % 60).padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          onClick={() => {
            void runMidasAgent(selectedFile);
          }}
          disabled={!canRun}
          whileHover={canRun ? { scale: 0.98 } : undefined}
          transition={spring}
          className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-medium tracking-wide text-zinc-950 transition-colors duration-300 hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-amber-500/40 disabled:text-zinc-950/60"
        >
          {isRunning ? "Midas is working…" : wallet ? "Run Uploaded Stem" : "Connect Wallet First"}
          <span aria-hidden>→</span>
        </motion.button>

        <button
          type="button"
          onClick={openPicker}
          disabled={isRunning || !wallet}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-200 transition-colors duration-300 hover:border-amber-500/50 hover:text-amber-300 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-zinc-600"
        >
          {selectedFile ? "Replace Stem" : "Choose Stem"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".wav,.mp3,audio/wav,audio/mpeg"
          onChange={onFileChange}
          className="hidden"
        />

        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
          {!wallet
            ? "wallet required"
            : selectedFile
            ? "custom stem loaded"
            : "upload required"}
        </span>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-6 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
        <span className={isRunning ? "text-amber-400" : ""}>● {isRunning ? "live" : "ready"}</span>
        <span>midas/v1.2.0</span>
      </div>
    </div>
  );
}
