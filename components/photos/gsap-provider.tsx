"use client";

import React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

    gsap.config({ nullTargetWarn: false });
    gsap.defaults({ ease: "power3.out", duration: 1 });

    if (document.fonts) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    setIsReady(true);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <GSAPContext.Provider value={{ isReady }}>{children}</GSAPContext.Provider>
  );
}
