"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Activity, Heart, Moon, Watch, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current) return

    const ctx = gsap.context(() => {
      // Gentle parallax on background gradient only — no text animation
      gsap.to(bgRef.current!, {
        y: 80,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const features = [
    { icon: Activity, label: "Fitness Activity", gradient: "from-blue-500 to-cyan-400", href: "#fitness-activity" },
    { icon: Heart, label: "Heart Rate", gradient: "from-red-500 to-pink-400", href: "#health-charts" },
    { icon: Moon, label: "Sleep", gradient: "from-indigo-500 to-purple-400", href: "#health-charts" },
    { icon: Watch, label: "Smartwatch", gradient: "from-emerald-500 to-green-400", href: "#dashboard" },
    { icon: Shield, label: "Emergency", gradient: "from-red-600 to-orange-400", href: "#emergency-portal" },
  ]

  return (
    <div ref={sectionRef} className="relative overflow-hidden py-24 sm:py-32">
      <div
        ref={bgRef}
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
      >
        <motion.div
          animate={{
            rotate: [30, 45, 30],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 bg-gradient-to-tr from-primary to-accent-foreground opacity-20 sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <motion.div
        ref={textRef}
        className="container mx-auto px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            variants={itemVariants}
            className="mb-8 flex justify-center"
          >
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-border hover:ring-primary/50 transition-all duration-300">
              ✨ Now with Smartwatch Sync & Emergency Alerts.{" "}
              <a href="#dashboard" className="font-semibold text-primary">
                <span className="absolute inset-0" aria-hidden="true" />
                Explore <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
          >
            Your Daily <span className="text-gradient">Health companion</span> powered by AI.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg leading-8 text-muted-foreground"
          >
            Sync your smartwatch, get real-time AI insights, and keep your loved ones safe with instant emergency alerts. 
            Smart monitoring for a smarter lifestyle.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button size="lg" className="rounded-full shadow-lg glow" asChild>
              <a href="#dashboard">
                Start Tracking <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="lg" className="rounded-full font-semibold" asChild>
              <a href="#dashboard">
                Learn more <span aria-hidden="true" className="ml-2">→</span>
              </a>
            </Button>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-16 flow-root sm:mt-24"
        >
          <div className="relative -m-2 rounded-xl bg-muted/50 p-2 ring-1 ring-inset ring-border lg:-m-4 lg:rounded-2xl lg:p-4 glass perspective">
            <div className="flex justify-around py-8 sm:py-12">
              {features.map((feat) => (
                <a key={feat.label} href={feat.href} className="group outline-none">
                  <motion.div
                    whileHover={{ scale: 1.15, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <motion.div
                      animate={{
                        y: [0, -8, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2, // Staggered floating effect
                      }}
                      className={`p-3 rounded-2xl bg-gradient-to-br ${feat.gradient} shadow-lg group-hover:glow transition-all`}
                    >
                      <feat.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{feat.label}</span>
                  </motion.div>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

