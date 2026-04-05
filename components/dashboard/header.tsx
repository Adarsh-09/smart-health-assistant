"use client"

import { Activity, RefreshCw, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HeaderProps {
  lastUpdated: string | undefined
  onRefresh: () => void
  isLoading: boolean
}

export function Header({ lastUpdated, onRefresh, isLoading }: HeaderProps) {
  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div className="flex items-center gap-4">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.1 }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl glow relative group cursor-pointer"
        >
          <Activity className="h-7 w-7 group-hover:scale-110 transition-transform" />
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background border-4 border-background flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </motion.div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Vitality <span className="text-primary">Dashboard</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              AI-Powered Health Monitoring
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:items-end gap-3">
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                Data Latency
              </span>
              <span className="text-xs font-bold text-foreground">
                Updated {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}
          <Button
            variant="outline"
            size="lg"
            onClick={onRefresh}
            disabled={isLoading}
            className={cn(
              "glass px-6 h-12 rounded-2xl border-white/10 hover:bg-white/10 group active:scale-95 transition-all duration-300",
              isLoading && "cursor-not-allowed opacity-50"
            )}
          >
            <RefreshCw
              className={cn(
                "h-4 w-4 mr-2 transition-transform duration-700",
                isLoading ? "animate-spin" : "group-hover:rotate-180"
              )}
            />
            <span className="font-bold tracking-tight">Sync Data</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
