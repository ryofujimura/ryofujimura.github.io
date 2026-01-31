"use client"

import { useEffect, useRef, useMemo } from "react"
import { gsap } from "gsap"

/**
 * Award-winning brutalist technical animation representing AI, RAG, and Edge Models.
 * Features neural network nodes, vector embeddings, retrieval flows, and edge deployment.
 */
export function HeroBrutalistRight() {
  const containerRef = useRef<HTMLDivElement>(null)
  const neuralRef = useRef<SVGGElement>(null)
  const ragFlowRef = useRef<SVGGElement>(null)
  const embeddingsRef = useRef<SVGGElement>(null)
  const edgeNodesRef = useRef<SVGGElement>(null)
  const dataFlowRef = useRef<SVGGElement>(null)
  const labelsRef = useRef<SVGGElement>(null)

  // Neural network layer positions
  const neuralLayers = useMemo(() => [
    { x: 120, nodes: [180, 240, 300, 360] },      // Input layer
    { x: 200, nodes: [195, 255, 315, 345] },      // Hidden 1
    { x: 280, nodes: [210, 270, 330] },            // Hidden 2  
    { x: 360, nodes: [240, 300] },                 // Output
  ], [])

  // RAG document nodes
  const ragDocs = useMemo(() => [
    { x: 100, y: 480, label: "DOC_01" },
    { x: 160, y: 520, label: "DOC_02" },
    { x: 120, y: 560, label: "DOC_03" },
    { x: 180, y: 500, label: "DOC_04" },
    { x: 140, y: 540, label: "DOC_05" },
  ], [])

  // Edge device positions
  const edgeDevices = useMemo(() => [
    { x: 320, y: 520, type: "mobile", label: "EDGE_01" },
    { x: 380, y: 480, type: "server", label: "EDGE_02" },
    { x: 400, y: 550, type: "iot", label: "EDGE_03" },
    { x: 340, y: 580, type: "mobile", label: "EDGE_04" },
  ], [])

  // Vector embedding dots (clustering visualization)
  const embeddingDots = useMemo(() => {
    const seed = 42
    const random = (i: number) => ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280
    
    // Cluster 1 - Query vectors
    const cluster1 = Array.from({ length: 12 }, (_, i) => ({
      x: 260 + random(i) * 40 - 20,
      y: 450 + random(i + 50) * 30 - 15,
      cluster: 1,
    }))
    
    // Cluster 2 - Retrieved vectors
    const cluster2 = Array.from({ length: 10 }, (_, i) => ({
      x: 180 + random(i + 100) * 35 - 17,
      y: 490 + random(i + 150) * 25 - 12,
      cluster: 2,
    }))
    
    return [...cluster1, ...cluster2]
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Helper: animate stroke-dashoffset for path drawing
      const drawPaths = (
        group: SVGGElement | null,
        duration: number,
        delay: number,
        stagger = 0.03
      ) => {
        if (!group) return
        const paths = group.querySelectorAll("path, line, polyline, rect, circle")
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

      // Neural network animation
      drawPaths(neuralRef.current, 1.5, 0.2, 0.02)

      // RAG flow animation
      drawPaths(ragFlowRef.current, 1.2, 0.8, 0.04)

      // Edge nodes animation
      drawPaths(edgeNodesRef.current, 1.0, 1.2, 0.05)

      // Data flow arrows
      drawPaths(dataFlowRef.current, 1.8, 1.5, 0.03)

      // Embedding dots scatter animation
      if (embeddingsRef.current) {
        const dots = embeddingsRef.current.querySelectorAll("circle")
        gsap.set(dots, { scale: 0, opacity: 0, transformOrigin: "center center" })
        gsap.to(dots, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          delay: 1.0,
          stagger: { each: 0.03, from: "random" },
          ease: "back.out(1.7)",
        })
      }

      // Labels fade in
      if (labelsRef.current) {
        const texts = labelsRef.current.querySelectorAll("text")
        gsap.set(texts, { opacity: 0, y: 5 })
        gsap.to(texts, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 1.8,
          stagger: 0.06,
          ease: "power3.out",
        })
      }

      // Continuous neural pulse animation
      const pulseNodes = neuralRef.current?.querySelectorAll(".neural-node")
      if (pulseNodes && pulseNodes.length > 0) {
        gsap.to(pulseNodes, {
          strokeOpacity: 0.8,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: { each: 0.1, from: "start", repeat: -1 },
          delay: 2,
        })
      }

      // Data flow pulse animation
      const flowLines = dataFlowRef.current?.querySelectorAll(".flow-pulse")
      if (flowLines && flowLines.length > 0) {
        gsap.to(flowLines, {
          strokeDashoffset: -20,
          duration: 1.5,
          repeat: -1,
          ease: "none",
          stagger: 0.2,
          delay: 2.5,
        })
      }

      // Embedding cluster subtle motion
      if (embeddingsRef.current) {
        const dots = embeddingsRef.current.querySelectorAll("circle")
        dots.forEach((dot, i) => {
          gsap.to(dot, {
            x: `+=${Math.sin(i) * 3}`,
            y: `+=${Math.cos(i) * 3}`,
            duration: 2 + (i % 3),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 2.5 + i * 0.05,
          })
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
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 450 800"
        preserveAspectRatio="xMaxYMid slice"
        fill="none"
      >
        {/* Neural Network Structure */}
        <g ref={neuralRef} stroke="currentColor" className="text-foreground/25">
          {/* Layer connections */}
          {neuralLayers.slice(0, -1).map((layer, li) => {
            const nextLayer = neuralLayers[li + 1]
            return layer.nodes.map((y1, ni) =>
              nextLayer.nodes.map((y2, nj) => (
                <line
                  key={`conn-${li}-${ni}-${nj}`}
                  x1={layer.x}
                  y1={y1}
                  x2={nextLayer.x}
                  y2={y2}
                  strokeWidth="0.3"
                  className="text-foreground/15"
                />
              ))
            )
          })}
          
          {/* Neural nodes */}
          {neuralLayers.map((layer, li) =>
            layer.nodes.map((y, ni) => (
              <g key={`node-${li}-${ni}`}>
                <circle
                  cx={layer.x}
                  cy={y}
                  r={li === 0 ? 6 : li === neuralLayers.length - 1 ? 8 : 5}
                  strokeWidth={li === neuralLayers.length - 1 ? 1 : 0.6}
                  className={`neural-node ${li === neuralLayers.length - 1 ? "text-foreground/40" : "text-foreground/30"}`}
                />
                {/* Activation indicator */}
                <circle
                  cx={layer.x}
                  cy={y}
                  r="2"
                  fill="currentColor"
                  className="text-foreground/20"
                />
              </g>
            ))
          )}

          {/* Layer labels */}
          <text x="120" y="145" fontSize="6" fill="currentColor" className="text-foreground/40" fontFamily="ui-monospace, monospace" textAnchor="middle">INPUT</text>
          <text x="240" y="165" fontSize="5" fill="currentColor" className="text-foreground/30" fontFamily="ui-monospace, monospace" textAnchor="middle">HIDDEN</text>
          <text x="360" y="210" fontSize="6" fill="currentColor" className="text-foreground/40" fontFamily="ui-monospace, monospace" textAnchor="middle">OUTPUT</text>
          
          {/* Neural frame */}
          <rect x="90" y="160" width="300" height="220" strokeWidth="0.4" strokeDasharray="4 8" className="text-foreground/15" />
          
          {/* Model header */}
          <path d="M 90 150 L 90 140 L 110 140" strokeWidth="0.6" className="text-foreground/30" />
          <path d="M 390 150 L 390 140 L 370 140" strokeWidth="0.6" className="text-foreground/30" />
        </g>

        {/* RAG Document Retrieval Flow */}
        <g ref={ragFlowRef} stroke="currentColor" className="text-foreground/25">
          {/* Knowledge base container */}
          <rect x="80" y="450" width="140" height="140" strokeWidth="0.5" className="text-foreground/20" />
          <path d="M 80 470 L 220 470" strokeWidth="0.3" />
          
          {/* Document icons */}
          {ragDocs.map((doc, i) => (
            <g key={`doc-${i}`}>
              <rect
                x={doc.x - 12}
                y={doc.y - 10}
                width="24"
                height="20"
                strokeWidth="0.5"
                className="text-foreground/30"
              />
              {/* Document lines */}
              <line x1={doc.x - 8} y1={doc.y - 4} x2={doc.x + 8} y2={doc.y - 4} strokeWidth="0.3" />
              <line x1={doc.x - 8} y1={doc.y} x2={doc.x + 6} y2={doc.y} strokeWidth="0.3" />
              <line x1={doc.x - 8} y1={doc.y + 4} x2={doc.x + 4} y2={doc.y + 4} strokeWidth="0.3" />
            </g>
          ))}

          {/* Query arrow */}
          <path
            d="M 250 420 L 250 440 L 200 460"
            strokeWidth="0.6"
            className="text-foreground/35"
            markerEnd="url(#arrowhead)"
          />
          
          {/* Retrieval arrow */}
          <path
            d="M 220 520 L 270 500 L 270 420"
            strokeWidth="0.6"
            strokeDasharray="3 3"
            className="text-foreground/35"
          />
          
          {/* Similarity search indicator */}
          <circle cx="240" cy="480" r="25" strokeWidth="0.4" strokeDasharray="2 4" className="text-foreground/20" />
          <text x="240" y="483" fontSize="5" fill="currentColor" className="text-foreground/30" fontFamily="ui-monospace, monospace" textAnchor="middle">SEARCH</text>
        </g>

        {/* Vector Embeddings Visualization */}
        <g ref={embeddingsRef} className="text-foreground/40">
          {embeddingDots.map((dot, i) => (
            <circle
              key={`emb-${i}`}
              cx={dot.x}
              cy={dot.y}
              r={dot.cluster === 1 ? 2 : 1.5}
              fill="currentColor"
              className={dot.cluster === 1 ? "text-foreground/50" : "text-foreground/30"}
            />
          ))}
          
          {/* Cluster boundary hints */}
          <ellipse cx="260" cy="455" rx="30" ry="20" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 4" className="text-foreground/15" fill="none" />
          <ellipse cx="185" cy="495" rx="25" ry="18" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 4" className="text-foreground/15" fill="none" />
        </g>

        {/* Edge Model Deployment Network */}
        <g ref={edgeNodesRef} stroke="currentColor" className="text-foreground/25">
          {/* Central inference node */}
          <circle cx="360" cy="520" r="35" strokeWidth="0.5" className="text-foreground/20" />
          <circle cx="360" cy="520" r="25" strokeWidth="0.6" className="text-foreground/30" />
          <circle cx="360" cy="520" r="8" strokeWidth="0.8" fill="currentColor" className="text-foreground/15" />
          
          {/* Edge devices */}
          {edgeDevices.map((device, i) => (
            <g key={`edge-${i}`}>
              {/* Connection to central */}
              <line
                x1="360"
                y1="520"
                x2={device.x}
                y2={device.y}
                strokeWidth="0.4"
                strokeDasharray="2 3"
                className="text-foreground/20"
              />
              
              {/* Device node */}
              {device.type === "mobile" ? (
                <rect
                  x={device.x - 8}
                  y={device.y - 12}
                  width="16"
                  height="24"
                  rx="2"
                  strokeWidth="0.6"
                  className="text-foreground/35"
                />
              ) : device.type === "server" ? (
                <g>
                  <rect x={device.x - 10} y={device.y - 8} width="20" height="6" strokeWidth="0.5" className="text-foreground/35" />
                  <rect x={device.x - 10} y={device.y} width="20" height="6" strokeWidth="0.5" className="text-foreground/35" />
                  <rect x={device.x - 10} y={device.y + 8} width="20" height="6" strokeWidth="0.5" className="text-foreground/35" />
                </g>
              ) : (
                <circle cx={device.x} cy={device.y} r="10" strokeWidth="0.5" className="text-foreground/35" />
              )}
              
              {/* Status indicator */}
              <circle cx={device.x + 10} cy={device.y - 10} r="2" fill="currentColor" className="text-foreground/40">
                <animate attributeName="opacity" values="1;0.3;1" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
          
          {/* Latency indicators */}
          <text x="330" y="490" fontSize="4" fill="currentColor" className="text-foreground/25" fontFamily="ui-monospace, monospace">12ms</text>
          <text x="395" y="505" fontSize="4" fill="currentColor" className="text-foreground/25" fontFamily="ui-monospace, monospace">8ms</text>
          <text x="405" y="570" fontSize="4" fill="currentColor" className="text-foreground/25" fontFamily="ui-monospace, monospace">15ms</text>
        </g>

        {/* Data Flow Visualization */}
        <g ref={dataFlowRef} stroke="currentColor" className="text-foreground/20">
          {/* Main pipeline */}
          <path
            d="M 100 400 L 180 400 L 180 420 L 280 420"
            strokeWidth="0.6"
            className="flow-pulse"
            strokeDasharray="4 4"
          />
          <path
            d="M 280 420 L 340 420 L 340 480"
            strokeWidth="0.6"
            className="flow-pulse"
            strokeDasharray="4 4"
          />
          
          {/* Inference output flow */}
          <path
            d="M 360 555 L 360 620 L 280 620 L 280 680"
            strokeWidth="0.5"
            strokeDasharray="3 5"
            className="text-foreground/15"
          />
          
          {/* Context injection line */}
          <path
            d="M 220 480 L 260 450 L 300 450"
            strokeWidth="0.4"
            className="text-foreground/25"
          />
          
          {/* Flow direction arrows */}
          <polygon points="280,420 275,415 275,425" fill="currentColor" className="text-foreground/30" />
          <polygon points="340,480 335,475 345,475" fill="currentColor" className="text-foreground/30" />
          <polygon points="280,680 275,675 285,675" fill="currentColor" className="text-foreground/30" />
        </g>

        {/* Technical Labels */}
        <g ref={labelsRef} fill="currentColor" className="text-foreground/50">
          {/* Section headers */}
          <text x="240" y="130" fontSize="7" fontFamily="ui-monospace, monospace" textAnchor="middle" className="text-foreground/60">
            LLM_INFERENCE_LAYER
          </text>
          
          <text x="150" y="440" fontSize="6" fontFamily="ui-monospace, monospace" textAnchor="middle">
            KNOWLEDGE_BASE
          </text>
          
          <text x="360" y="580" fontSize="6" fontFamily="ui-monospace, monospace" textAnchor="middle">
            EDGE_CLUSTER
          </text>
          
          {/* RAG label */}
          <text x="100" y="600" fontSize="5" fontFamily="ui-monospace, monospace" className="text-foreground/35">
            RAG_RETRIEVAL
          </text>
          
          {/* Vector space label */}
          <text x="220" y="525" fontSize="5" fontFamily="ui-monospace, monospace" className="text-foreground/35">
            VECTOR_SPACE
          </text>
          
          {/* System status */}
          <text x="380" y="700" fontSize="5" fontFamily="ui-monospace, monospace" textAnchor="end" className="text-foreground/40">
            MODEL: DEPLOYED
          </text>
          <text x="380" y="712" fontSize="4" fontFamily="ui-monospace, monospace" textAnchor="end" className="text-foreground/25">
            CONTEXT_LEN: 128K
          </text>
          <text x="380" y="722" fontSize="4" fontFamily="ui-monospace, monospace" textAnchor="end" className="text-foreground/25">
            EDGE_NODES: 4
          </text>
          
          {/* Technical coordinates */}
          <text x="85" y="165" fontSize="4" fontFamily="ui-monospace, monospace" className="text-foreground/25">
            [0,0]
          </text>
          <text x="85" y="595" fontSize="4" fontFamily="ui-monospace, monospace" className="text-foreground/25">
            [0,1]
          </text>
          <text x="400" y="595" fontSize="4" fontFamily="ui-monospace, monospace" textAnchor="end" className="text-foreground/25">
            [1,1]
          </text>
        </g>

        {/* Animated Signal Pulses */}
        <g className="text-foreground/30">
          {/* Neural activity pulse */}
          <circle cx="360" cy="270" r="3" fill="currentColor">
            <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
          
          {/* Edge sync pulse */}
          <circle cx="360" cy="520" r="4" fill="none" stroke="currentColor" strokeWidth="0.5">
            <animate attributeName="r" values="25;40;25" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
          </circle>
          
          {/* Retrieval indicator */}
          <circle cx="240" cy="480" r="2" fill="currentColor">
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Technical Grid Overlay */}
        <g stroke="currentColor" className="text-foreground/8">
          {/* Subtle grid lines */}
          {[150, 250, 350, 450, 550, 650].map((y) => (
            <line key={`grid-h-${y}`} x1="80" y1={y} x2="420" y2={y} strokeWidth="0.2" />
          ))}
          {[150, 250, 350].map((x) => (
            <line key={`grid-v-${x}`} x1={x} y1="130" x2={x} y2="700" strokeWidth="0.2" />
          ))}
        </g>

        {/* Corner Frame */}
        <g stroke="currentColor" className="text-foreground/30">
          <path d="M 70 120 L 70 100 L 90 100" strokeWidth="0.8" />
          <path d="M 420 120 L 420 100 L 400 100" strokeWidth="0.8" />
          <path d="M 70 730 L 70 750 L 90 750" strokeWidth="0.8" />
          <path d="M 420 730 L 420 750 L 400 750" strokeWidth="0.8" />
        </g>

        {/* Arrow marker definition */}
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <polygon points="0,0 6,3 0,6" fill="currentColor" className="text-foreground/30" />
          </marker>
        </defs>
      </svg>
    </div>
  )
}
