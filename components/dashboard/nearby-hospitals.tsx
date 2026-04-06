"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Navigation, Phone, ExternalLink, Hash, Loader2, Hospital as HospitalIcon, ArrowRight, ShieldCheck, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Hospital {
  id: number
  name: string
  lat: number
  lon: number
  distance: number
  type?: string
}

export function NearbyHospitals() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const findHospitals = async () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ lat: latitude, lon: longitude })

        try {
          const response = await fetch(`/api/hospitals?lat=${latitude}&lon=${longitude}`)

          if (!response.ok) throw new Error("Failed to fetch hospital data")

          const data = await response.json()
          const results = data.elements.map((el: any) => {
            const lat = el.lat || el.center?.lat
            const lon = el.lon || el.center?.lon
            return {
              id: el.id,
              name: el.tags.name || "Emergency Medical Center",
              lat,
              lon,
              distance: calculateDistance(latitude, longitude, lat, lon),
              type: el.tags.amenity === "hospital" ? "Hospital" : "Clinic"
            }
          })
          .sort((a: Hospital, b: Hospital) => a.distance - b.distance)
          .slice(0, 5)

          setHospitals(results)
        } catch (err) {
          setError("Unable to find nearby hospitals. Try again.")
          console.error(err)
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        setError("Location access denied. Enable GPS to find help.")
        setLoading(false)
      }
    )
  }

  const openInMaps = (lat: number, lon: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`
    window.open(url, "_blank")
  }

  return (
    <Card className="glass relative group hover:glow transition-all duration-500 overflow-hidden border-primary/20 shadow-[0_0_50px_rgba(var(--primary-rgb),0.1)]">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <HospitalIcon className="h-24 w-24 text-primary" />
      </div>
      
      <CardHeader className="pb-4 border-b border-white/5 relative z-10 bg-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center glow animate-radar-pulse">
              <MapPin className="h-6 w-6 text-primary-foreground" />
            </div>
            Nearby Medical Support
          </CardTitle>
          {location && (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse">
              Live Location Active
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 relative z-10">
        <div className="p-6">
          <AnimatePresence mode="wait">
            {!location && !loading && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-10 text-center space-y-6"
              >
                <div className="radar-container mb-4">
                  <div className="radar-ring animate-radar-ripple" />
                  <div className="radar-ring animate-radar-ripple" style={{ animationDelay: '0.6s' }} />
                  <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/40 relative z-10">
                    <Navigation className="h-10 w-10 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-black tracking-tight">FASTEST HELP REQUIRED?</h3>
                  <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed mx-auto">
                    Aarogya- Mitra will scan for the absolute fastest medical routes in your current location.
                  </p>
                </div>

                <Button 
                  onClick={findHospitals} 
                  size="lg"
                  className="rounded-full px-12 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg shadow-[0_10px_40px_rgba(var(--primary-rgb),0.4)] group-hover:scale-105 transition-transform"
                >
                  LOCATE NEAREST HELP <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 space-y-6"
              >
                <div className="h-24 w-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div className="text-center space-y-2">
                  <p className="text-lg font-black text-primary tracking-[0.2em] uppercase">AI Scanning</p>
                  <p className="text-xs text-muted-foreground animate-pulse uppercase tracking-[0.3em]">Connecting to Overpass API...</p>
                </div>
              </motion.div>
            )}

            {hospitals.length > 0 && !loading && (
              <motion.div 
                key="results"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between px-1 mb-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary opacity-80">
                    Priority Medical Centers
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground">
                    Sorted by fastest arrival
                  </p>
                </div>
                
                {hospitals.map((hospital, idx) => (
                  <motion.div
                    key={hospital.id}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className={cn(
                      "group/item relative overflow-hidden flex flex-col p-5 rounded-3xl transition-all duration-300",
                      "bg-muted/40 border border-white/5 hover:border-primary/40 hover:bg-muted/60",
                      idx === 0 ? "border-primary/30 bg-primary/5 scale-[1.02] shadow-xl shadow-primary/5" : ""
                    )}
                  >
                    {idx === 0 && (
                      <div className="absolute top-0 right-0 px-4 py-1 bg-primary text-[10px] font-black text-primary-foreground rounded-bl-2xl">
                        FASTEST ARRIVAL
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <h4 className="text-base font-black truncate text-foreground group-hover/item:text-primary transition-colors">
                          {hospital.name}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-[11px] font-bold text-foreground/80">
                            <Navigation className="h-3 w-3 text-primary" />
                            {hospital.distance.toFixed(1)} km
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                            <ShieldCheck className="h-3 w-3" />
                            {hospital.type}
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        size="icon" 
                        onClick={() => openInMaps(hospital.lat, hospital.lon)}
                        className="rounded-2xl h-14 w-14 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
                      >
                        <ArrowRight className="h-7 w-7" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
                
                <Button 
                  variant="outline" 
                  onClick={findHospitals}
                  className="w-full rounded-2xl h-12 border-primary/20 text-xs font-black uppercase tracking-widest hover:bg-primary/5"
                >
                  Rescan Local Area
                </Button>
              </motion.div>
            )}

            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-3xl bg-destructive/10 border border-destructive/20 text-center space-y-6"
              >
                <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
                  <Hash className="h-8 w-8 text-destructive" />
                </div>
                <div className="space-y-2">
                  <p className="font-black text-destructive uppercase tracking-widest leading-none">Access Restricted</p>
                  <p className="text-xs text-muted-foreground">{error}</p>
                </div>
                <Button 
                  onClick={findHospitals} 
                  variant="destructive"
                  className="rounded-full px-12 group-hover:scale-105 transition-transform font-bold"
                >
                  RETRY CONNECTION
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}
