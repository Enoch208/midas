import { Navbar } from "@/components/layout/navbar";
import { CreatorStudio } from "@/components/blocks/creator-studio";
import { AgentProvider } from "@/components/midas/agent-provider";

export default function TryPage() {
  return (
    <AgentProvider>
      <Navbar />
      <main className="relative">
        <section className="border-b border-white/[0.06]">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-20">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-400">
              Live Studio
            </span>
            <h1 className="max-w-4xl font-display text-5xl font-semibold tracking-tight md:text-7xl">
              <span className="relative inline-block">
                <span className="text-metallic-steel">Upload a stem.</span>
                <span aria-hidden className="text-specular-sheen absolute inset-0">
                  Upload a stem.
                </span>
              </span>{" "}
              <span className="relative inline-block">
                <span className="text-metallic-gold">Settle the split.</span>
                <span aria-hidden className="text-specular-sheen absolute inset-0">
                  Settle the split.
                </span>
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
              Drop a `.wav` or `.mp3`, run the full pipeline, and watch the creator split
              complete in one flow.
            </p>
          </div>
        </section>
        <CreatorStudio />
      </main>
    </AgentProvider>
  );
}
