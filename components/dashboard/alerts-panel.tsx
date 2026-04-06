"use client"

import { motion } from "framer-motion"
import { AlertTriangle, AlertCircle, Info, CheckCircle, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Alert } from "@/app/api/analyze/route"
import { cn } from "@/lib/utils"

interface AlertsPanelProps {
  alerts: Alert[]
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="h-5 w-5" />
      case "warning":
        return <AlertCircle className="h-5 w-5" />
      case "info":
        return <Info className="h-5 w-5" />
    }
  }

  const getAlertStyles = (type: Alert["type"]) => {
    switch (type) {
      case "danger":
        return {
          badge: "bg-destructive/20 text-destructive border-destructive/20",
          border: "border-l-destructive shadow-[0_0_15px_rgba(239,68,68,0.1)]",
          icon: "text-destructive",
          bg: "bg-destructive/5"
        }
      case "warning":
        return {
          badge: "bg-warning/20 text-warning border-warning/20",
          border: "border-l-warning shadow-[0_0_15px_rgba(245,158,11,0.1)]",
          icon: "text-warning",
          bg: "bg-warning/5"
        }
      case "info":
        return {
          badge: "bg-primary/20 text-primary border-primary/20",
          border: "border-l-primary shadow-[0_0_15px_rgba(59,130,246,0.1)]",
          icon: "text-primary",
          bg: "bg-primary/5"
        }
    }
  }

  return (
    <Card className="glass group hover:glow transition-all duration-500 min-h-[250px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-primary" />
          Critical Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 mb-4 glow">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-sm font-bold text-foreground">Systems Nominal</p>
            <p className="text-xs text-muted-foreground mt-1 px-4">
              All health parameters are within normal operating ranges.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, index) => {
              const styles = getAlertStyles(alert.type)
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "flex items-start gap-4 rounded-2xl border-l-[6px] p-4 transition-all hover:translate-x-1",
                    styles.border,
                    styles.bg
                  )}
                >
                  <div className={cn("mt-1 shrink-0", styles.icon)}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base font-bold text-foreground truncate mr-2">
                        {alert.title}
                      </span>
                      <Badge variant="outline" className={cn("text-[10px] font-bold tracking-widest", styles.badge)}>
                        {alert.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {alert.message}
                    </p>
                    
                    {alert.suggestions && alert.suggestions.length > 0 && (
                      <div className="mt-2 pt-3 border-t border-white/5">
                        <p className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Suggested Actions
                        </p>
                        <ul className="space-y-2 list-none">
                          {alert.suggestions.map((suggestion, sIdx) => (
                            <li key={sIdx} className="text-sm text-muted-foreground flex items-center gap-2.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
