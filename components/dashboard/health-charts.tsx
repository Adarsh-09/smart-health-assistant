"use client"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Footprints, Moon } from "lucide-react"

interface HeartRateChartProps {
  data: { time: string; value: number }[]
}

interface StepsChartProps {
  data: { day: string; value: number }[]
}

interface SleepChartProps {
  data: { day: string; value: number }[]
}

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 rounded-2xl border border-white/10 shadow-xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-bold text-foreground">
          {payload[0].value.toLocaleString()} <span className="text-muted-foreground font-medium">{unit}</span>
        </p>
      </div>
    )
  }
  return null
}

export function HeartRateChart({ data }: HeartRateChartProps) {
  return (
    <Card className="glass group hover:glow transition-all duration-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2">
          <Activity className="h-4 w-4 text-destructive" />
          Heart Rate Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                domain={[40, 140]}
              />
              <Tooltip content={<CustomTooltip unit="BPM" />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--destructive)"
                strokeWidth={3}
                dot={{ fill: "var(--destructive)", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "var(--destructive)", stroke: "white", strokeWidth: 2 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function StepsChart({ data }: StepsChartProps) {
  return (
    <Card className="glass group hover:glow transition-all duration-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2">
          <Footprints className="h-4 w-4 text-primary" />
          Weekly Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip unit="Steps" />} />
              <Bar
                dataKey="value"
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function SleepChart({ data }: SleepChartProps) {
  return (
    <Card className="glass group hover:glow transition-all duration-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2">
          <Moon className="h-4 w-4 text-indigo-400" />
          Sleep Consistency
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="rgb(129, 140, 248)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="rgb(129, 140, 248)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 12]}
              />
              <Tooltip content={<CustomTooltip unit="Hours" />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="rgb(129, 140, 248)"
                strokeWidth={3}
                fill="url(#sleepGradient)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
