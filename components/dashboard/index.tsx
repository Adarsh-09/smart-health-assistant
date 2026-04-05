"use client"

import { motion } from "framer-motion"
import { useHealthData, useAnalysis } from "@/hooks/use-health-data"
import { Header } from "./header"
import { MetricCards } from "./metric-cards"
import { HealthScore } from "./health-score"
import { AlertsPanel } from "./alerts-panel"
import { InsightsPanel } from "./insights-panel"
import { HeartRateChart, StepsChart, SleepChart } from "./health-charts"
import { Chatbot } from "./chatbot"
import { ConnectWatch } from "./connect-watch"
import { ManualEntryForm } from "./manual-entry-form"
import { EmergencyContacts } from "./emergency-contacts"
import { EmergencyButton } from "./emergency-button"
import { ScrollSection, ScrollStagger } from "@/components/scroll-sections"
import { Skeleton } from "@/components/ui/skeleton"
import { Wifi, ClipboardEdit, Cpu } from "lucide-react"

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass p-6 space-y-4 rounded-3xl">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

function DataSourceBadge({ source }: { source: string }) {
  const config = {
    google_fit: { label: "Synced from Google Fit", icon: Wifi, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    manual: { label: "Manual Entry", icon: ClipboardEdit, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    simulated: { label: "Simulated Data", icon: Cpu, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  }[source] || { label: "Unknown", icon: Cpu, color: "text-muted-foreground bg-muted/10 border-white/5" }

  const Icon = config.icon
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </div>
  )
}

export function Dashboard() {
  const { data, isLoading, refresh } = useHealthData()
  const { analysis } = useAnalysis(data)

  if (isLoading || !data) {
    return <LoadingSkeleton />
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10"
    >
      <motion.div variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Header
            lastUpdated={data.timestamp}
            onRefresh={() => refresh()}
            isLoading={isLoading}
          />
        </div>
        <div className="mt-3">
          <DataSourceBadge source={data.dataSource || "simulated"} />
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <MetricCards
          heartRate={data.heartRate}
          steps={data.steps}
          sleepHours={data.sleepHours}
        />
      </motion.div>

      {/* Data Sources Section */}
      <ScrollSection animation="fade-up">
        <ScrollStagger className="grid gap-6 lg:grid-cols-2" stagger={0.15}>
          <ConnectWatch
            dataSource={data.dataSource || "simulated"}
            lastSyncAt={data.lastSyncAt}
            onSync={() => refresh()}
          />
          <ManualEntryForm onSubmit={() => refresh()} />
        </ScrollStagger>
      </ScrollSection>

      {/* Health Score + Alerts */}
      <ScrollSection animation="fade-up">
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          <div className="lg:col-span-1">
            {analysis ? (
              <HealthScore
                score={analysis.healthScore}
                status={analysis.scoreStatus}
              />
            ) : (
              <div className="glass p-8 flex flex-col items-center rounded-3xl">
                <Skeleton className="h-48 w-48 rounded-full" />
                <Skeleton className="h-8 w-32 mt-6" />
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {analysis ? (
              <AlertsPanel alerts={analysis.alerts} />
            ) : (
              <div className="glass p-6 space-y-4 rounded-3xl">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollSection>

      {/* AI Insights */}
      {analysis && (
        <ScrollSection animation="fade-up">
          <InsightsPanel insights={analysis.insights} />
        </ScrollSection>
      )}

      {/* Charts */}
      <ScrollSection animation="fade-up">
        <ScrollStagger className="grid gap-6 lg:grid-cols-3" stagger={0.1}>
          <HeartRateChart data={data.heartRateHistory} />
          <StepsChart data={data.stepsHistory} />
          <SleepChart data={data.sleepHistory} />
        </ScrollStagger>
      </ScrollSection>

      {/* Emergency Section */}
      <ScrollSection animation="scale">
        <ScrollStagger className="grid gap-6 lg:grid-cols-2" stagger={0.15}>
          <EmergencyContacts />
          <div className="space-y-4">
            <EmergencyButton healthData={data} />
            <p className="text-xs text-center text-muted-foreground">
              Pressing this button will alert all your emergency contacts with your current health status.
            </p>
          </div>
        </ScrollStagger>
      </ScrollSection>

      <Chatbot healthData={data} analysis={analysis} />
    </motion.div>
  )
}

