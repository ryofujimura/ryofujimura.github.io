import React from "react";
import type { Metadata } from "next";
import "./photos.css";

export const metadata: Metadata = {
  title: "Photos | Gallery",
  description: "Photo gallery and showcase.",
};

export default function PhotosLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="photos-page min-h-screen scroll-smooth">{children}</div>;
}
