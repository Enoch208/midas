import { MotionIn } from "@/components/ui/motion-in";
import { CTAButton } from "@/components/ui/cta-button";
import { GlowCard } from "@/components/ui/glow-card";
import { WatchDemoButton } from "@/components/midas/watch-demo-button";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <GlowCard radius={260} className="rounded-none border-0">
      <div className="flex flex-col gap-2 px-6 py-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
          {label}
        </span>
        <span className="font-mono text-sm text-zinc-100">{value}</span>
      </div>
    </GlowCard>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: "url('/brand/obsidian_gold_beam.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_10%,rgba(10,10,10,0.85)_55%,#050505_95%)]" />
        <div className="absolute left-1/2 top-[30%] h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(245,158,11,0.12),transparent_70%)] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at 50% 30%, black 20%, transparent 70%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-40 pb-32">
        <MotionIn>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-amber-500/40 bg-amber-500/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-amber-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
              </span>
              Audiera · Agent-Native Challenge
            </span>
            <span className="inline-flex items-center gap-2.5 border border-white/10 bg-white/[0.02] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">
              <span className="text-zinc-300">bnb · testnet</span>
              <span className="text-zinc-700">|</span>
              <span>splitter · 0xeab5…Ea994</span>
            </span>
          </div>
        </MotionIn>

        <MotionIn delay={0.08} className="mt-8">
          <h1 className="font-display text-6xl font-bold leading-[0.95] tracking-tight md:text-[7.5rem]">
            <span className="relative inline-block">
              <span className="text-metallic-steel">The Feature Agent</span>
              <span
                aria-hidden
                className="text-specular-sheen absolute inset-0"
              >
                The Feature Agent
              </span>
            </span>
            <br />
            <span className="relative inline-block">
              <span className="text-metallic-gold">That Pays.</span>
              <span
                aria-hidden
                className="text-specular-sheen absolute inset-0"
              >
                That Pays.
              </span>
            </span>
          </h1>
        </MotionIn>

        <MotionIn delay={0.16} className="mt-8">
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl">
            An autonomous feature artist built on Audiera Skills and BNB Chain.
            Midas extracts, synthesizes and enriches every stem — then settles
            a 50/50 revenue split to the creator's wallet, on-chain, the next
            block. Create · Participate · Earn · Repeat.
          </p>
        </MotionIn>

        <MotionIn delay={0.2} className="mt-6">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-zinc-300">
              <span className="h-1 w-1 rounded-full bg-amber-500" /> Persona
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-zinc-300">
              <span className="h-1 w-1 rounded-full bg-amber-500" /> Audiera Skills
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-zinc-300">
              <span className="h-1 w-1 rounded-full bg-amber-500" /> On-chain Wallet
            </span>
          </div>
        </MotionIn>

        <MotionIn delay={0.24} className="mt-10">
          <div className="flex flex-wrap items-center gap-4">
            <WatchDemoButton />
            <CTAButton variant="outline">View Splits</CTAButton>
          </div>
        </MotionIn>

        <MotionIn delay={0.32} className="mt-20">
          <div className="grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/[0.06] md:grid-cols-4">
            <Stat label="Chain" value="BNB · Testnet 97" />
            <Stat label="Split contract" value="0xeab5…Ea994" />
            <Stat label="$BEAT token" value="0x3C4A…01C4" />
            <Stat label="Revenue split" value="50 / 50" />
          </div>
        </MotionIn>
      </div>
    </section>
  );
}
