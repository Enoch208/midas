import { MotionIn } from "@/components/ui/motion-in";
import { UploadZone } from "@/components/midas/upload-zone";
import { MidasFeed } from "@/components/midas/midas-feed";

export function CreatorStudio() {
  return (
    <section
      id="studio"
      className="relative isolate overflow-hidden border-t border-white/[0.06]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(245,158,11,0.06),transparent_60%)]" />
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
        <MotionIn>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-400">
            01 · The Studio
          </span>
        </MotionIn>

        <MotionIn delay={0.08} className="mt-6">
          <h2 className="max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-6xl">
            <span className="relative inline-block">
              <span className="text-metallic-steel">Create. Participate. </span>
              <span aria-hidden className="text-specular-sheen absolute inset-0">
                Create. Participate.{" "}
              </span>
            </span>
            <span className="relative inline-block">
              <span className="text-metallic-gold">Earn.</span>
              <span aria-hidden className="text-specular-sheen absolute inset-0">
                Earn.
              </span>
            </span>
          </h2>
        </MotionIn>

        <MotionIn delay={0.16} className="mt-6 max-w-2xl">
          <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
            Drop a stem. Midas writes the feature, routes the split, and settles
            on BNB Chain — while you watch. No aggregators, no humans.
          </p>
        </MotionIn>

        <MotionIn delay={0.24} className="mt-16">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <UploadZone />
            <MidasFeed />
          </div>
        </MotionIn>
      </div>
    </section>
  );
}
