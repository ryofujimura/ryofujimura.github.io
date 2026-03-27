"use client";

import React from "react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const navItems = [
  { label: "Works", href: "#gallery" },
  { label: "Showcase", href: "#showcase" },
  { label: "Biography", href: "#biography" },
  { label: "Contact", href: "#contact" },
];

export function PhotosNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuRef.current) return;
    if (isMobileMenuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
      const links = mobileMenuRef.current.querySelectorAll("a, button");
      gsap.fromTo(
        links,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [isMobileMenuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm py-3 md:py-4"
            : "bg-transparent py-4 md:py-6"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className={cn(
                "text-lg md:text-xl font-medium tracking-wide transition-colors duration-300",
                isScrolled ? "text-foreground" : "text-parchment"
              )}
            >
              <span className="font-light">Leonardo</span>
              <span className="font-semibold ml-1">DV</span>
            </Link>

            <ul className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className={cn(
                      "relative text-sm tracking-wide uppercase transition-colors duration-300 group",
                      isScrolled
                        ? "text-muted-foreground hover:text-foreground"
                        : "text-parchment/70 hover:text-parchment"
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full",
                        isScrolled ? "bg-accent" : "bg-gold"
                      )}
                    />
                  </a>
                </li>
              ))}
            </ul>

            <button
              className={cn(
                "md:hidden p-2 transition-colors duration-300",
                isScrolled ? "text-foreground" : "text-parchment"
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            id="mobile-menu"
            className={cn(
              "md:hidden absolute top-full left-0 right-0 border-t",
              isScrolled
                ? "bg-background/98 backdrop-blur-md border-border"
                : "bg-ink/95 backdrop-blur-md border-parchment/10"
            )}
          >
            <ul className="px-4 py-6 space-y-4">
              <li>
                <Link
                  href="/"
                  className={cn(
                    "block text-lg py-2 transition-colors duration-300",
                    isScrolled ? "text-foreground hover:text-accent" : "text-parchment hover:text-gold"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className={cn(
                      "block text-lg py-2 transition-colors duration-300",
                      isScrolled
                        ? "text-foreground hover:text-accent"
                        : "text-parchment hover:text-gold"
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
