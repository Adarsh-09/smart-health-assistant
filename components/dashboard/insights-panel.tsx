"use client"

import { motion } from "framer-motion"
import { Brain, Moon, Footprints, Heart, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Insight } from "@/app/api/analyze/route"
import { cn } from "@/lib/utils"

interface InsightsPanelProps {
  insights: Insight[]
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  const getCategoryIcon = (category: Insight["category"]) => {
    switch (category) {
      case "sleep":
        return <Moon className="h-5 w-5" />
      case "activity":
        return <Footprints className="h-5 w-5" />
      case "heart":
        return <Heart className="h-5 w-5" />
    }
  }

  const getCategoryStyles = (category: Insight["category"]) => {
    switch (category) {
      case "sleep":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_15px_rgba(129,140,248,0.1)]"
      case "activity":
        return "bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
      case "heart":
        return "bg-destructive/10 text-destructive border-destructive/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
    }
  }

  return (
    <Card className="glass group hover:glow transition-all duration-500 border border-white/5">
      <CardHeader className="flex flex-row items-center gap-3 pb-4">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center glow">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            AI Automated Insights
          </CardTitle>
          <p className="text-[10px] text-muted-foreground/60 font-medium">Real-time health optimization analysis</p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col gap-4 rounded-2xl bg-white/5 p-5 border border-white/5 hover:bg-white/10 transition-all group/item hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover/item:scale-110",
                  getCategoryStyles(insight.category)
                )}
              >
                {getCategoryIcon(insight.category)}
              </div>
              <Sparkles className="h-4 w-4 text-primary/20 group-hover/item:text-primary/100 transition-colors" />
            </div>
            <p className="text-sm text-foreground leading-relaxed font-medium">
              {insight.message}
            </p>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
