"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { User, Mail, Calendar, Weight, Ruler, Droplets, ShieldCheck, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export function ProfileSheet({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const profileDetails = [
    { icon: Mail, label: "Email", value: "adarsh@example.com" },
    { icon: Calendar, label: "Age", value: "24 years" },
    { icon: Ruler, label: "Height", value: "178 cm" },
    { icon: Weight, label: "Weight", value: "72 kg" },
    { icon: Droplets, label: "Blood Type", value: "O+" },
    { icon: ShieldCheck, label: "Insurance", value: "Active - HDFC ERGO" },
  ]

  if (!mounted) return <>{children}</> // Render the trigger immediately during SSR/Hydration

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="glass border-l border-white/10 sm:max-w-md">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center glow">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            User Profile
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Manage your personal health details and preferences.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="relative group cursor-pointer overflow-hidden rounded-2xl bg-muted/50 p-6 border border-white/5 transition-all hover:bg-muted/80">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/20 overflow-hidden">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Adarsh Singh</h3>
                <p className="text-sm text-primary font-medium">Premium Member</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {profileDetails.map((detail, idx) => (
              <motion.div
                key={detail.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4 rounded-xl p-4 bg-muted/30 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center border border-border">
                  <detail.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                    {detail.label}
                  </p>
                  <p className="text-sm font-semibold">{detail.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl bg-primary/10 p-6 border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-5 w-5 text-primary animate-pulse" />
              <h4 className="font-bold">Medical Condition</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No known allergies. Regular fitness enthusiast. High recovery rate.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
