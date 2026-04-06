"use client"

import { motion } from "framer-motion"
import { signIn } from "next-auth/react"
import { Activity, ShieldCheck, Zap, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.05),transparent_70%)] relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/20"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%", 
              scale: Math.random() * 0.5 + 0.5 
            }}
            animate={{ 
              y: [null, "-20px", "20px"],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            style={{ 
              width: Math.random() * 4 + "px", 
              height: Math.random() * 4 + "px" 
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <Card className="glass overflow-hidden border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
          <CardContent className="p-8 sm:p-12 space-y-8">
            {/* Branding */}
            <div className="text-center space-y-4">
              <motion.div 
                className="mx-auto h-20 w-20 rounded-[2rem] bg-primary flex items-center justify-center shadow-[0_12px_45px_rgba(var(--primary-rgb),0.5)] border-2 border-white/20"
                whileHover={{ rotate: 10, scale: 1.05 }}
              >
                <Activity className="h-10 w-10 text-primary-foreground" />
              </motion.div>
              <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tight text-foreground">
                  Aarogya-<span className="text-primary"> Mitra</span>
                </h1>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-[0.2em]">
                  AI-Powered Wellness Engine
                </p>
              </div>
            </div>

            {/* Features Staggered Entry */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: "Secure Analysis" },
                { icon: Zap, label: "Real-time Metrics" },
                { icon: Globe, label: "Global Sync" }
              ].map((f, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 text-center"
                >
                  <f.icon className="h-5 w-5 text-primary/70" />
                  <span className="text-[10px] font-bold uppercase leading-tight text-muted-foreground opacity-80">
                    {f.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Primary Action */}
            <div className="space-y-4 pt-4">
              <Button
                size="lg"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
              <p className="text-[11px] text-center text-muted-foreground/60 leading-relaxed max-w-[280px] mx-auto">
                Secure binary session management provided by Auth.js. No profile data is shared without consent.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-xs font-medium text-muted-foreground/80">
            © 2026 Aarogya- Mitra. All systems operational.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
