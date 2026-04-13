import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/blocks/hero";
import { Engine } from "@/components/blocks/engine";
import { Proof } from "@/components/blocks/proof";
import { AgentProvider } from "@/components/midas/agent-provider";

export default function Home() {
  return (
    <AgentProvider>
      <Navbar />
      <main className="relative">
        <Hero />
        <Engine />
        <Proof />
        <footer className="border-t border-white/[0.06]">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-10 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500 md:flex-row md:items-center">
            <span>midas · autonomous feature agent</span>
            <span>built for audiera · bnb chain · 0x7a9f…2e8b</span>
          </div>
        </footer>
      </main>
    </AgentProvider>
  );
}
