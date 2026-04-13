"use client";

import { useRouter } from "next/navigation";
import { CTAButton } from "@/components/ui/cta-button";

export function WatchDemoButton() {
  const router = useRouter();

  const onClick = () => {
    router.push("/try");
  };

  return (
    <CTAButton variant="solid" onClick={onClick}>
      Try Now
      <span aria-hidden>→</span>
    </CTAButton>
  );
}
