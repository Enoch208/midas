"use client";

import { motion, type Transition } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

const spring: Transition = { type: "spring", stiffness: 400, damping: 30 };

export function MotionIn({ children, delay = 0, y = 16, className }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ ...spring, delay }}
    >
      {children}
    </motion.div>
  );
}
