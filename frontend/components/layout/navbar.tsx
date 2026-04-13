import Link from "next/link";
import Image from "next/image";
import { WalletConnect } from "@/components/midas/wallet-connect";

const NAV = [
  { href: "/try", label: "Try Now" },
  { href: "/#proof", label: "Ledger" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-7 w-7 overflow-hidden rounded-full border border-amber-500/40 bg-[#111113]">
            <Image
              src="/brand/logo.jpeg"
              alt="Midas logo"
              fill
              sizes="28px"
              className="object-cover"
            />
          </span>
          <span className="font-display text-lg font-semibold tracking-[0.2em] text-zinc-100">
            MIDAS
          </span>
        </Link>

        <nav className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors duration-300 hover:text-amber-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <WalletConnect />
      </div>
    </header>
  );
}
