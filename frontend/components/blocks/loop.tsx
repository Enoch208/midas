import { MotionIn } from "@/components/ui/motion-in";
import { StaggerGrid, StaggerItem } from "@/components/ui/stagger-grid";

type Beat = {
  index: string;
  action: string;
  title: string;
  body: string;
  tag: string;
};

const BEATS: Beat[] = [
  {
    index: "01",
    action: "Create",
    title: "Midas writes the feature",
    body:
      "Creator drops a stem. Midas extracts BPM / key via librosa, then calls the Audiera Lyrics Skill to synthesize a 4-bar feature verse matched to the track.",
    tag: "Audiera Lyrics Skill",
  },
  {
    index: "02",
    action: "Participate",
    title: "A full vocal track is minted",
    body:
      "The Audiera Music Skill generates a vocal rendering of the verse using one of Audiera's 12 native artists — turning the agent's contribution into an actual listenable song.",
    tag: "Audiera Music Skill",
  },
  {
    index: "03",
    action: "Earn",
    title: "$BEAT settles 50/50 on-chain",
    body:
      "The agent approves and calls executeFeatureSplit on the MidasSplitter contract. Half the BEAT routes to the creator's connected wallet. Half to the protocol. One block.",
    tag: "BNB Chain · $BEAT",
  },
  {
    index: "04",
    action: "Repeat",
    title: "Autonomously, every upload",
    body:
      "No queues, no approvals, no humans. Every stem uploaded triggers the same deterministic loop — the agent earns and compounds alongside the creators it features.",
    tag: "Autonomous loop",
  },
];

function BeatCard({ beat }: { beat: Beat }) {
  return (
    <div className="group relative h-full border border-white/10 bg-[#111113] transition-colors duration-500 hover:border-amber-500/50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(340px circle at var(--mx, 50%) var(--my, 0%), rgba(245,158,11,0.08), transparent 60%)",
        }}
      />
      <div className="relative flex h-full flex-col gap-5 p-7">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-400">
            {beat.index}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
            beat
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <h3 className="font-display text-3xl font-semibold tracking-tight text-zinc-100">
            {beat.action}
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            →
          </span>
        </div>
        <p className="font-display text-lg font-medium leading-snug tracking-tight text-zinc-200">
          {beat.title}
        </p>
        <p className="text-sm leading-relaxed text-zinc-400">{beat.body}</p>
        <div className="mt-auto border-t border-white/[0.06] pt-4">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300">
            <span className="h-1 w-1 rounded-full bg-amber-500" />
            {beat.tag}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Loop() {
  return (
    <section
      id="loop"
      className="relative isolate overflow-hidden border-t border-white/[0.06]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute inset-x-0 top-[10%] h-[60%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,158,11,0.05),transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-32">
        <MotionIn>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-400">
            02 · The Loop
          </span>
        </MotionIn>

        <MotionIn delay={0.08} className="mt-6">
          <h2 className="max-w-4xl font-display text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="relative inline-block">
              <span className="text-metallic-steel">Create. Participate. </span>
              <span aria-hidden className="text-specular-sheen absolute inset-0">
                Create. Participate.{" "}
              </span>
            </span>
            <span className="relative inline-block">
              <span className="text-metallic-gold">Earn. Repeat.</span>
              <span aria-hidden className="text-specular-sheen absolute inset-0">
                Earn. Repeat.
              </span>
            </span>
          </h2>
        </MotionIn>

        <MotionIn delay={0.16} className="mt-6 max-w-2xl">
          <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
            The Audiera Agent-Native loop, closed end-to-end by a single agent.
            Every step is automated, every settlement is on-chain, every dollar
            is routed the moment the block is sealed.
          </p>
        </MotionIn>

        <StaggerGrid className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {BEATS.map((beat) => (
            <StaggerItem key={beat.index}>
              <BeatCard beat={beat} />
            </StaggerItem>
          ))}
        </StaggerGrid>

        <MotionIn delay={0.24} className="mt-12">
          <div className="flex flex-col items-start gap-2 border-l-2 border-amber-500/50 pl-5 font-mono text-xs text-zinc-400">
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400">
              why it matters
            </span>
            <span className="max-w-2xl text-sm leading-relaxed text-zinc-300">
              Midas proves that an AI agent can own a wallet, consume Audiera
              Skills, produce real creative output, and receive its share of
              on-chain revenue — without a human in the middle. That's the
              Agent Economy.
            </span>
          </div>
        </MotionIn>
      </div>
    </section>
  );
}
