"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { Watch, Wifi, WifiOff, RefreshCw, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ConnectWatchProps {
  dataSource: string
  lastSyncAt?: string
  onSync: () => void
}

export function ConnectWatch({ dataSource, lastSyncAt, onSync }: ConnectWatchProps) {
  const searchParams = useSearchParams()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(dataSource === "google_fit")

  useEffect(() => {
    const error = searchParams.get("error")
    if (error === "MissingCredentials") {
      toast.error("Google OAuth Keys Missing", { description: "You must provide GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env" })
    } else if (error === "OAuthFailed") {
      toast.error("Authentication Failed", { description: "We could not link your Google Fit account." })
    }
  }, [searchParams])

  const handleConnect = () => {
    setIsConnecting(true)
    // Redirect to the real Google OAuth 2.0 flow
    window.location.href = "/api/auth/google"
  }

  const handleResync = async () => {
    setIsConnecting(true)
    try {
      const res = await fetch("/api/googlefit", { method: "POST" })
      const data = await res.json()
      if (data.success) onSync()
    } catch (error) {
      console.error("Resync failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Card className="glass group hover:glow transition-all duration-500 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2">
          <Watch className="h-4 w-4 text-primary" />
          Smartwatch Sync
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          {isConnected ? (
            <motion.div
              key="connected"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Wifi className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">Connected to Google Fit</p>
                  {lastSyncAt && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Last sync: {new Date(lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              </div>
              <Button
                onClick={handleResync}
                disabled={isConnecting}
                variant="outline"
                className="w-full glass border-white/10 rounded-2xl h-11"
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {isConnecting ? "Syncing..." : "Re-sync Data"}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="disconnected"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-white/5">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <WifiOff className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">No Watch Connected</p>
                  <p className="text-[10px] text-muted-foreground">
                    Connect to get real health data
                  </p>
                </div>
              </div>
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-primary hover:bg-primary/90 rounded-2xl h-11 shadow-lg glow"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Watch className="h-4 w-4 mr-2" />
                    Connect Smartwatch
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
