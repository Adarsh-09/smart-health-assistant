"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface ScrollSectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  animation?: "fade-up" | "fade-left" | "fade-right" | "scale" | "none"
  delay?: number
}

export function ScrollSection({
  children,
  className = "",
  id,
  animation = "fade-up",
  delay = 0,
}: ScrollSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || animation === "none") return

    const el = ref.current

    const ctx = gsap.context(() => {
      const baseConfig = {
        duration: 0.8,
        ease: "power2.out",
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }

      switch (animation) {
        case "fade-up":
          gsap.fromTo(el, { y: 30, opacity: 0 }, { ...baseConfig, y: 0, opacity: 1 })
          break
        case "fade-left":
          gsap.fromTo(el, { x: -30, opacity: 0 }, { ...baseConfig, x: 0, opacity: 1 })
          break
        case "fade-right":
          gsap.fromTo(el, { x: 30, opacity: 0 }, { ...baseConfig, x: 0, opacity: 1 })
          break
        case "scale":
          gsap.fromTo(el, { scale: 0.95, opacity: 0 }, { ...baseConfig, scale: 1, opacity: 1 })
          break
      }
    }, ref)

    return () => ctx.revert()
  }, [animation, delay])

  return (
    <div ref={ref} id={id} className={className}>
      {children}
    </div>
  )
}

/**
 * Staggered children animation — each direct child animates in sequence
 */
export function ScrollStagger({
  children,
  className = "",
  stagger = 0.1,
}: {
  children: React.ReactNode
  className?: string
  stagger?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(() => {
      const childElements = ref.current!.children
      gsap.fromTo(childElements, 
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current!,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      )
    }, ref)

    return () => ctx.revert()
  }, [stagger])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

