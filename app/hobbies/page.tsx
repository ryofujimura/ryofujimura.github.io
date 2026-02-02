import Image from "next/image"

export default function HobbiesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Image */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/images/hobbies/hero.jpg"
            alt="Hobbies"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Text */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          My Hobbies
        </h1>
        <p className="text-lg text-muted-foreground">
          Coming soon — a collection of things I love to do outside of work.
        </p>
      </div>
    </main>
  )
}
