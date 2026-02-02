export default function HobbiesPage() {
  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-8">
      {/* Hero Image */}
      <div className="w-full max-w-2xl aspect-video relative rounded-2xl overflow-hidden shadow-xl mb-8 bg-neutral-200">
        {/* Replace with your own image: /images/hobbies/hero.jpg */}
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
          alt="Hobbies"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Simple Text */}
      <h1 className="text-4xl md:text-5xl font-light text-neutral-800 text-center tracking-tight">
        Welcome to my hobbies
      </h1>
    </main>
  )
}
