"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GSAPProvider } from "@/components/gsap-provider";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { GallerySection } from "@/components/gallery-section";
import { ShowcaseSection } from "@/components/showcase-section";
import { BiographySection } from "@/components/biography-section";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading for smoother entrance
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update scroll-to-top button visibility
    const handleScroll = () => {
      const scrollButton = document.querySelector(".scroll-button");
      if (scrollButton) {
        if (window.scrollY > 500) {
          scrollButton.classList.remove("opacity-0", "pointer-events-none");
          scrollButton.classList.add("opacity-100", "pointer-events-auto");
        } else {
          scrollButton.classList.add("opacity-0", "pointer-events-none");
          scrollButton.classList.remove("opacity-100", "pointer-events-auto");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Refresh ScrollTrigger after all content loads
    if (!isLoading) {
      ScrollTrigger.refresh();
    }
  }, [isLoading]);

  return (
    <GSAPProvider>
      {/* Loading Screen */}
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-ink flex items-center justify-center transition-opacity duration-700",
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!isLoading}
      >
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <svg
              className="w-full h-full animate-spin"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="2"
                className="text-parchment/20"
              />
              <path
                d="M50 10 A40 40 0 0 1 90 50"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-gold"
              />
            </svg>
          </div>
          <p className="text-parchment/60 text-sm tracking-widest uppercase">
            Loading
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className={cn(isLoading && "invisible")}>
        <Navigation />
        <HeroSection />
        <GallerySection />
        <ShowcaseSection />
        <BiographySection />
        <Footer />
      </main>

      {/* Skip to content link for accessibility */}
      <a
        href="#gallery"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold focus:text-ink focus:rounded"
      >
        Skip to main content
      </a>
    </GSAPProvider>
  );
}
