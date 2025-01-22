"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import { animatePageIn } from "~/utils/routeAnimation";

export default function Template({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    animatePageIn();
  }, []);
  return (
    <div>
      <div
        id="banner-1"
        className={`fixed left-0 top-0 z-10 min-h-screen w-1/4 ${resolvedTheme === "dark" ? "bg-white" : "bg-neutral-950"}`}
      />
      <div
        id="banner-2"
        className={`fixed left-1/4 top-0 z-10 min-h-screen w-1/4 ${resolvedTheme === "dark" ? "bg-white" : "bg-neutral-950"}`}
      />
      <div
        id="banner-3"
        className={`fixed left-2/4 top-0 z-10 min-h-screen w-1/4 ${resolvedTheme === "dark" ? "bg-white" : "bg-neutral-950"}`}
      />
      <div
        id="banner-4"
        className={`fixed left-3/4 top-0 z-10 min-h-screen w-1/4 ${resolvedTheme === "dark" ? "bg-white" : "bg-neutral-950"}`}
      />
      {children}
    </div>
  );
}
