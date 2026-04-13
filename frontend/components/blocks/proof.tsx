import { MotionIn } from "@/components/ui/motion-in";
import { TxFeed } from "@/components/ui/tx-feed";
import { GlowCard } from "@/components/ui/glow-card";

function SideStat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <GlowCard className="rounded-none" radius={220}>
      <div className="flex flex-col gap-3 p-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
          {label}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-semibold text-[#D4AF37]">
            {value}
          </span>
          {unit ? (
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
              {unit}
            </span>
          ) : null}
        </div>
      </div>
    </GlowCard>
  );
}

export function Proof() {
  return (
    <section id="proof" className="relative isolate overflow-hidden border-t border-white/[0.06]">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/brand/block.png')" }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_5%,rgba(10,10,10,0.85)_45%,#050505_90%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-32">
        <MotionIn>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-400">
            02 · Proof of Work
          </span>
        </MotionIn>

        <MotionIn delay={0.08} className="mt-6">
          <h2 className="max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="relative inline-block">
              <span className="text-metallic-steel">Every beat. Every split.</span>
              <span aria-hidden className="text-specular-sheen absolute inset-0">
                Every beat. Every split.
              </span>
            </span>
            <br />
            <span className="relative inline-block">
              <span className="text-metallic-gold">Live.</span>
              <span aria-hidden className="text-specular-sheen absolute inset-0">
                Live.
              </span>
            </span>
          </h2>
        </MotionIn>

        <MotionIn delay={0.16} className="mt-6 max-w-2xl">
          <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
            A direct BscScan feed of every 50/50 settlement the agent has routed.
            No aggregator, no batching. Raw chain state.
          </p>
        </MotionIn>

        <MotionIn delay={0.24} className="mt-16">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
            <GlowCard className="rounded-none" radius={420}>
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em]">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                  </span>
                  <span className="text-zinc-200">bnb · mainnet</span>
                  <span className="text-zinc-700">|</span>
                  <span className="text-zinc-500">block 43,901,284</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-500">
                  <span>latency 412ms</span>
                  <span className="text-zinc-700">|</span>
                  <span>midas.stream/v1</span>
                </div>
              </div>

              <div className="grid grid-cols-[1.4fr_1.6fr_1fr_1fr_0.6fr] items-center gap-4 border-b border-white/10 bg-white/[0.02] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                <span>tx hash</span>
                <span>track · artist</span>
                <span>recipient</span>
                <span>amount</span>
                <span className="text-right">split · age</span>
              </div>

              <TxFeed />
            </GlowCard>

            <div className="flex flex-col gap-4">
              <SideStat label="24h settled" value="812,640" unit="$BEAT" />
              <SideStat label="active artists" value="2,918" />
              <SideStat label="splits confirmed" value="1,284" />
              <div className="flex flex-col gap-3 border border-amber-500/20 bg-[#111113] p-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">
                  Live contract
                </span>
                <code className="break-all font-mono text-xs text-zinc-200">
                  0x7a9f8e1c3b2d4a6f5e9c0d8b7a2e3f4c1d5e6f2b
                </code>
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  verified · openclaw v1.2.0
                </span>
              </div>
            </div>
          </div>
        </MotionIn>
      </div>
    </section>
  );
}
