import { Dashboard } from "@/components/dashboard"
import { Hero } from "@/components/dashboard/hero"

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      <section id="hero">
        <Hero />
      </section>
      
      <section id="dashboard" className="scroll-mt-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Dashboard />
        </div>
      </section>
    </div>
  )
}
