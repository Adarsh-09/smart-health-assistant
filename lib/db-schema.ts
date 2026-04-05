import { ObjectId } from "mongodb"

// ─── Health Data ────────────────────────────────────────────────────
export interface HealthEntry {
  _id?: ObjectId
  userId: string
  source: "google_fit" | "manual" | "simulated"
  heartRate: number
  steps: number
  sleepHours: number
  caloriesBurned?: number
  activityMinutes?: number
  screenTimeMinutes?: number
  meals?: number
  heartRateHistory: { time: string; value: number }[]
  stepsHistory: { day: string; value: number }[]
  sleepHistory: { day: string; value: number }[]
  timestamp: string
  createdAt: Date
}

// ─── Emergency Contact ──────────────────────────────────────────────
export interface EmergencyContact {
  _id?: ObjectId
  userId: string
  name: string
  phone: string
  relationship: string
  createdAt: Date
}

// ─── User Profile ───────────────────────────────────────────────────
export interface UserProfile {
  _id?: ObjectId
  userId: string
  name: string
  dataSource: "google_fit" | "manual" | "none"
  googleFitConnected: boolean
  googleTokens?: {
    access_token?: string | null
    refresh_token?: string | null
    scope?: string
    token_type?: string | null
    expiry_date?: number | null
  }
  lastSyncAt?: string
  createdAt: Date
}

// Default user ID for single-user demo mode
export const DEFAULT_USER_ID = "demo-user"
