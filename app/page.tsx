import { Navigation } from "@/components/portfolio/navigation"
import { HeroSection } from "@/components/portfolio/hero-section"
import { ShowcaseSection } from "@/components/portfolio/showcase-section"
import { AboutSection } from "@/components/portfolio/about-section"
import { ExperienceSection } from "@/components/portfolio/experience-section"
import { ProjectsSection } from "@/components/portfolio/projects-section"
import { ContactSection } from "@/components/portfolio/contact-section"
import { Footer } from "@/components/portfolio/footer"
import { CustomCursor } from "@/components/custom-cursor"

export default function Portfolio() {
  return (
    <main className="portfolio-site min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <CustomCursor />
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ShowcaseSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
