"use client";

import { motion, type Transition } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  variant?: "solid" | "outline";
  onClick?: () => void;
};

const spring: Transition = { type: "spring", stiffness: 400, damping: 30 };

export function CTAButton({ children, variant = "solid", onClick }: Props) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-300";

  const styles =
    variant === "solid"
      ? "bg-amber-500 text-zinc-950 hover:bg-amber-400"
      : "border border-white/20 text-zinc-100 hover:border-amber-500/50 hover:text-amber-300";

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 0.98 }}
      transition={spring}
      className={cn(base, styles)}
    >
      {children}
    </motion.button>
  );
}
