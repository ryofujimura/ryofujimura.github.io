"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatedSVG, AnimatedDivider } from "./animated-svg";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const showcaseItems = [
  {
    id: "mona-lisa",
    title: "Mona Lisa",
    subtitle: "La Gioconda",
    year: "1503-1519",
    description:
      "Perhaps the most famous painting in the world, the Mona Lisa demonstrates Leonardo's mastery of sfumato — the subtle blending of colors and tones that creates an ethereal, dream-like quality. Her enigmatic smile has captivated viewers for over five centuries.",
    image:
      "https://images.unsplash.com/photo-1423742774270-6884aac775fa?w=1200&q=85",
    quote:
      "Art is never finished, only abandoned.",
  },
  {
    id: "last-supper",
    title: "The Last Supper",
    subtitle: "L'Ultima Cena",
    year: "1495-1498",
    description:
      "This monumental masterpiece captures the dramatic moment when Jesus announces that one of his disciples will betray him. Leonardo's revolutionary use of perspective draws the viewer's eye directly to Christ at the center of the composition.",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=85",
    quote:
      "Simplicity is the ultimate sophistication.",
  },
  {
    id: "vitruvian",
    title: "Vitruvian Man",
    subtitle: "Le proporzioni del corpo umano",
    year: "c. 1490",
    description:
      "The perfect synthesis of art and science, this iconic drawing explores the ideal proportions of the human body based on the writings of the ancient Roman architect Vitruvius. It embodies Leonardo's belief in the mathematical harmony underlying all of nature.",
    image:
      "https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?w=1200&q=85",
    quote:
      "Learning never exhausts the mind.",
  },
];

export function ShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Title animation on scroll
      gsap.from(titleRef.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // Horizontal scroll pinning for showcase items
      const panels = gsap.utils.toArray<HTMLElement>(".showcase-panel");
      
      if (panels.length > 0) {
        gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1,
            snap: 1 / (panels.length - 1),
            start: "top top",
            end: () => `+=${containerRef.current!.offsetWidth * (panels.length - 1)}`,
            anticipatePin: 1,
          },
        });

        // Animate each panel's content as it enters
        panels.forEach((panel, i) => {
          const image = panel.querySelector(".showcase-image");
          const content = panel.querySelector(".showcase-content");
          const quote = panel.querySelector(".showcase-quote");

          gsap.from(image, {
            scale: 1.2,
            opacity: 0.5,
            duration: 1,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: gsap.getById("horizontal") || undefined,
              start: "left center",
              end: "center center",
              scrub: true,
            },
          });

          gsap.from(content?.children || [], {
            y: 50,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: gsap.getById("horizontal") || undefined,
              start: "left center",
              toggleActions: "play none none reverse",
            },
          });

          if (quote) {
            gsap.from(quote, {
              x: 50,
              opacity: 0,
              duration: 1,
              delay: 0.3,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: gsap.getById("horizontal") || undefined,
                start: "left center",
                toggleActions: "play none none reverse",
              },
            });
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className="bg-ink overflow-hidden"
      aria-labelledby="showcase-title"
    >
      {/* Section Header */}
      <div ref={titleRef} className="py-16 md:py-24 text-center px-4">
        <AnimatedSVG
          variant="ornament"
          className="w-40 mx-auto mb-8 opacity-40"
        />
        <p className="text-gold/80 text-sm tracking-[0.3em] uppercase mb-4">
          Featured Works
        </p>
        <h2
          id="showcase-title"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-parchment mb-6"
        >
          The Masterpieces
        </h2>
        <p className="text-parchment/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Journey through Leonardo&apos;s most celebrated works, each a testament to
          his unparalleled genius and vision.
        </p>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={containerRef}
        className="relative h-screen flex overflow-hidden"
      >
        {showcaseItems.map((item, index) => (
          <ShowcasePanel key={item.id} item={item} index={index} total={showcaseItems.length} />
        ))}
      </div>

      {/* Bottom decoration */}
      <div className="py-8 md:py-12">
        <AnimatedDivider className="max-w-lg mx-auto opacity-40" />
      </div>
    </section>
  );
}

// Showcase Panel Component
interface ShowcasePanelProps {
  item: (typeof showcaseItems)[0];
  index: number;
  total: number;
}

function ShowcasePanel({ item, index, total }: ShowcasePanelProps) {
  return (
    <div
      className="showcase-panel flex-shrink-0 w-screen h-full relative flex items-center"
      aria-label={`${item.title}, ${index + 1} of ${total}`}
    >
      {/* Background Image */}
      <div className="showcase-image absolute inset-0">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority={index === 0}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Text Content */}
        <div className="showcase-content max-w-xl">
          {/* Progress indicator */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-gold text-sm tracking-widest">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="w-12 h-px bg-gold/40" />
            <span className="text-parchment/40 text-sm tracking-widest">
              {String(total).padStart(2, "0")}
            </span>
          </div>

          {/* Subtitle */}
          <p className="text-sepia text-sm md:text-base italic mb-2">
            {item.subtitle}
          </p>

          {/* Title */}
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-parchment mb-2">
            {item.title}
          </h3>

          {/* Year */}
          <p className="text-parchment/50 text-sm tracking-widest mb-6">
            {item.year}
          </p>

          {/* Description */}
          <p className="text-parchment/70 text-base md:text-lg leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Quote */}
        <div className="showcase-quote hidden lg:flex flex-col items-end justify-center">
          <blockquote className="text-right max-w-md">
            <AnimatedSVG
              variant="flourish"
              className="w-20 ml-auto mb-4 opacity-50"
            />
            <p className="text-xl md:text-2xl text-parchment/80 font-light italic leading-relaxed">
              &ldquo;{item.quote}&rdquo;
            </p>
            <footer className="mt-4 text-gold/60 text-sm tracking-widest">
              — Leonardo da Vinci
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Decorative elements */}
      <AnimatedSVG
        variant="compass"
        className="absolute bottom-8 right-8 w-16 h-16 md:w-24 md:h-24 opacity-10"
        animate={false}
      />
    </div>
  );
}
