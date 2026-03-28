"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@workspace/ui/lib/utils";

// Make sure to register ScrollTrigger before using it
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function GsapTitle({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Use querySelectorAll to get the character spans
    const chars = el.querySelectorAll(".gsap-char");

    // Clear any previous animation/state if re-rendering
    gsap.set(chars, { yPercent: 120, rotationZ: 10, opacity: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(chars, {
              yPercent: 0,
              rotationZ: 0,
              opacity: 1,
              stagger: 0.05,
              duration: 1,
              ease: "expo.out",
              delay: delay,
            });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [text, delay]);

  // Split text by word then map to chars for correct space handling
  const words = text.split(" ");

  return (
    <h2
      ref={containerRef}
      className={cn("inline-block overflow-visible", className)}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-flex overflow-hidden pb-2 -mb-2 mr-[0.25em]">
          {word.split("").map((char, j) => (
            <span
              key={j}
              className="gsap-char inline-block will-change-transform"
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </h2>
  );
}
