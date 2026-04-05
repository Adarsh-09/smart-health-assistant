import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { DEFAULT_USER_ID } from "@/lib/db-schema"

export interface HealthData {
  heartRate: number
  steps: number
  sleepHours: number
  caloriesBurned?: number
  activityMinutes?: number
  screenTimeMinutes?: number
  meals?: number
  timestamp: string
  dataSource: "google_fit" | "manual" | "simulated"
  lastSyncAt?: string
  heartRateHistory: { time: string; value: number }[]
  stepsHistory: { day: string; value: number }[]
  sleepHistory: { day: string; value: number }[]
}

function generateRandomValue(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateHeartRateHistory(): { time: string; value: number }[] {
  const hours = ["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"]
  return hours.map((time) => ({
    time,
    value: generateRandomValue(55, 120),
  }))
}

function generateStepsHistory(): { day: string; value: number }[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return days.map((day) => ({
    day,
    value: generateRandomValue(1000, 12000),
  }))
}

function generateSleepHistory(): { day: string; value: number }[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return days.map((day) => ({
    day,
    value: parseFloat((Math.random() * 5 + 3).toFixed(1)),
  }))
}

export async function GET() {
  try {
    // Try to fetch real data from MongoDB first
    const db = await getDb()
    if (db) {
      const stored = await db
        .collection("healthData")
        .findOne({ userId: DEFAULT_USER_ID })

      if (stored) {
        const data: HealthData = {
          heartRate: stored.heartRate,
          steps: stored.steps,
          sleepHours: stored.sleepHours,
          caloriesBurned: stored.caloriesBurned,
          activityMinutes: stored.activityMinutes,
          screenTimeMinutes: stored.screenTimeMinutes,
          meals: stored.meals,
          timestamp: stored.timestamp,
          dataSource: stored.source,
          lastSyncAt: stored.timestamp,
          heartRateHistory: stored.heartRateHistory,
          stepsHistory: stored.stepsHistory,
          sleepHistory: stored.sleepHistory,
        }
        return NextResponse.json(data)
      }
    }
  } catch (error) {
    console.warn("MongoDB not available, falling back to simulated data:", error)
  }

  // Fallback: generate random simulated data
  const data: HealthData = {
    heartRate: generateRandomValue(60, 120),
    steps: generateRandomValue(1000, 10000),
    sleepHours: parseFloat((Math.random() * 5 + 3).toFixed(1)),
    timestamp: new Date().toISOString(),
    dataSource: "simulated",
    heartRateHistory: generateHeartRateHistory(),
    stepsHistory: generateStepsHistory(),
    sleepHistory: generateSleepHistory(),
  }

  return NextResponse.json(data)
}

