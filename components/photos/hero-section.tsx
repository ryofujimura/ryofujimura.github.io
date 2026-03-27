"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { AnimatedSVG } from "./animated-svg";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(overlayRef.current, { opacity: 0, duration: 1 });

      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll(".char");
        tl.from(
          chars,
          {
            y: 100,
            opacity: 0,
            rotationX: -90,
            stagger: 0.03,
            duration: 1.2,
          },
          "-=0.5"
        );
      }

      if (subtitleRef.current) {
        const words = subtitleRef.current.querySelectorAll(".word");
        tl.from(
          words,
          { y: 30, opacity: 0, stagger: 0.08, duration: 0.8 },
          "-=0.6"
        );
      }

      gsap.to(imageRef.current, {
        y: 150,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "power1.inOut",
      });

      gsap.to([titleRef.current, subtitleRef.current], {
        y: -50,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "40% top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const splitTitle = (text: string) => {
    return text.split("").map((char, i) => (
      <span
        key={i}
        className={cn("char inline-block", char === " " ? "w-[0.3em]" : "")}
        style={{ perspective: "1000px" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  const splitWords = (text: string) => {
    return text.split(" ").map((word, i) => (
      <span key={i} className="word inline-block mr-[0.3em]">
        {word}
      </span>
    ));
  };

  return (
    <section
      ref={heroRef}
      className="relative h-screen min-h-[600px] w-full overflow-hidden"
      aria-label="Hero section featuring Leonardo da Vinci"
    >
      <div ref={imageRef} className="absolute inset-0 scale-110">
        <Image
          src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1920&q=80"
          alt="Renaissance artwork inspired background"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-background"
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatedSVG
          variant="vitruvian"
          className="absolute top-[10%] left-[5%] w-32 h-32 md:w-48 md:h-48 opacity-20"
        />
        <AnimatedSVG
          variant="compass"
          className="absolute bottom-[20%] right-[8%] w-24 h-24 md:w-36 md:h-36 opacity-15"
        />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl">
          <p className="text-gold/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 md:mb-6 animate-fade-in">
            1452 — 1519
          </p>

          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-parchment tracking-tight leading-none mb-6 md:mb-8"
            style={{ perspective: "1000px" }}
          >
            {splitTitle("Leonardo")}
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            {splitTitle("da Vinci")}
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl md:text-2xl text-parchment/70 font-light max-w-2xl mx-auto leading-relaxed"
          >
            {splitWords("The Universal Genius — Painter, Sculptor, Architect, Inventor, Scientist")}
          </p>

          <div className="mt-8 md:mt-12 flex justify-center">
            <AnimatedSVG variant="ornament" className="w-48 md:w-64 opacity-60" />
          </div>
        </div>

        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-parchment/50 text-xs tracking-widest uppercase">
            Scroll to Explore
          </span>
          <svg
            className="w-6 h-6 text-gold/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 200px 50px rgba(0,0,0,0.5)" }}
        aria-hidden="true"
      />
    </section>
  );
}
