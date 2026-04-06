"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Loader2, CheckCircle2, X, Siren, PhoneForwarded } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { HealthData } from "@/app/api/data/route"

interface EmergencyButtonProps {
  healthData?: HealthData
}

export function EmergencyButton({ healthData }: EmergencyButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleEmergency = async () => {
    setIsSending(true)
    setResult(null)

    try {
      const res = await fetch("/api/emergency-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertType: "Emergency button pressed by user",
          userName: "Health User",
          healthData: healthData
            ? {
                heartRate: healthData.heartRate,
                steps: healthData.steps,
                sleepHours: healthData.sleepHours,
              }
            : null,
        }),
      })
      const data = await res.json()
      setResult({ success: data.success, message: data.message })
    } catch {
      setResult({ success: false, message: "Failed to send emergency alert" })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Primary: Direct Call to Ambulance */}
      <motion.div 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
        className="w-full"
      >
        <a 
          href="tel:108" 
          className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-[0_0_40px_rgba(239,68,68,0.4)] border-2 border-white/20 text-lg font-black tracking-widest uppercase transition-all animate-radar-pulse"
        >
          <PhoneForwarded className="h-6 w-6" />
          Call Ambulance (108)
        </a>
      </motion.div>

      {/* Secondary: Alert Contacts via SMS */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={() => setShowConfirm(true)}
          variant="outline"
          className="w-full h-12 rounded-2xl glass border-white/10 hover:border-red-500/50 hover:bg-red-500/5 text-sm font-bold text-muted-foreground transition-all"
        >
          <Siren className="h-4 w-4 mr-2" />
          Alert Emergency Contacts
        </Button>
      </motion.div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => !isSending && setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass rounded-3xl p-8 space-y-6 border border-white/10 shadow-2xl"
            >
              {!result ? (
                <>
                  <div className="text-center space-y-3">
                    <div className="mx-auto h-16 w-16 rounded-2xl bg-red-500/20 flex items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold">Send Emergency Alert?</h3>
                    <p className="text-sm text-muted-foreground">
                      This will immediately send an SMS alert to all your emergency contacts
                      with your current health status.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowConfirm(false)}
                      disabled={isSending}
                      className="flex-1 h-12 rounded-2xl glass border-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleEmergency}
                      disabled={isSending}
                      className="flex-1 h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg"
                    >
                      {isSending ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</>
                      ) : (
                        "Send Alert Now"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center ${
                    result.success ? "bg-emerald-500/20" : "bg-red-500/20"
                  }`}>
                    {result.success ? (
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    ) : (
                      <X className="h-8 w-8 text-red-500" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold">
                    {result.success ? "Alert Sent" : "Alert Failed"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{result.message}</p>
                  <Button
                    onClick={() => { setShowConfirm(false); setResult(null) }}
                    className="w-full h-12 rounded-2xl glass border-white/10"
                    variant="outline"
                  >
                    Close
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
