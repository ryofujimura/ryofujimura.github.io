"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

/**
 * AI/RAG/Edge Model visualization for hero section.
 * Features neural network, document retrieval flows, edge nodes,
 * and continuous data processing animations.
 */
export function HeroBrutalistRight() {
  const containerRef = useRef<HTMLDivElement>(null)
  const neuralCoreRef = useRef<SVGGElement>(null)
  const ragFlowRef = useRef<SVGGElement>(null)
  const edgeNodesRef = useRef<SVGGElement>(null)
  const dataParticlesRef = useRef<SVGGElement>(null)
  const connectionsRef = useRef<SVGGElement>(null)
  const labelsRef = useRef<SVGGElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Reveal the SVG container first
      const svg = containerRef.current?.querySelector("svg")
      if (svg) {
        gsap.to(svg, {
          opacity: 1,
          duration: 0.3,
          delay: 0.1,
          ease: "power2.out",
        })
      }

      // Helper: animate stroke-dashoffset for path drawing
      const drawPaths = (
        group: SVGGElement | null,
        duration: number,
        delay: number,
        stagger = 0.03
      ) => {
        if (!group) return
        const paths = group.querySelectorAll("path, line, polyline, circle, rect, ellipse")
        paths.forEach((el) => {
          const geom = el as SVGGeometryElement
          if (typeof geom.getTotalLength === "function") {
            try {
              const len = geom.getTotalLength()
              gsap.set(geom, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 })
            } catch {
              gsap.set(geom, { opacity: 0 })
            }
          } else {
            gsap.set(geom, { opacity: 0 })
          }
        })
        gsap.to(paths, {
          strokeDashoffset: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: "power2.inOut",
        })
      }

      // === LOADING ANIMATIONS ===
      
      // 1. Draw neural core first
      drawPaths(neuralCoreRef.current, 1.5, 0.2, 0.05)

      // 2. Draw connections from core
      drawPaths(connectionsRef.current, 1.2, 0.8, 0.04)

      // 3. Draw edge nodes
      drawPaths(edgeNodesRef.current, 1.0, 1.2, 0.06)

      // 4. Draw RAG flow elements
      drawPaths(ragFlowRef.current, 1.4, 1.0, 0.03)

      // 5. Reveal labels
      if (labelsRef.current) {
        const texts = labelsRef.current.querySelectorAll("text")
        gsap.set(texts, { opacity: 0, y: 5 })
        gsap.to(texts, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 2.0,
          stagger: 0.08,
          ease: "power3.out",
        })
      }

      // 6. Animate data particles entrance
      if (dataParticlesRef.current) {
        const particles = dataParticlesRef.current.querySelectorAll("circle")
        gsap.set(particles, { scale: 0, transformOrigin: "center center" })
        gsap.to(particles, {
          scale: 1,
          duration: 0.4,
          delay: 1.8,
          stagger: 0.05,
          ease: "back.out(2)",
        })
      }

      // === CONTINUOUS ANIMATIONS ===

      // Neural core pulse - constant "thinking" animation
      const corePulse = neuralCoreRef.current?.querySelector(".core-pulse")
      if (corePulse) {
        gsap.to(corePulse, {
          scale: 1.15,
          opacity: 0.3,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2.5,
        })
      }

      // Neural rings rotation
      const neuralRings = neuralCoreRef.current?.querySelectorAll(".neural-ring")
      if (neuralRings) {
        neuralRings.forEach((ring, i) => {
          gsap.to(ring, {
            rotation: i % 2 === 0 ? 360 : -360,
            duration: 20 + i * 5,
            repeat: -1,
            ease: "none",
            transformOrigin: "225px 350px",
            delay: 2,
          })
        })
      }

      // Data particles flowing through system
      const particles = dataParticlesRef.current?.querySelectorAll(".data-particle")
      if (particles) {
        particles.forEach((particle, i) => {
          const paths = [
            // Flow to core
            { x: [0, -50, -80], y: [0, -30, -60], duration: 3 },
            { x: [0, 40, 60], y: [0, -40, -80], duration: 3.5 },
            { x: [0, -30, -50], y: [0, 40, 70], duration: 2.8 },
            // Flow from documents
            { x: [0, 30, 50, 30, 0], y: [0, -20, -40, -60, -80], duration: 4 },
            { x: [0, -20, -40, -30, -10], y: [0, 30, 50, 70, 90], duration: 3.8 },
          ]
          const path = paths[i % paths.length]
          
          gsap.to(particle, {
            motionPath: {
              path: `M0,0 Q${path.x[1]},${path.y[1]} ${path.x[2]},${path.y[2]}`,
              autoRotate: false,
            },
            duration: path.duration,
            repeat: -1,
            ease: "none",
            delay: 2.5 + i * 0.3,
          })

          // Particle pulse
          gsap.to(particle, {
            opacity: 0.3,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 2.5 + i * 0.15,
          })
        })
      }

      // Edge nodes pulse - showing active inference
      const edgeNodeCircles = edgeNodesRef.current?.querySelectorAll(".edge-pulse")
      if (edgeNodeCircles) {
        edgeNodeCircles.forEach((node, i) => {
          gsap.to(node, {
            scale: 1.3,
            opacity: 0,
            duration: 1.2,
            repeat: -1,
            ease: "power1.out",
            delay: 2.5 + i * 0.4,
          })
        })
      }

      // Connection lines pulse - data transfer
      const connectionLines = connectionsRef.current?.querySelectorAll(".connection-pulse")
      if (connectionLines) {
        connectionLines.forEach((line, i) => {
          gsap.to(line, {
            strokeDashoffset: -40,
            duration: 1.5,
            repeat: -1,
            ease: "none",
            delay: 2.5 + i * 0.2,
          })
        })
      }

      // RAG document stack - retrieval animation
      const ragDocs = ragFlowRef.current?.querySelectorAll(".rag-doc")
      if (ragDocs) {
        ragDocs.forEach((doc, i) => {
          gsap.to(doc, {
            y: -3,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 2.5 + i * 0.2,
          })
        })
      }

      // Vector embedding visualization
      const embeddings = ragFlowRef.current?.querySelectorAll(".embedding-dot")
      if (embeddings) {
        gsap.to(embeddings, {
          opacity: 0.3,
          duration: 0.6,
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.1, from: "random" },
          ease: "sine.inOut",
          delay: 2.5,
        })
      }

      // Processing indicator rotation
      const processingRing = neuralCoreRef.current?.querySelector(".processing-ring")
      if (processingRing) {
        gsap.to(processingRing, {
          rotation: 360,
          duration: 8,
          repeat: -1,
          ease: "none",
          transformOrigin: "225px 350px",
          delay: 2,
        })
      }

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="hidden lg:block absolute right-0 top-0 h-full w-[45%] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full opacity-0"
        viewBox="0 0 450 700"
        preserveAspectRatio="xMaxYMid slice"
        fill="none"
      >
        {/* Connection lines from core to edge nodes */}
        <g ref={connectionsRef} stroke="currentColor" className="text-foreground/15">
          {/* Main data highways */}
          <path
            d="M 225 350 Q 150 300 80 200"
            strokeWidth="0.5"
            className="connection-pulse"
            strokeDasharray="4 4"
          />
          <path
            d="M 225 350 Q 280 280 350 180"
            strokeWidth="0.5"
            className="connection-pulse"
            strokeDasharray="4 4"
          />
          <path
            d="M 225 350 Q 160 400 70 450"
            strokeWidth="0.5"
            className="connection-pulse"
            strokeDasharray="4 4"
          />
          <path
            d="M 225 350 Q 300 420 380 500"
            strokeWidth="0.5"
            className="connection-pulse"
            strokeDasharray="4 4"
          />
          <path
            d="M 225 350 L 225 550"
            strokeWidth="0.5"
            className="connection-pulse"
            strokeDasharray="4 4"
          />
          
          {/* Secondary connections */}
          <line x1="80" y1="200" x2="120" y2="140" strokeWidth="0.3" />
          <line x1="350" y1="180" x2="400" y2="120" strokeWidth="0.3" />
          <line x1="70" y1="450" x2="50" y2="520" strokeWidth="0.3" />
          <line x1="380" y1="500" x2="410" y2="560" strokeWidth="0.3" />
        </g>

        {/* Neural Core - Central AI Model */}
        <g ref={neuralCoreRef} className="text-foreground/30">
          {/* Outer processing ring */}
          <circle
            cx="225"
            cy="350"
            r="85"
            stroke="currentColor"
            strokeWidth="0.4"
            strokeDasharray="8 4 2 4"
            className="processing-ring"
          />
          
          {/* Neural network rings */}
          <circle
            cx="225"
            cy="350"
            r="70"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="3 6"
            className="neural-ring"
          />
          <circle
            cx="225"
            cy="350"
            r="55"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="12 4"
            className="neural-ring"
          />
          <circle
            cx="225"
            cy="350"
            r="40"
            stroke="currentColor"
            strokeWidth="0.5"
            className="neural-ring"
          />
          
          {/* Core pulse effect */}
          <circle
            cx="225"
            cy="350"
            r="25"
            stroke="currentColor"
            strokeWidth="1"
            className="core-pulse text-foreground/40"
          />
          
          {/* Inner core - the "brain" */}
          <circle
            cx="225"
            cy="350"
            r="15"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-foreground/50"
          />
          <circle
            cx="225"
            cy="350"
            r="5"
            fill="currentColor"
            className="text-foreground/60"
          />
          
          {/* Neural pathway lines inside core */}
          <path
            d="M 210 340 Q 225 350 240 340"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-foreground/40"
          />
          <path
            d="M 210 360 Q 225 350 240 360"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-foreground/40"
          />
          <path
            d="M 215 335 L 215 365"
            stroke="currentColor"
            strokeWidth="0.3"
            className="text-foreground/30"
          />
          <path
            d="M 235 335 L 235 365"
            stroke="currentColor"
            strokeWidth="0.3"
            className="text-foreground/30"
          />
        </g>

        {/* Edge Nodes - Distributed Computing */}
        <g ref={edgeNodesRef} stroke="currentColor" className="text-foreground/25">
          {/* Edge node 1 - Top left */}
          <g transform="translate(80, 200)">
            <rect x="-12" y="-12" width="24" height="24" strokeWidth="0.6" rx="2" />
            <circle cx="0" cy="0" r="18" strokeWidth="0.3" className="edge-pulse" />
            <line x1="-6" y1="0" x2="6" y2="0" strokeWidth="0.5" />
            <line x1="0" y1="-6" x2="0" y2="6" strokeWidth="0.5" />
          </g>
          
          {/* Edge node 2 - Top right */}
          <g transform="translate(350, 180)">
            <rect x="-12" y="-12" width="24" height="24" strokeWidth="0.6" rx="2" />
            <circle cx="0" cy="0" r="18" strokeWidth="0.3" className="edge-pulse" />
            <line x1="-6" y1="0" x2="6" y2="0" strokeWidth="0.5" />
            <line x1="0" y1="-6" x2="0" y2="6" strokeWidth="0.5" />
          </g>
          
          {/* Edge node 3 - Bottom left */}
          <g transform="translate(70, 450)">
            <rect x="-12" y="-12" width="24" height="24" strokeWidth="0.6" rx="2" />
            <circle cx="0" cy="0" r="18" strokeWidth="0.3" className="edge-pulse" />
            <line x1="-6" y1="0" x2="6" y2="0" strokeWidth="0.5" />
            <line x1="0" y1="-6" x2="0" y2="6" strokeWidth="0.5" />
          </g>
          
          {/* Edge node 4 - Bottom right */}
          <g transform="translate(380, 500)">
            <rect x="-12" y="-12" width="24" height="24" strokeWidth="0.6" rx="2" />
            <circle cx="0" cy="0" r="18" strokeWidth="0.3" className="edge-pulse" />
            <line x1="-6" y1="0" x2="6" y2="0" strokeWidth="0.5" />
            <line x1="0" y1="-6" x2="0" y2="6" strokeWidth="0.5" />
          </g>
          
          {/* Smaller edge processors */}
          <g transform="translate(120, 140)">
            <rect x="-8" y="-8" width="16" height="16" strokeWidth="0.4" rx="1" />
          </g>
          <g transform="translate(400, 120)">
            <rect x="-8" y="-8" width="16" height="16" strokeWidth="0.4" rx="1" />
          </g>
          <g transform="translate(50, 520)">
            <rect x="-8" y="-8" width="16" height="16" strokeWidth="0.4" rx="1" />
          </g>
          <g transform="translate(410, 560)">
            <rect x="-8" y="-8" width="16" height="16" strokeWidth="0.4" rx="1" />
          </g>
        </g>

        {/* RAG Flow - Document Retrieval */}
        <g ref={ragFlowRef} stroke="currentColor" className="text-foreground/20">
          {/* Document stack */}
          <g transform="translate(225, 580)">
            {/* Documents */}
            <rect x="-30" y="0" width="60" height="40" strokeWidth="0.5" rx="2" className="rag-doc" />
            <rect x="-25" y="-5" width="50" height="35" strokeWidth="0.4" rx="2" className="rag-doc" />
            <rect x="-20" y="-10" width="40" height="30" strokeWidth="0.4" rx="2" className="rag-doc" />
            
            {/* Document lines (text representation) */}
            <line x1="-20" y1="10" x2="10" y2="10" strokeWidth="0.3" />
            <line x1="-20" y1="16" x2="15" y2="16" strokeWidth="0.3" />
            <line x1="-20" y1="22" x2="5" y2="22" strokeWidth="0.3" />
            <line x1="-20" y1="28" x2="20" y2="28" strokeWidth="0.3" />
          </g>
          
          {/* Vector embeddings visualization */}
          <g transform="translate(225, 510)">
            {/* Embedding space */}
            <ellipse cx="0" cy="0" rx="45" ry="20" strokeWidth="0.4" strokeDasharray="2 3" />
            
            {/* Embedding dots - pre-computed positions to avoid hydration mismatch */}
            <circle cx="-30" cy="0" r="2" fill="currentColor" className="embedding-dot text-foreground/40" />
            <circle cx="-15" cy="7.46" r="2" fill="currentColor" className="embedding-dot text-foreground/40" />
            <circle cx="0" cy="5.40" r="2" fill="currentColor" className="embedding-dot text-foreground/40" />
            <circle cx="15" cy="-3.53" r="2" fill="currentColor" className="embedding-dot text-foreground/40" />
            <circle cx="30" cy="-7.93" r="2" fill="currentColor" className="embedding-dot text-foreground/40" />
            
            <circle cx="-22" cy="6" r="1.5" fill="currentColor" className="embedding-dot text-foreground/30" />
            <circle cx="-7" cy="4.18" r="1.5" fill="currentColor" className="embedding-dot text-foreground/30" />
            <circle cx="7" cy="-0.17" r="1.5" fill="currentColor" className="embedding-dot text-foreground/30" />
            <circle cx="22" cy="-4.42" r="1.5" fill="currentColor" className="embedding-dot text-foreground/30" />
          </g>
          
          {/* Retrieval arrow */}
          <path
            d="M 225 485 L 225 430"
            strokeWidth="0.6"
            markerEnd="url(#arrowhead)"
          />
          <path
            d="M 215 440 L 225 425 L 235 440"
            strokeWidth="0.5"
          />
          
          {/* Query input */}
          <g transform="translate(320, 580)">
            <rect x="-25" y="-10" width="50" height="20" strokeWidth="0.4" rx="3" />
            <text
              x="0"
              y="3"
              fontSize="6"
              fontFamily="ui-monospace, monospace"
              fill="currentColor"
              textAnchor="middle"
              className="text-foreground/40"
            >
              QUERY
            </text>
          </g>
          <path
            d="M 295 580 Q 270 560 250 530"
            strokeWidth="0.4"
            strokeDasharray="3 3"
          />
        </g>

        {/* Data Particles - Flowing through system */}
        <g ref={dataParticlesRef} fill="currentColor" className="text-foreground/50">
          <circle cx="180" cy="300" r="2.5" className="data-particle" />
          <circle cx="270" cy="310" r="2" className="data-particle" />
          <circle cx="200" cy="380" r="2.5" className="data-particle" />
          <circle cx="250" cy="290" r="2" className="data-particle" />
          <circle cx="190" cy="400" r="2" className="data-particle" />
          <circle cx="260" cy="400" r="2.5" className="data-particle" />
          <circle cx="225" cy="450" r="2" className="data-particle" />
          <circle cx="150" cy="350" r="2" className="data-particle" />
          <circle cx="300" cy="350" r="2" className="data-particle" />
        </g>

        {/* Labels */}
        <g ref={labelsRef} fill="currentColor" className="text-foreground/50">
          <text
            x="225"
            y="265"
            fontSize="7"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
          >
            LLM_CORE
          </text>
          <text
            x="225"
            y="275"
            fontSize="5"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
            className="text-foreground/30"
          >
            inference.active
          </text>
          
          <text
            x="80"
            y="170"
            fontSize="5"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
            className="text-foreground/35"
          >
            EDGE_01
          </text>
          <text
            x="350"
            y="150"
            fontSize="5"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
            className="text-foreground/35"
          >
            EDGE_02
          </text>
          <text
            x="70"
            y="485"
            fontSize="5"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
            className="text-foreground/35"
          >
            EDGE_03
          </text>
          <text
            x="380"
            y="535"
            fontSize="5"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
            className="text-foreground/35"
          >
            EDGE_04
          </text>
          
          <text
            x="225"
            y="640"
            fontSize="6"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
          >
            RAG_RETRIEVAL
          </text>
          <text
            x="225"
            y="650"
            fontSize="5"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
            className="text-foreground/30"
          >
            vector.search
          </text>
          
          {/* System status */}
          <text
            x="400"
            y="660"
            fontSize="5"
            fontFamily="ui-monospace, monospace"
            textAnchor="end"
            className="text-foreground/25"
          >
            SYS.AI.READY
          </text>
        </g>

        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
            orient="auto"
          >
            <path
              d="M 0 0 L 6 3 L 0 6 Z"
              fill="currentColor"
              className="text-foreground/30"
            />
          </marker>
        </defs>
      </svg>
    </div>
  )
}
