import Link from "next/link";
import { MotionIn } from "@/components/ui/motion-in";
import { GlowCard } from "@/components/ui/glow-card";

type PillarProps = {
  eyebrow: string;
  title: string;
  rows: { label: string; value: string }[];
  footer?: React.ReactNode;
};

function Pillar({ eyebrow, title, rows, footer }: PillarProps) {
  return (
    <GlowCard className="h-full rounded-none" radius={320}>
      <div className="flex h-full flex-col gap-6 p-7">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">
            {eyebrow}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        </div>
        <h3 className="font-display text-2xl font-semibold tracking-tight text-zinc-100">
          {title}
        </h3>
        <div className="mt-2 flex flex-col gap-3 border-t border-white/[0.06] pt-4 font-mono text-xs">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4"
            >
              <span className="text-zinc-500">{row.label}</span>
              <span className="truncate text-right text-zinc-100">
                {row.value}
              </span>
            </div>
          ))}
        </div>
        {footer ? (
          <div className="mt-auto border-t border-white/[0.06] pt-4">
            {footer}
          </div>
        ) : null}
      </div>
    </GlowCard>
  );
}

export function Persona() {
  return (
    <section
      id="persona"
      className="relative isolate overflow-hidden border-t border-white/[0.06]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute left-1/2 top-[-20%] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(245,158,11,0.1),transparent_70%)] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at 50% 40%, black 20%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-32">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[1.1fr_1fr]">
          <MotionIn>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-400">
              00 · The Agent
            </span>
            <h2 className="mt-6 font-display text-4xl font-semibold tracking-tight md:text-6xl">
              <span className="relative inline-block">
                <span className="text-metallic-steel">Meet </span>
                <span aria-hidden className="text-specular-sheen absolute inset-0">
                  Meet{" "}
                </span>
              </span>
              <span className="relative inline-block">
                <span className="text-metallic-gold">Midas.</span>
                <span aria-hidden className="text-specular-sheen absolute inset-0">
                  Midas.
                </span>
              </span>
            </h2>
          </MotionIn>

          <MotionIn delay={0.1}>
            <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
              A fully-formed on-chain participant, not a tool. Midas has a
              persona, a skill stack, and a wallet — the three primitives of
              the Audiera Agent-Native Economy. Every feature verse Midas
              writes becomes a block-sealed split.
            </p>
          </MotionIn>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
          <MotionIn delay={0.12}>
            <Pillar
              eyebrow="01 · Persona"
              title="Autonomous Feature Artist"
              rows={[
                { label: "name",    value: "Midas" },
                { label: "role",    value: "Feature Agent" },
                { label: "voice",   value: "Technical · Punchy" },
                { label: "version", value: "openclaw v1.2.0" },
                { label: "style",   value: "4 bars, no filler" },
              ]}
              footer={
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  deterministic · signed · verifiable
                </span>
              }
            />
          </MotionIn>

          <MotionIn delay={0.2}>
            <Pillar
              eyebrow="02 · Skills"
              title="Audiera Native Stack"
              rows={[
                { label: "lyrics",   value: "audiera/lyrics-skill" },
                { label: "music",    value: "audiera/music-skill" },
                { label: "analysis", value: "librosa · bpm · key" },
                { label: "format",   value: "4-bar feature verse" },
                { label: "latency",  value: "~ sub-second" },
              ]}
              footer={
                <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
                  <Link
                    href="https://github.com/audiera/lyrics-skill"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/5 px-3 py-1 text-amber-300 transition-colors duration-300 hover:border-amber-500"
                  >
                    <span className="h-1 w-1 rounded-full bg-amber-500" />
                    Lyrics ↗
                  </Link>
                  <Link
                    href="https://github.com/audiera/music-skill"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/5 px-3 py-1 text-amber-300 transition-colors duration-300 hover:border-amber-500"
                  >
                    <span className="h-1 w-1 rounded-full bg-amber-500" />
                    Music ↗
                  </Link>
                </div>
              }
            />
          </MotionIn>

          <MotionIn delay={0.28}>
            <Pillar
              eyebrow="03 · Wallet"
              title="On-Chain Participant"
              rows={[
                { label: "chain",    value: "BNB Testnet · 97" },
                { label: "token",    value: "$BEAT" },
                { label: "splitter", value: "0xeab5…Ea994" },
                { label: "split",    value: "50 / 50" },
                { label: "settle",   value: "next block" },
              ]}
              footer={
                <div className="flex items-center justify-between gap-3">
                  <Link
                    href="https://testnet.bscscan.com/address/0xeab5F2f3308FC8c8a6f98119F7603451Dc6Ea994"
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300 transition-colors duration-300 hover:text-amber-200"
                  >
                    BscScan
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                    verified
                  </span>
                </div>
              }
            />
          </MotionIn>
        </div>
      </div>
    </section>
  );
}
