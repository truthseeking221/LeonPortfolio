"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { cn } from "@workspace/ui/lib/utils";

export function MagneticButton({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Optional: Add hover text splitting/stitching if necessary, but just basic magnetic for now
    
    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      gsap.to(el, { x: x * 0.35, y: y * 0.35, duration: 1, ease: "power3.out" });
    };

    const onMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div ref={ref} className={cn("inline-block", className)} style={{ transformOrigin: 'center center', willChange: 'transform' }}>
      {children}
    </div>
  );
}
