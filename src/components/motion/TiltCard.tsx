"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";

export function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function reset() {
    const node = ref.current;
    if (!node) return;
    node.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
    node.style.setProperty("--gx", "50%");
    node.style.setProperty("--gy", "50%");
  }

  function onMove(event: React.MouseEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) {
      return;
    }
    const box = node.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    const rotateX = (0.5 - y) * 14;
    const rotateY = (x - 0.5) * 18;
    node.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(18px)`;
    node.style.setProperty("--gx", `${x * 100}%`);
    node.style.setProperty("--gy", `${y * 100}%`);
  }

  return (
    <div className={cn("tilt-scene", className)}>
      <div ref={ref} className="tilt-card overflow-hidden rounded-2xl" onMouseMove={onMove} onMouseLeave={reset}>
        <div className="tilt-shine" />
        {children}
      </div>
    </div>
  );
}
