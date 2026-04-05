"use client"

import { motion } from "framer-motion"
import { Heart, Footprints, Moon, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricCardsProps {
  heartRate: number
  steps: number
  sleepHours: number
}

export function MetricCards({ heartRate, steps, sleepHours }: MetricCardsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <motion.div variants={item} whileHover={{ y: -5, scale: 1.02 }} className="transition-all duration-300">
        <Card className="glass group hover:glow transition-colors duration-500 hover:shadow-2xl h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
              Heart Rate
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
              <Heart className="h-5 w-5 text-destructive animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <motion.span 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold tracking-tight text-foreground"
              >
                {heartRate}
              </motion.span>
              <span className="text-sm font-medium text-muted-foreground">BPM</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500">Normal</span>
              <span className="text-muted-foreground ml-auto">Last updated: 5m ago</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} whileHover={{ y: -5, scale: 1.02 }} className="transition-all duration-300">
        <Card className="glass group hover:glow transition-colors duration-500 hover:shadow-2xl h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
              Steps Today
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Footprints className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <motion.span 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold tracking-tight text-foreground"
              >
                {steps.toLocaleString()}
              </motion.span>
              <span className="text-sm font-medium text-muted-foreground">steps</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Goal: 10,000</span>
                <span className="text-primary">{Math.min(100, Math.round((steps / 10000) * 100))}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (steps / 10000) * 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-accent-foreground shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} whileHover={{ y: -5, scale: 1.02 }} className="transition-all duration-300 sm:col-span-2 lg:col-span-1">
        <Card className="glass group hover:glow transition-colors duration-500 hover:shadow-2xl h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
              Sleep Duration
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
              <Moon className="h-5 w-5 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <motion.span 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold tracking-tight text-foreground"
              >
                {sleepHours}
              </motion.span>
              <span className="text-sm font-medium text-muted-foreground">hours</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-indigo-500/80">
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Restorative Sleep</span>
              <span className="text-muted-foreground ml-auto">Last night</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
