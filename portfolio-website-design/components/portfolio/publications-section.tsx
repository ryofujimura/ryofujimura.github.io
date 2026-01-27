"use client"

import { AnimatedSection } from "@/components/animated-section"
import { MouseFollowerCard } from "@/components/mouse-follower-card"
import { MagneticButton } from "@/components/magnetic-button"
import { AsciiSectionHeader } from "@/components/ascii-banner"
import { FileText, ExternalLink, Award, ArrowUpRight } from "lucide-react"

const publications = [
  {
    title: "Demo Abstract: Custom 3D-Printed Mouse: A Proof of Concept for Personalized Input Devices",
    conference: "ACM/IEEE International Conference on Cyber-Physical Systems (ICCPS)",
    year: "2025",
    type: "Demo Abstract",
    description:
      "Designed a personalized 3D-printed mouse reducing total weight by 45%, with a 15.1g custom shell and stress-tested 15% infill structure.",
    link: "#",
  },
  {
    title: "STL-Guided Human vs. Robot Classification for Robotic Keyboard Actuation",
    conference: "IEEE International Conference on Robotics and Automation (ICRA)",
    year: "2026",
    type: "Full Paper",
    description:
      "Built a robotic keyboard actuation system achieving 102 keystrokes/30s (100% success), 21.7ms latency, and 95% classification accuracy distinguishing human vs. robot inputs using 33 temporal features over 40 trajectories.",
    link: "#",
  },
]

export function PublicationsSection() {
  return (
    <section id="publications" className="py-20 sm:py-24 md:py-32 lg:py-40 px-4 sm:px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <AsciiSectionHeader number="04" title="Research & Publications" />
        </AnimatedSection>

        <div className="grid gap-8">
          {publications.map((pub, index) => (
            <AnimatedSection key={pub.title} delay={index * 150}>
              <MouseFollowerCard>
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="pointer"
                  data-cursor-text="Read"
                  className="touch-target group block p-5 sm:p-6 md:p-8 lg:p-10 bg-card rounded-xl sm:rounded-2xl border border-border hover:border-accent/30 transition-all duration-500 min-h-[44px]"
                >
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Icon */}
                    <div className="shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <FileText className="w-8 h-8 text-accent" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1.5 text-xs font-medium text-accent bg-accent/10 rounded-full border border-accent/20">
                          {pub.type}
                        </span>
                        <span className="text-sm font-mono text-muted-foreground">{pub.year}</span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
                        {pub.title}
                      </h3>

                      <p className="text-accent font-medium">{pub.conference}</p>

                      <p className="text-muted-foreground leading-relaxed">{pub.description}</p>

                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-accent transition-colors pt-2">
                        <span>View Publication</span>
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </a>
              </MouseFollowerCard>
            </AnimatedSection>
          ))}
        </div>

        {/* Academic Service */}
        <AnimatedSection delay={300}>
          <div className="mt-12 p-8 bg-card rounded-2xl border border-border">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                <Award className="w-7 h-7 text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-foreground mb-2">Academic Service</h4>
                <p className="text-muted-foreground text-lg">
                  <span className="text-foreground font-medium">Reviewer</span>, IEEE International Conference on Robotics and Automation (ICRA) 2026
                </p>
              </div>
              <MagneticButton
                as="a"
                href="#"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-muted-foreground bg-secondary rounded-full border border-border hover:border-accent/50 hover:text-foreground transition-all"
              >
                Learn More
                <ExternalLink className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
