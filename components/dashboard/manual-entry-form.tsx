"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ClipboardEdit, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface ManualEntryFormProps {
  onSubmit: () => void
}

export function ManualEntryForm({ onSubmit }: ManualEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [form, setForm] = useState({
    sleepHours: "",
    steps: "",
    heartRate: "",
    meals: "",
    activityMinutes: "",
    screenTimeMinutes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.sleepHours || !form.steps) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/manual-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sleepHours: parseFloat(form.sleepHours),
          steps: parseInt(form.steps),
          heartRate: form.heartRate ? parseInt(form.heartRate) : undefined,
          meals: form.meals ? parseInt(form.meals) : undefined,
          activityMinutes: form.activityMinutes ? parseInt(form.activityMinutes) : undefined,
          screenTimeMinutes: form.screenTimeMinutes ? parseInt(form.screenTimeMinutes) : undefined,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setIsSuccess(true)
        onSubmit()
        setTimeout(() => setIsSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Manual entry failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const fields = [
    { name: "sleepHours", label: "Sleep (hours)", placeholder: "7.5", required: true },
    { name: "steps", label: "Steps", placeholder: "8000", required: true },
    { name: "heartRate", label: "Heart Rate (BPM)", placeholder: "72" },
    { name: "meals", label: "Meals", placeholder: "3" },
    { name: "activityMinutes", label: "Activity (min)", placeholder: "45" },
    { name: "screenTimeMinutes", label: "Screen Time (min)", placeholder: "180" },
  ]

  return (
    <Card className="glass group hover:glow transition-all duration-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2">
          <ClipboardEdit className="h-4 w-4 text-primary" />
          Manual Health Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {fields.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {field.label} {field.required && <span className="text-destructive">*</span>}
                </label>
                <Input
                  type="number"
                  name={field.name}
                  value={(form as any)[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  step="any"
                  className="bg-secondary/50 border-white/5 rounded-xl h-10 text-sm focus:ring-primary/20"
                />
              </div>
            ))}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !form.sleepHours || !form.steps}
            className="w-full rounded-2xl h-11 bg-primary hover:bg-primary/90 shadow-lg"
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
            ) : isSuccess ? (
              <><CheckCircle2 className="h-4 w-4 mr-2" /> Saved!</>
            ) : (
              "Analyse Health Metrics"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
