import Link from "next/link";
import { MotionIn } from "@/components/ui/motion-in";
import { StaggerGrid, StaggerItem } from "@/components/ui/stagger-grid";
import { GlowCard } from "@/components/ui/glow-card";

type Step = {
  index: string;
  title: string;
  blurb: string;
  data: { label: string; value: string }[];
};

const STEPS: Step[] = [
  {
    index: "01",
    title: "Extract",
    blurb:
      "Raw audio ingested. Stems, waveforms and on-chain metadata pulled in a single pass.",
    data: [
      { label: "source", value: "audio.wav" },
      { label: "cid",    value: "bafybei…k7q2" },
      { label: "t",      value: "18ms"         },
    ],
  },
  {
    index: "02",
    title: "Synthesize",
    blurb:
      "Feature vectors generated. BPM, key, texture and provenance signed by the agent.",
    data: [
      { label: "bpm", value: "128"       },
      { label: "key", value: "F#m"       },
      { label: "sig", value: "0x…9a41"   },
    ],
  },
  {
    index: "03",
    title: "Elevate",
    blurb:
      "Track scored against the ledger. Tier assigned. Routing weighted to the rails.",
    data: [
      { label: "score", value: "0.942" },
      { label: "tier",  value: "A+"    },
      { label: "rails", value: "3"     },
    ],
  },
  {
    index: "04",
    title: "Enrich",
    blurb:
      "Revenue minted, split 50/50 between artist and protocol, settled the next block.",
    data: [
      { label: "split", value: "50 / 50" },
      { label: "token", value: "$BEAT"   },
      { label: "tx",    value: "0x…2e8b" },
    ],
  },
];

function StepCard({ step }: { step: Step }) {
  return (
    <GlowCard className="h-full rounded-none">
      <div className="flex h-full flex-col p-8">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-400">
            {step.index}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
            step
          </span>
        </div>

        <h3 className="mt-8 font-display text-3xl font-semibold tracking-tight text-zinc-100">
          {step.title}
        </h3>

        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          {step.blurb}
        </p>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/[0.06] pt-6 font-mono text-xs">
          {step.data.map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-zinc-500">{row.label}</span>
              <span className="text-zinc-100">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </GlowCard>
  );
}

export function Engine() {
  return (
    <section
      id="engine"
      className="relative isolate overflow-hidden border-t border-white/[0.06]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-x-0 bottom-0 h-[80%] bg-cover bg-bottom opacity-45"
          style={{ backgroundImage: "url('/brand/amber_waveform.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#0a0a0a_0%,rgba(10,10,10,0.85)_35%,rgba(10,10,10,0.65)_65%,#0a0a0a_100%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-32">
        <MotionIn>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-400">
            01 · The Engine
          </span>
        </MotionIn>

        <MotionIn delay={0.08} className="mt-6">
          <h2 className="max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="relative inline-block">
              <span className="text-metallic-steel">Four steps from </span>
              <span aria-hidden className="text-specular-sheen absolute inset-0">
                Four steps from{" "}
              </span>
            </span>
            <span className="relative inline-block">
              <span className="text-metallic-gold">waveform</span>
              <span aria-hidden className="text-specular-sheen absolute inset-0">
                waveform
              </span>
            </span>
            <span className="relative inline-block">
              <span className="text-metallic-steel"> to settled revenue.</span>
              <span aria-hidden className="text-specular-sheen absolute inset-0">
                {" "}to settled revenue.
              </span>
            </span>
          </h2>
        </MotionIn>

        <MotionIn delay={0.16} className="mt-6 max-w-2xl">
          <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
            The pipeline runs on every upload. Sub-second extraction,
            deterministic scoring, on-chain settlement — no humans in the loop.
          </p>
        </MotionIn>

        <StaggerGrid className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <StaggerItem key={step.index}>
              <StepCard step={step} />
            </StaggerItem>
          ))}
        </StaggerGrid>

        <MotionIn delay={0.24} className="mt-12">
          <Link
            href="/try"
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-200 transition-colors duration-300 hover:border-amber-500/50 hover:text-amber-300"
          >
            <span className="h-1 w-1 rounded-full bg-amber-500" />
            Run the pipeline live
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </MotionIn>
      </div>
    </section>
  );
}
