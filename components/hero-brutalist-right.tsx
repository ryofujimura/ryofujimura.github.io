"use client"

import { useEffect, useRef, useMemo } from "react"
import { gsap } from "gsap"

/**
 * Award-winning brutalist AI/ML themed animation for hero section right side.
 * Features neural network nodes, tensor visualizations, data flow paths,
 * and sophisticated GSAP entrance animations.
 */
export function HeroBrutalistRight() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mainSvgRef = useRef<SVGSVGElement>(null)
  const neuralNetRef = useRef<SVGGElement>(null)
  const connectionsRef = useRef<SVGGElement>(null)
  const tensorGridRef = useRef<SVGGElement>(null)
  const dataFlowRef = useRef<SVGGElement>(null)
  const textLabelsRef = useRef<SVGGElement>(null)
  const pulseNodesRef = useRef<SVGGElement>(null)
  const matrixRef = useRef<SVGGElement>(null)

  // Neural network layer configuration
  const layers = useMemo(() => [
    { x: 100, nodes: 4, label: "INPUT" },
    { x: 180, nodes: 6, label: "HIDDEN_1" },
    { x: 260, nodes: 8, label: "HIDDEN_2" },
    { x: 340, nodes: 6, label: "HIDDEN_3" },
    { x: 420, nodes: 3, label: "OUTPUT" },
  ], [])

  // Generate node positions for each layer
  const nodePositions = useMemo(() => {
    const startY = 120
    const spacing = 50
    return layers.map((layer) => {
      const totalHeight = (layer.nodes - 1) * spacing
      const offsetY = startY + (4 * spacing - totalHeight) / 2
      return Array.from({ length: layer.nodes }, (_, i) => ({
        x: layer.x,
        y: offsetY + i * spacing,
      }))
    })
  }, [layers])

  // Generate connections between layers
  const connections = useMemo(() => {
    const conns: { x1: number; y1: number; x2: number; y2: number; weight: number }[] = []
    const seed = 42
    const random = (i: number) => ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280

    for (let l = 0; l < nodePositions.length - 1; l++) {
      const currentLayer = nodePositions[l]
      const nextLayer = nodePositions[l + 1]
      currentLayer.forEach((node, i) => {
        nextLayer.forEach((nextNode, j) => {
          // Only draw some connections for visual clarity
          if (random(l * 100 + i * 10 + j) > 0.4) {
            conns.push({
              x1: node.x,
              y1: node.y,
              x2: nextNode.x,
              y2: nextNode.y,
              weight: random(l * 50 + i * 5 + j),
            })
          }
        })
      })
    }
    return conns
  }, [nodePositions])

  // Tensor/matrix grid data
  const tensorData = useMemo(() => {
    const seed = 123
    const random = (i: number) => ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280
    return Array.from({ length: 64 }, (_, i) => ({
      value: random(i),
      row: Math.floor(i / 8),
      col: i % 8,
    }))
  }, [])

  // Attention pattern data
  const attentionData = useMemo(() => {
    const seed = 77
    const random = (i: number) => ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280
    return Array.from({ length: 36 }, (_, i) => random(i))
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Helper: animate stroke-dashoffset for path drawing
      const drawPaths = (
        group: SVGGElement | null,
        duration: number,
        delay: number,
        stagger = 0.02
      ) => {
        if (!group) return
        const paths = group.querySelectorAll("path, line, polyline, circle, rect")
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

      // Animate neural network connections first (background)
      drawPaths(connectionsRef.current, 2, 0.2, 0.008)

      // Animate neural network nodes
      if (neuralNetRef.current) {
        const nodes = neuralNetRef.current.querySelectorAll("circle")
        gsap.set(nodes, { scale: 0, opacity: 0, transformOrigin: "center" })
        gsap.to(nodes, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          delay: 0.8,
          stagger: 0.03,
          ease: "back.out(1.7)",
        })
      }

      // Animate tensor grid
      if (tensorGridRef.current) {
        const cells = tensorGridRef.current.querySelectorAll("rect")
        gsap.set(cells, { opacity: 0, scale: 0, transformOrigin: "center" })
        gsap.to(cells, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          delay: 1.2,
          stagger: { each: 0.01, from: "random" },
          ease: "power2.out",
        })
      }

      // Animate data flow paths
      drawPaths(dataFlowRef.current, 1.5, 1.6, 0.05)

      // Animate matrix visualization
      if (matrixRef.current) {
        const elements = matrixRef.current.querySelectorAll("rect, text")
        gsap.set(elements, { opacity: 0 })
        gsap.to(elements, {
          opacity: 1,
          duration: 0.4,
          delay: 1.8,
          stagger: 0.02,
          ease: "power2.out",
        })
      }

      // Animate text labels
      if (textLabelsRef.current) {
        const texts = textLabelsRef.current.querySelectorAll("text")
        gsap.set(texts, { opacity: 0, y: 5 })
        gsap.to(texts, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 2,
          stagger: 0.04,
          ease: "power3.out",
        })
      }

      // Continuous pulse animation on active nodes
      if (pulseNodesRef.current) {
        const pulses = pulseNodesRef.current.querySelectorAll("circle")
        gsap.set(pulses, { scale: 0, opacity: 0 })
        
        // Initial reveal
        gsap.to(pulses, {
          scale: 1,
          opacity: 0.6,
          duration: 0.5,
          delay: 2.2,
          stagger: 0.1,
          ease: "power2.out",
        })

        // Continuous pulse
        gsap.to(pulses, {
          scale: 1.5,
          opacity: 0,
          duration: 1.5,
          delay: 2.7,
          stagger: { each: 0.2, repeat: -1 },
          ease: "power1.out",
        })
      }

      // Data flow animation - continuous
      const flowPaths = dataFlowRef.current?.querySelectorAll(".data-particle")
      if (flowPaths && flowPaths.length > 0) {
        flowPaths.forEach((particle, i) => {
          gsap.to(particle, {
            motionPath: {
              path: `#flow-path-${i % 3}`,
              align: `#flow-path-${i % 3}`,
              alignOrigin: [0.5, 0.5],
            },
            duration: 3 + i * 0.5,
            repeat: -1,
            delay: 2.5 + i * 0.3,
            ease: "none",
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
        ref={mainSvgRef}
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 500 800"
        preserveAspectRatio="xMaxYMid slice"
        fill="none"
      >
        {/* Neural network connections */}
        <g ref={connectionsRef} stroke="currentColor" className="text-foreground/10">
          {connections.map((conn, i) => (
            <line
              key={i}
              x1={conn.x1}
              y1={conn.y1}
              x2={conn.x2}
              y2={conn.y2}
              strokeWidth={0.3 + conn.weight * 0.5}
            />
          ))}
        </g>

        {/* Neural network nodes */}
        <g ref={neuralNetRef} className="text-foreground/40">
          {nodePositions.map((layer, l) =>
            layer.map((node, n) => (
              <circle
                key={`${l}-${n}`}
                cx={node.x}
                cy={node.y}
                r={l === 0 || l === nodePositions.length - 1 ? 5 : 4}
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.5"
                className={l === nodePositions.length - 1 ? "text-foreground/60" : ""}
              />
            ))
          )}
        </g>

        {/* Pulse nodes for active signals */}
        <g ref={pulseNodesRef} className="text-foreground/30">
          {[
            { x: 180, y: 170 },
            { x: 260, y: 220 },
            { x: 340, y: 195 },
            { x: 420, y: 195 },
          ].map((pos, i) => (
            <circle
              key={i}
              cx={pos.x}
              cy={pos.y}
              r={8}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </g>

        {/* Tensor/Feature Map Grid */}
        <g ref={tensorGridRef} transform="translate(120, 420)">
          {tensorData.map((cell, i) => (
            <rect
              key={i}
              x={cell.col * 12}
              y={cell.row * 12}
              width="10"
              height="10"
              fill="currentColor"
              className="text-foreground"
              style={{ opacity: 0.05 + cell.value * 0.25 }}
            />
          ))}
          {/* Grid border */}
          <rect
            x="-2"
            y="-2"
            width="100"
            height="100"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-foreground/20"
          />
        </g>

        {/* Attention Matrix Visualization */}
        <g ref={matrixRef} transform="translate(280, 440)">
          {/* 6x6 attention grid */}
          {attentionData.map((value, i) => (
            <rect
              key={i}
              x={(i % 6) * 14}
              y={Math.floor(i / 6) * 14}
              width="12"
              height="12"
              fill="currentColor"
              className="text-foreground"
              style={{ opacity: 0.03 + value * 0.35 }}
            />
          ))}
          {/* Border */}
          <rect
            x="-2"
            y="-2"
            width="88"
            height="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-foreground/20"
          />
          {/* Diagonal attention pattern overlay */}
          <path
            d="M 0 0 L 84 84"
            stroke="currentColor"
            strokeWidth="0.3"
            strokeDasharray="2 4"
            className="text-foreground/30"
          />
        </g>

        {/* Data flow paths */}
        <g ref={dataFlowRef} stroke="currentColor" className="text-foreground/15">
          {/* Gradient descent path */}
          <path
            id="flow-path-0"
            d="M 80 600 Q 150 580 180 620 T 280 600 T 380 640 T 450 600"
            strokeWidth="0.5"
            fill="none"
          />
          {/* Loss curve */}
          <path
            id="flow-path-1"
            d="M 100 700 C 150 650 200 720 250 680 S 350 700 400 660 S 480 680 480 680"
            strokeWidth="0.6"
            fill="none"
          />
          {/* Backpropagation flow */}
          <path
            id="flow-path-2"
            d="M 420 350 L 340 350 L 340 380 L 260 380 L 260 350 L 180 350 L 180 380 L 100 380"
            strokeWidth="0.4"
            strokeDasharray="4 4"
            fill="none"
          />
          
          {/* Epoch markers on loss curve */}
          {[100, 175, 250, 325, 400].map((x, i) => (
            <g key={i}>
              <line x1={x} y1={695} x2={x} y2={705} strokeWidth="0.4" />
            </g>
          ))}
        </g>

        {/* Activation function visualization */}
        <g transform="translate(320, 560)" stroke="currentColor" className="text-foreground/20">
          {/* ReLU curve */}
          <path d="M 0 40 L 40 40 L 80 0" strokeWidth="0.8" fill="none" />
          {/* Axis */}
          <line x1="0" y1="40" x2="80" y2="40" strokeWidth="0.3" />
          <line x1="40" y1="0" x2="40" y2="50" strokeWidth="0.3" />
          {/* Sigmoid overlay */}
          <path
            d="M 0 38 Q 20 38 40 20 Q 60 2 80 2"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            fill="none"
            className="text-foreground/15"
          />
        </g>

        {/* Layer dimension annotations */}
        <g ref={textLabelsRef} fill="currentColor" className="text-foreground/40">
          {layers.map((layer, i) => (
            <g key={i}>
              <text
                x={layer.x}
                y={85}
                fontSize="6"
                fontFamily="ui-monospace, monospace"
                textAnchor="middle"
              >
                {layer.label}
              </text>
              <text
                x={layer.x}
                y={395}
                fontSize="5"
                fontFamily="ui-monospace, monospace"
                textAnchor="middle"
                className="text-foreground/30"
              >
                [{layer.nodes}]
              </text>
            </g>
          ))}
          
          {/* Tensor labels */}
          <text x="168" y="415" fontSize="6" fontFamily="ui-monospace, monospace">
            FEATURE_MAP
          </text>
          <text x="168" y="535" fontSize="5" fontFamily="ui-monospace, monospace" className="text-foreground/30">
            8×8 TENSOR
          </text>
          
          {/* Attention label */}
          <text x="322" y="435" fontSize="6" fontFamily="ui-monospace, monospace">
            ATTENTION
          </text>
          <text x="322" y="545" fontSize="5" fontFamily="ui-monospace, monospace" className="text-foreground/30">
            6×6 MATRIX
          </text>
          
          {/* Loss curve label */}
          <text x="100" y="690" fontSize="5" fontFamily="ui-monospace, monospace">
            LOSS
          </text>
          <text x="470" y="690" fontSize="5" fontFamily="ui-monospace, monospace" textAnchor="end">
            EPOCHS
          </text>
          
          {/* Activation label */}
          <text x="360" y="555" fontSize="5" fontFamily="ui-monospace, monospace" textAnchor="middle">
            ACTIVATION
          </text>
          <text x="360" y="625" fontSize="4" fontFamily="ui-monospace, monospace" textAnchor="middle" className="text-foreground/25">
            ReLU / σ(x)
          </text>
          
          {/* System status */}
          <text x="450" y="760" fontSize="6" fontFamily="ui-monospace, monospace" textAnchor="end">
            MODEL.INFERENCE
          </text>
          <text x="450" y="772" fontSize="5" fontFamily="ui-monospace, monospace" textAnchor="end" className="text-foreground/25">
            PARAMS: 1.2M
          </text>
        </g>

        {/* Corner brackets */}
        <g stroke="currentColor" className="text-foreground/20" strokeWidth="0.8">
          <path d="M 60 70 L 60 55 L 75 55" />
          <path d="M 460 70 L 460 55 L 445 55" />
          <path d="M 60 780 L 60 795 L 75 795" />
          <path d="M 460 780 L 460 795 L 445 795" />
        </g>

        {/* Measurement ticks */}
        <g stroke="currentColor" className="text-foreground/10" strokeWidth="0.3">
          {[100, 200, 300, 400].map((y) => (
            <line key={y} x1="55" y1={y} x2="65" y2={y} />
          ))}
          {[100, 200, 300, 400].map((x) => (
            <line key={x} x1={x} y1="50" x2={x} y2="60" />
          ))}
        </g>

        {/* Animated signal dots on neural network */}
        <g className="text-foreground/50">
          {[
            { cx: 180, cy: 145, delay: 0 },
            { cx: 260, cy: 195, delay: 0.3 },
            { cx: 340, cy: 170, delay: 0.6 },
          ].map((dot, i) => (
            <circle key={i} cx={dot.cx} cy={dot.cy} r="2" fill="currentColor">
              <animate
                attributeName="opacity"
                values="0.2;1;0.2"
                dur="1.5s"
                repeatCount="indefinite"
                begin={`${dot.delay}s`}
              />
            </circle>
          ))}
        </g>

        {/* Weight visualization bars */}
        <g transform="translate(80, 320)" className="text-foreground/15">
          {[0.8, 0.4, 0.9, 0.3, 0.7, 0.5].map((w, i) => (
            <rect
              key={i}
              x={0}
              y={i * 8}
              width={w * 30}
              height="5"
              fill="currentColor"
              style={{ opacity: 0.1 + w * 0.3 }}
            />
          ))}
          <text
            x="0"
            y="-5"
            fontSize="5"
            fontFamily="ui-monospace, monospace"
            fill="currentColor"
            className="text-foreground/30"
          >
            WEIGHTS
          </text>
        </g>

        {/* Gradient flow indicators */}
        <g stroke="currentColor" className="text-foreground/10" strokeWidth="0.4">
          <path d="M 420 280 L 400 280 L 400 260" fill="none" markerEnd="url(#arrow)" />
          <path d="M 340 280 L 320 280 L 320 260" fill="none" />
          <path d="M 260 280 L 240 280 L 240 260" fill="none" />
        </g>

        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" className="text-foreground/20" />
          </marker>
        </defs>
      </svg>
    </div>
  )
}
