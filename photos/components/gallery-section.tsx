"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { artworks, categories, type ArtworkCategory, type Artwork } from "@/lib/gallery-data";
import { AnimatedDivider } from "./animated-svg";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<ArtworkCategory>("all");
  const [filteredArtworks, setFilteredArtworks] = useState(artworks);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Filter artworks when category changes
  useEffect(() => {
    const filtered =
      activeCategory === "all"
        ? artworks
        : artworks.filter((art) => art.category === activeCategory);
    setFilteredArtworks(filtered);
  }, [activeCategory]);

  // Animate grid items when filtered artworks change
  useEffect(() => {
    if (!gridRef.current) return;

    const items = gridRef.current.querySelectorAll(".gallery-item");
    gsap.fromTo(
      items,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
      }
    );
  }, [filteredArtworks]);

  // Initial scroll animation
  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCategoryChange = (category: ArtworkCategory) => {
    setActiveCategory(category);
  };

  const handleArtworkClick = useCallback((artwork: Artwork) => {
    setSelectedArtwork(artwork);
    document.body.style.overflow = "hidden";
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setSelectedArtwork(null);
    document.body.style.overflow = "";
  }, []);

  // Close lightbox on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedArtwork) {
        handleCloseLightbox();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedArtwork, handleCloseLightbox]);

  return (
    <>
      <section
        ref={sectionRef}
        id="gallery"
        className="py-20 md:py-32 bg-background"
        aria-labelledby="gallery-title"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div ref={titleRef} className="text-center mb-12 md:mb-16">
            <p className="text-sepia text-sm tracking-[0.3em] uppercase mb-4">
              The Collection
            </p>
            <h2
              id="gallery-title"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6"
            >
              Masterworks
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Explore the extraordinary range of Leonardo&apos;s genius, from iconic
              paintings to revolutionary inventions and groundbreaking anatomical
              studies.
            </p>
            <AnimatedDivider className="max-w-xs mx-auto mt-8" />
          </div>

          {/* Filter Tabs */}
          <div
            className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12"
            role="tablist"
            aria-label="Filter artworks by category"
          >
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                role="tab"
                aria-selected={activeCategory === cat.value}
                aria-controls="gallery-grid"
                className={cn(
                  "px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-full transition-all duration-300",
                  "border border-border hover:border-sepia",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
                  activeCategory === cat.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <div
            ref={gridRef}
            id="gallery-grid"
            className="masonry-grid"
            role="tabpanel"
            aria-label={`Showing ${filteredArtworks.length} artworks`}
          >
            {filteredArtworks.map((artwork) => (
              <GalleryItem
                key={artwork.id}
                artwork={artwork}
                onClick={() => handleArtworkClick(artwork)}
              />
            ))}
          </div>

          {/* Empty state */}
          {filteredArtworks.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No artworks found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedArtwork && (
        <Lightbox artwork={selectedArtwork} onClose={handleCloseLightbox} />
      )}
    </>
  );
}

// Gallery Item Component
interface GalleryItemProps {
  artwork: Artwork;
  onClick: () => void;
}

function GalleryItem({ artwork, onClick }: GalleryItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px 0px", threshold: 0.01 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const aspectClasses = {
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    square: "aspect-square",
  };

  return (
    <div ref={itemRef} className="gallery-item masonry-item group">
      <button
        onClick={onClick}
        className={cn(
          "relative w-full overflow-hidden rounded-lg",
          "bg-muted transition-all duration-500",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4",
          "cursor-pointer",
          aspectClasses[artwork.aspectRatio]
        )}
        aria-label={`View ${artwork.title}, ${artwork.year}`}
      >
        {/* Image */}
        {isInView && (
          <Image
            src={artwork.image || "/placeholder.svg"}
            alt={artwork.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={cn(
              "object-cover transition-all duration-700",
              "group-hover:scale-105",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
          />
        )}

        {/* Loading placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Hover Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            "flex flex-col justify-end p-4 md:p-6"
          )}
        >
          <span className="text-gold text-xs tracking-widest uppercase mb-1">
            {artwork.category}
          </span>
          <h3 className="text-parchment text-lg md:text-xl font-medium mb-1">
            {artwork.title}
          </h3>
          <p className="text-parchment/70 text-sm">{artwork.year}</p>
        </div>
      </button>

      {/* Caption below image */}
      <div className="mt-3 px-1">
        <h3 className="text-sm md:text-base font-medium text-foreground">
          {artwork.title}
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground">{artwork.year}</p>
      </div>
    </div>
  );
}

// Lightbox Component
interface LightboxProps {
  artwork: Artwork;
  onClose: () => void;
}

function Lightbox({ artwork, onClose }: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, delay: 0.1, ease: "power3.out" }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
    gsap.to(contentRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.2,
      onComplete: onClose,
    });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/95 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-card rounded-lg shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-ink/50 text-parchment hover:bg-ink/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          aria-label="Close lightbox"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto md:min-h-[500px] bg-muted">
            <Image
              src={artwork.image || "/placeholder.svg"}
              alt={artwork.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 lg:p-12 flex flex-col justify-center">
            <span className="text-sepia text-xs tracking-[0.2em] uppercase mb-2">
              {artwork.category}
            </span>
            <h2
              id="lightbox-title"
              className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground mb-2"
            >
              {artwork.title}
            </h2>
            <p className="text-muted-foreground text-lg mb-6">{artwork.year}</p>
            
            <p className="text-foreground/80 leading-relaxed mb-6">
              {artwork.description}
            </p>

            {artwork.medium && (
              <div className="mb-4">
                <span className="text-muted-foreground text-sm">Medium:</span>
                <p className="text-foreground">{artwork.medium}</p>
              </div>
            )}

            {artwork.location && (
              <div>
                <span className="text-muted-foreground text-sm">Location:</span>
                <p className="text-foreground">{artwork.location}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
