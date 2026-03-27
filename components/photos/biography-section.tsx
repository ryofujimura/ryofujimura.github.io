"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { AnimatedSVG, AnimatedDivider } from "./animated-svg";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const timelineEvents = [
  { year: "1452", title: "Birth", description: "Born in Vinci, Republic of Florence, as the illegitimate son of a notary." },
  { year: "1466", title: "Apprenticeship", description: "Begins training in the workshop of Andrea del Verrocchio in Florence." },
  { year: "1482", title: "Milan", description: "Moves to Milan to work for Duke Ludovico Sforza." },
  { year: "1495", title: "The Last Supper", description: "Begins work on his monumental mural in Santa Maria delle Grazie." },
  { year: "1503", title: "Mona Lisa", description: "Starts painting his most famous portrait, which he worked on for years." },
  { year: "1519", title: "Legacy", description: "Dies at Clos Lucé, France, leaving behind an unparalleled artistic legacy." },
];

const achievements = [
  { number: "6,000+", label: "Pages of Notes" },
  { number: "15", label: "Surviving Paintings" },
  { number: "100+", label: "Inventions Designed" },
  { number: "67", label: "Years of Genius" },
];

export function BiographySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      if (contentRef.current) {
        const elements = contentRef.current.children;
        gsap.from(elements, {
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (timelineRef.current) {
        const events = timelineRef.current.querySelectorAll(".timeline-event");
        events.forEach((event, i) => {
          gsap.from(event, {
            x: i % 2 === 0 ? -50 : 50,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: event,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        });
        const line = timelineRef.current.querySelector(".timeline-line");
        if (line) {
          gsap.from(line, {
            scaleY: 0,
            transformOrigin: "top",
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          });
        }
      }

      if (statsRef.current) {
        const statNumbers = statsRef.current.querySelectorAll(".stat-number");
        statNumbers.forEach((stat) => {
          gsap.from(stat, {
            textContent: 0,
            duration: 2,
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: stat,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="biography"
      className="py-20 md:py-32 bg-secondary"
      aria-labelledby="biography-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center mb-16 md:mb-24">
          <AnimatedSVG
            variant="vitruvian"
            className="w-20 h-20 mx-auto mb-6 opacity-30"
          />
          <p className="text-sepia text-sm tracking-[0.3em] uppercase mb-4">
            The Life of a Genius
          </p>
          <h2
            id="biography-title"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6"
          >
            Biography
          </h2>
          <AnimatedDivider className="max-w-xs mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20 md:mb-32">
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1577720643272-265f09367456?w=800&q=80"
                alt="Renaissance artistic representation"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
            </div>
            <div className="absolute -inset-4 border border-sepia/20 rounded-lg -z-10" />
            <div className="absolute -inset-8 border border-sepia/10 rounded-lg -z-10" />
          </div>

          <div ref={contentRef} className="flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl font-light text-foreground mb-6">
              The Universal Man
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Leonardo di ser Piero da Vinci was an Italian polymath of the High
              Renaissance who is widely considered one of the greatest painters of
              all time. His genius, perhaps more than that of any other figure,
              epitomized the Renaissance humanist ideal.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              While he was primarily known as a painter during his lifetime, his
              notebooks reveal a mind of boundless curiosity that delved into
              anatomy, astronomy, botany, cartography, painting, and paleontology.
              He conceptualized flying machines, concentrated solar power, an
              adding machine, and the double hull for ships.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Leonardo is revered not only for his technological ingenuity but also
              for his artistic mastery. His paintings, such as the Mona Lisa and
              The Last Supper, remain among the most recognizable and valuable
              works of art in the world.
            </p>
            <blockquote className="border-l-2 border-gold pl-6 py-2">
              <p className="text-lg md:text-xl text-foreground italic font-light leading-relaxed">
                &ldquo;I have been impressed with the urgency of doing. Knowing is not
                enough; we must apply. Being willing is not enough; we must do.&rdquo;
              </p>
              <footer className="mt-3 text-sepia text-sm tracking-widest">
                — Leonardo da Vinci
              </footer>
            </blockquote>
          </div>
        </div>

        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-20 md:mb-32"
        >
          {achievements.map((stat, i) => (
            <div
              key={i}
              className="text-center p-6 md:p-8 bg-card rounded-lg border border-border"
            >
              <p className="stat-number text-3xl md:text-4xl lg:text-5xl font-light text-accent mb-2">
                {stat.number}
              </p>
              <p className="text-muted-foreground text-sm md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h3 className="text-2xl md:text-3xl font-light text-foreground text-center mb-12">
            A Life in Time
          </h3>
          <div ref={timelineRef} className="relative">
            <div className="timeline-line absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />
            <div className="space-y-8 md:space-y-0">
              {timelineEvents.map((event, i) => (
                <div
                  key={event.year}
                  className={cn(
                    "timeline-event relative pl-12 md:pl-0 md:w-1/2",
                    i % 2 === 0
                      ? "md:pr-12 md:text-right"
                      : "md:ml-auto md:pl-12 md:text-left"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-2 w-3 h-3 rounded-full bg-gold border-2 border-background",
                      "left-[10px] md:left-auto",
                      i % 2 === 0 ? "md:right-[-6px]" : "md:left-[-6px]"
                    )}
                  />
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <span className="text-gold text-sm tracking-widest">{event.year}</span>
                    <h4 className="text-lg md:text-xl font-medium text-foreground mt-1 mb-2">
                      {event.title}
                    </h4>
                    <p className="text-muted-foreground text-sm md:text-base">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
