"use client";

import React from "react"

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GSAPContextType {
  isReady: boolean;
}

const GSAPContext = createContext<GSAPContextType>({ isReady: false });

export function useGSAP() {
  return useContext(GSAPContext);
}

interface GSAPProviderProps {
  children: React.ReactNode;
}

export function GSAPProvider({ children }: GSAPProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Configure GSAP defaults
    gsap.config({
      nullTargetWarn: false,
    });

    // Set default ease
    gsap.defaults({
      ease: "power3.out",
      duration: 1,
    });

    // Refresh ScrollTrigger after fonts load
    if (document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    setIsReady(true);

    return () => {
      // Cleanup ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <GSAPContext.Provider value={{ isReady }}>{children}</GSAPContext.Provider>
  );
}

// Custom hooks for common GSAP animations
export function useScrollAnimation(
  ref: React.RefObject<HTMLElement | null>,
  options?: {
    start?: string;
    end?: string;
    scrub?: boolean | number;
    pin?: boolean;
    markers?: boolean;
  }
) {
  const { isReady } = useGSAP();

  useEffect(() => {
    if (!isReady || !ref.current) return;

    const element = ref.current;
    const ctx = gsap.context(() => {
      gsap.from(element, {
        y: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: element,
          start: options?.start || "top 85%",
          end: options?.end || "top 20%",
          scrub: options?.scrub || false,
          pin: options?.pin || false,
          markers: options?.markers || false,
          toggleActions: "play none none reverse",
        },
      });
    }, element);

    return () => ctx.revert();
  }, [isReady, ref, options]);
}

export function useTextReveal(ref: React.RefObject<HTMLElement | null>) {
  const { isReady } = useGSAP();

  useEffect(() => {
    if (!isReady || !ref.current) return;

    const element = ref.current;
    const words = element.querySelectorAll(".word");

    if (words.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(words, {
        y: 100,
        opacity: 0,
        rotationX: -90,
        stagger: 0.05,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, element);

    return () => ctx.revert();
  }, [isReady, ref]);
}

export function useParallax(
  ref: React.RefObject<HTMLElement | null>,
  speed: number = 0.5
) {
  const { isReady } = useGSAP();

  useEffect(() => {
    if (!isReady || !ref.current) return;

    const element = ref.current;
    const ctx = gsap.context(() => {
      gsap.to(element, {
        y: `${speed * 100}%`,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, element);

    return () => ctx.revert();
  }, [isReady, ref, speed]);
}
