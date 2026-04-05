"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HealthScoreProps {
  score: number
  status: "good" | "moderate" | "poor"
}

export function HealthScore({ score, status }: HealthScoreProps) {
  const getStatusColor = () => {
    switch (status) {
      case "good":
        return "text-emerald-500"
      case "moderate":
        return "text-amber-500"
      case "poor":
        return "text-destructive"
      default:
        return "text-primary"
    }
  }

  const getStatusBgColor = () => {
    switch (status) {
      case "good":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "moderate":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "poor":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-primary/10 text-primary border-primary/20"
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "good":
        return <TrendingUp className="h-4 w-4" />
      case "moderate":
        return <Minus className="h-4 w-4" />
      case "poor":
        return <TrendingDown className="h-4 w-4" />
    }
  }

  const getStatusLabel = () => {
    switch (status) {
      case "good":
        return "Optimal Condition"
      case "moderate":
        return "Moderate Status"
      case "poor":
        return "Critical Attention"
    }
  }

  const radius = 70
  const circumference = 2 * Math.PI * radius

  return (
    <Card className="glass overflow-hidden">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center justify-between">
          Overall Vitality
          <Activity className="h-4 w-4 text-primary animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pb-8">
        <div className="relative flex h-48 w-48 items-center justify-center">
          <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-secondary/30"
            />
            {/* Progress circle */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`${getStatusColor()} transition-colors duration-500`}
              style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
            />
          </svg>
          <div className="flex flex-col items-center z-10">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-5xl font-extrabold tracking-tighter ${getStatusColor()}`}
            >
              {score}
            </motion.span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
              Health Index
            </span>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-6 flex items-center gap-2 rounded-2xl border px-4 py-2 ${getStatusBgColor()}`}
        >
          {getStatusIcon()}
          <span className="text-sm font-bold">{getStatusLabel()}</span>
        </motion.div>
        
        <p className="mt-4 text-center text-xs text-muted-foreground leading-relaxed max-w-[200px]">
          Your daily vitality score based on activity, sleep, and heart rate metrics.
        </p>
      </CardContent>
    </Card>
  )
}
