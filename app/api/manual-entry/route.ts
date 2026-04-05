import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { DEFAULT_USER_ID, type HealthEntry } from "@/lib/db-schema"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sleepHours, meals, activityMinutes, screenTimeMinutes, heartRate, steps } = body

    // Validation
    if (sleepHours == null || steps == null) {
      return NextResponse.json(
        { success: false, message: "Sleep hours and steps are required" },
        { status: 400 }
      )
    }

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    const healthEntry: HealthEntry = {
      userId: DEFAULT_USER_ID,
      source: "manual",
      heartRate: heartRate || 72,
      steps: steps,
      sleepHours: sleepHours,
      meals: meals,
      activityMinutes: activityMinutes,
      screenTimeMinutes: screenTimeMinutes,
      heartRateHistory: ["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"].map(
        (time) => ({ time, value: (heartRate || 72) + Math.floor(Math.random() * 15 - 7) })
      ),
      stepsHistory: days.map((day) => ({
        day,
        value: Math.floor(steps * (0.7 + Math.random() * 0.6)),
      })),
      sleepHistory: days.map((day) => ({
        day,
        value: parseFloat((sleepHours + (Math.random() * 2 - 1)).toFixed(1)),
      })),
      timestamp: new Date().toISOString(),
      createdAt: new Date(),
    }

    const db = await getDb()
    if (db) {
      await db.collection("healthData").updateOne(
        { userId: DEFAULT_USER_ID },
        { $set: healthEntry },
        { upsert: true }
      )

      await db.collection("users").updateOne(
        { userId: DEFAULT_USER_ID },
        {
          $set: {
            dataSource: "manual",
            googleFitConnected: false,
          },
          $setOnInsert: {
            userId: DEFAULT_USER_ID,
            name: "Health User",
            createdAt: new Date(),
          },
        },
        { upsert: true }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Manual health data saved successfully",
      data: healthEntry,
    })
  } catch (error) {
    console.error("Manual entry error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to save manual data" },
      { status: 500 }
    )
  }
}
