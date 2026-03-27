"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedSVGProps {
  className?: string;
  variant?: "vitruvian" | "flourish" | "compass" | "ornament";
  animate?: boolean;
}

export function AnimatedSVG({
  className,
  variant = "flourish",
  animate = true,
}: AnimatedSVGProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!animate || !svgRef.current) return;

    const paths = svgRef.current.querySelectorAll("path, circle, line");

    const ctx = gsap.context(() => {
      paths.forEach((path) => {
        const length = (path as SVGPathElement).getTotalLength?.() || 100;
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: svgRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, svgRef);

    return () => ctx.revert();
  }, [animate]);

  if (variant === "vitruvian") {
    return (
      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("stroke-sepia", className)}
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="80" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="60" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="40" strokeWidth="0.5" />
        <line x1="100" y1="10" x2="100" y2="190" strokeWidth="0.5" />
        <line x1="10" y1="100" x2="190" y2="100" strokeWidth="0.5" />
        <line x1="30" y1="30" x2="170" y2="170" strokeWidth="0.5" />
        <line x1="170" y1="30" x2="30" y2="170" strokeWidth="0.5" />
        <rect x="35" y="35" width="130" height="130" strokeWidth="0.5" />
      </svg>
    );
  }

  if (variant === "compass") {
    return (
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("stroke-sepia", className)}
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="45" strokeWidth="1" />
        <circle cx="50" cy="50" r="35" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="3" strokeWidth="1" />
        <path d="M50 10 L52 48 L50 55 L48 48 Z" strokeWidth="0.5" />
        <path d="M50 90 L48 52 L50 45 L52 52 Z" strokeWidth="0.5" />
        <path d="M10 50 L48 48 L55 50 L48 52 Z" strokeWidth="0.5" />
        <path d="M90 50 L52 52 L45 50 L52 48 Z" strokeWidth="0.5" />
      </svg>
    );
  }

  if (variant === "ornament") {
    return (
      <svg
        ref={svgRef}
        viewBox="0 0 300 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("stroke-sepia", className)}
        aria-hidden="true"
      >
        <path
          d="M0 25 Q75 0 150 25 Q225 50 300 25"
          strokeWidth="1"
        />
        <path
          d="M0 25 Q75 50 150 25 Q225 0 300 25"
          strokeWidth="1"
        />
        <circle cx="150" cy="25" r="5" strokeWidth="1" />
        <circle cx="75" cy="25" r="3" strokeWidth="1" />
        <circle cx="225" cy="25" r="3" strokeWidth="1" />
      </svg>
    );
  }

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("stroke-sepia", className)}
      aria-hidden="true"
    >
      <path
        d="M10 30 Q30 10 50 30 T90 30 T130 30 T170 30 Q190 30 190 30"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M40 30 Q60 50 80 30"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M120 30 Q140 50 160 30"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="100" cy="30" r="4" strokeWidth="1" />
    </svg>
  );
}

export function AnimatedDivider({ className }: { className?: string }) {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(lineRef.current, {
        scaleX: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: lineRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }, lineRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={lineRef}
      className={cn(
        "h-px bg-gradient-to-r from-transparent via-sepia to-transparent origin-center",
        className
      )}
      aria-hidden="true"
    />
  );
}
