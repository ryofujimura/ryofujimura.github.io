"use client";

import React from "react"

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedSVG, AnimatedDivider } from "./animated-svg";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const socialLinks = [
  { label: "Instagram", href: "#", ariaLabel: "Visit our Instagram page" },
  { label: "Twitter", href: "#", ariaLabel: "Visit our Twitter page" },
  { label: "Pinterest", href: "#", ariaLabel: "Visit our Pinterest page" },
];

const quickLinks = [
  { label: "Works", href: "#gallery" },
  { label: "Showcase", href: "#showcase" },
  { label: "Biography", href: "#biography" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!footerRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      const elements = contentRef.current?.children;
      if (elements) {
        gsap.from(elements, {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    }
  };

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="bg-ink text-parchment py-16 md:py-24"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={contentRef}>
          {/* Top Section */}
          <div className="text-center mb-12 md:mb-16">
            <AnimatedSVG
              variant="ornament"
              className="w-32 mx-auto mb-8 opacity-40"
            />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4">
              Leonardo da Vinci
            </h2>
            <p className="text-parchment/60 text-base md:text-lg max-w-xl mx-auto">
              Celebrating the eternal legacy of the Renaissance master whose
              vision continues to inspire humanity.
            </p>
          </div>

          <AnimatedDivider className="max-w-md mx-auto mb-12 md:mb-16 opacity-30" />

          {/* Links Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16">
            {/* Quick Links */}
            <div>
              <h3 className="text-gold text-sm tracking-[0.2em] uppercase mb-4">
                Explore
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="text-parchment/70 hover:text-parchment transition-colors duration-300 inline-flex items-center group"
                    >
                      <span className="w-0 group-hover:w-4 h-px bg-gold mr-0 group-hover:mr-2 transition-all duration-300" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-gold text-sm tracking-[0.2em] uppercase mb-4">
                Connect
              </h3>
              <ul className="space-y-3">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      aria-label={link.ariaLabel}
                      className="text-parchment/70 hover:text-parchment transition-colors duration-300 inline-flex items-center group"
                    >
                      <span className="w-0 group-hover:w-4 h-px bg-gold mr-0 group-hover:mr-2 transition-all duration-300" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-gold text-sm tracking-[0.2em] uppercase mb-4">
                Stay Inspired
              </h3>
              <p className="text-parchment/60 text-sm mb-4">
                Subscribe to receive updates on new discoveries and exhibitions.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex gap-2"
              >
                <label htmlFor="email-input" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="Your email"
                  className={cn(
                    "flex-1 px-4 py-2 bg-parchment/10 border border-parchment/20 rounded",
                    "text-parchment placeholder:text-parchment/40",
                    "focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold",
                    "transition-colors duration-300"
                  )}
                />
                <button
                  type="submit"
                  className={cn(
                    "px-4 py-2 bg-gold text-ink font-medium rounded",
                    "hover:bg-ochre transition-colors duration-300",
                    "focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-ink"
                  )}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Decorative Quote */}
          <div className="text-center mb-12 md:mb-16 py-8 border-y border-parchment/10">
            <blockquote>
              <p className="text-xl md:text-2xl font-light italic text-parchment/80 max-w-2xl mx-auto leading-relaxed">
                &ldquo;Where the spirit does not work with the hand, there is no art.&rdquo;
              </p>
            </blockquote>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-2">
              <AnimatedSVG
                variant="compass"
                className="w-6 h-6 opacity-60"
                animate={false}
              />
              <span className="text-parchment/60 text-sm">
                A tribute to eternal genius
              </span>
            </div>

            <p className="text-parchment/40 text-sm">
              &copy; {new Date().getFullYear()} Leonardo da Vinci Portfolio.
              Crafted with admiration.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "fixed bottom-6 right-6 p-3 rounded-full",
          "bg-gold/20 text-gold border border-gold/30",
          "hover:bg-gold/30 transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-ink",
          "opacity-0 pointer-events-none",
          "scroll-button"
        )}
        aria-label="Scroll to top"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </footer>
  );
}
