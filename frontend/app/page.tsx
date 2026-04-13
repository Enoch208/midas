import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/blocks/hero";
import { Persona } from "@/components/blocks/persona";
import { Engine } from "@/components/blocks/engine";
import { Loop } from "@/components/blocks/loop";
import { Proof } from "@/components/blocks/proof";
import { AgentProvider } from "@/components/midas/agent-provider";

const HASHTAGS = ["#AudieraAI", "#BEAT", "#BinanceAI", "#AgentEconomy"];

export default function Home() {
  return (
    <AgentProvider>
      <Navbar />
      <main className="relative">
        <Hero />
        <Persona />
        <Engine />
        <Loop />
        <Proof />

        <footer className="border-t border-white/[0.06]">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12">
            <div className="flex flex-col gap-8 border-b border-white/[0.06] pb-8 md:flex-row md:items-start md:justify-between">
              <div className="flex max-w-md flex-col gap-3">
                <span className="flex items-center gap-2 font-display text-lg font-semibold tracking-[0.2em] text-zinc-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  MIDAS
                </span>
                <p className="text-sm leading-relaxed text-zinc-400">
                  Autonomous feature agent for the Audiera Participation
                  Economy. Built for the Agent-Native Challenge · BNB Chain.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 font-mono text-[11px] uppercase tracking-[0.25em] md:grid-cols-3">
                <div className="flex flex-col gap-3">
                  <span className="text-zinc-500">Skills</span>
                  <Link
                    href="https://github.com/audiera/lyrics-skill"
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-200 transition-colors duration-300 hover:text-amber-300"
                  >
                    Lyrics ↗
                  </Link>
                  <Link
                    href="https://github.com/audiera/music-skill"
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-200 transition-colors duration-300 hover:text-amber-300"
                  >
                    Music ↗
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-zinc-500">On-chain</span>
                  <Link
                    href="https://testnet.bscscan.com/address/0x3C4A79c3C45bcB31b892403181BFB558efB901C4"
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-200 transition-colors duration-300 hover:text-amber-300"
                  >
                    $BEAT ↗
                  </Link>
                  <Link
                    href="https://testnet.bscscan.com/address/0xeab5F2f3308FC8c8a6f98119F7603451Dc6Ea994"
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-200 transition-colors duration-300 hover:text-amber-300"
                  >
                    Splitter ↗
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-zinc-500">Agent</span>
                  <Link
                    href="/try"
                    className="text-zinc-200 transition-colors duration-300 hover:text-amber-300"
                  >
                    Try Now →
                  </Link>
                  <Link
                    href="#proof"
                    className="text-zinc-200 transition-colors duration-300 hover:text-amber-300"
                  >
                    Live Ledger →
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500 md:flex-row md:items-center">
              <div className="flex flex-wrap items-center gap-3">
                {HASHTAGS.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-amber-500/30 bg-amber-500/5 px-3 py-1 text-amber-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span>midas · v1.2.0</span>
                <span className="text-zinc-700">|</span>
                <span>built for audiera · bnb chain</span>
                <span className="text-zinc-700">|</span>
                <span>human + agent · one economy</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </AgentProvider>
  );
}
