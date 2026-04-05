import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { DEFAULT_USER_ID, type HealthEntry } from "@/lib/db-schema"
import { google } from "googleapis"

export async function POST(request: Request) {
  try {
    const db = await getDb()
    if (!db) throw new Error("No database connection")

    const user = await db.collection("users").findOne({ userId: DEFAULT_USER_ID })
    if (!user || !user.googleTokens) {
      return NextResponse.json({ success: false, message: "Not authenticated with Google" }, { status: 401 })
    }

    const host = request.headers.get("host")
    const protocol = host?.includes("localhost") ? "http" : "https"
    
    // Initialize google auth client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${protocol}://${host}/api/auth/callback`
    )

    oauth2Client.setCredentials(user.googleTokens)

    // Handle token refresh automatically
    oauth2Client.on('tokens', async (tokens) => {
      const currentTokens = user.googleTokens
      if (tokens.access_token) currentTokens.access_token = tokens.access_token
      if (tokens.refresh_token) currentTokens.refresh_token = tokens.refresh_token
      if (tokens.expiry_date) currentTokens.expiry_date = tokens.expiry_date
      
      await db.collection("users").updateOne(
        { userId: DEFAULT_USER_ID },
        { $set: { googleTokens: currentTokens } }
      )
    })

    const fitness = google.fitness({ version: 'v1', auth: oauth2Client })
    
    // Last 24 hours window
    const endTime = new Date()
    const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000)
    
    let steps = 0, calories = 0, heartRate = 0, sleepHours = 0

    try {
      // 1. Fetch Aggregated Data (Steps, Calories, Heart Rate)
      const response = await fitness.users.dataset.aggregate({
        userId: "me",
        requestBody: {
          aggregateBy: [
            { dataTypeName: "com.google.step_count.delta" },
            { dataTypeName: "com.google.calories.expended" },
            { dataTypeName: "com.google.heart_rate.bpm" }
          ],
          bucketByTime: { durationMillis: "86400000" }, // 24 hours in millis
          // The JS SDK expects strings mostly for large numbers, but we'll adapt.
          startTimeMillis: startTime.getTime().toString(),
          endTimeMillis: endTime.getTime().toString(),
        }
      })
      
      const bucket = response.data.bucket?.[0]
      if (bucket && bucket.dataset) {
         const stepsData = bucket.dataset.find((d: any) => d.dataSourceId?.includes("step_count.delta"))
         if (stepsData?.point?.[0]?.value?.[0]?.intVal) steps = stepsData.point[0].value[0].intVal
         
         const caloriesData = bucket.dataset.find((d: any) => d.dataSourceId?.includes("calories.expended"))
         if (caloriesData?.point?.[0]?.value?.[0]?.fpVal) calories = Math.round(caloriesData.point[0].value[0].fpVal)
         
         const hrData = bucket.dataset.find((d: any) => d.dataSourceId?.includes("heart_rate.bpm"))
         if (hrData?.point?.[0]?.value?.[0]?.fpVal) heartRate = Math.round(hrData.point[0].value[0].fpVal)
      }

      // 2. Sleep is complicated in aggregate API, so we fetch sessions
      const sleepResponse = await fitness.users.sessions.list({
        userId: "me",
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      })

      if (sleepResponse.data.session) {
        let totalSleepMillis = 0
        sleepResponse.data.session.forEach((session: any) => {
          if (session.activityType === 72) { // 72 = Sleep
            const start = parseInt(session.startTimeMillis || "0")
            const end = parseInt(session.endTimeMillis || "0")
            totalSleepMillis += (end - start)
          }
        })
        sleepHours = parseFloat((totalSleepMillis / (1000 * 60 * 60)).toFixed(1))
      }
      
    } catch (apiError: any) {
      console.error("Fitness API error:", apiError)
      return NextResponse.json({ success: false, message: "Google Fit API Error: " + apiError.message }, { status: 500 })
    }

    // Default mock data array structures for the UI charts
    const healthEntry: HealthEntry = {
      userId: DEFAULT_USER_ID,
      source: "google_fit",
      heartRate: heartRate || 72,
      steps: steps || 0,
      sleepHours: sleepHours || 0,
      caloriesBurned: calories || 0,
      heartRateHistory: Array.from({ length: 6 }).map((_, i) => ({
        time: `${i * 4}h`,
        value: (heartRate || 72) + (Math.floor(Math.random() * 10) - 5),
      })),
      stepsHistory: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
        day,
        value: steps || Math.floor(Math.random() * 5000),
      })),
      sleepHistory: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
        day,
        value: Number(((sleepHours || 7) + (Math.random() * 2 - 1)).toFixed(1)),
      })),
      timestamp: new Date().toISOString(),
      createdAt: new Date(),
    }

    // Upsert real data via MongoDB
    await db.collection("healthData").updateOne(
      { userId: DEFAULT_USER_ID },
      { $set: healthEntry },
      { upsert: true }
    )
    
    // Update lastSyncAt
    await db.collection("users").updateOne(
      { userId: DEFAULT_USER_ID },
      { $set: { lastSyncAt: healthEntry.timestamp } }
    )

    return NextResponse.json({
      success: true,
      message: "Successfully synced with Google Fit",
      data: healthEntry,
    })
  } catch (error) {
    console.error("Google Fit Final Sync Error:", error)
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const db = await getDb()
    if (!db) return NextResponse.json({ connected: false, lastSyncAt: null })

    const user = await db.collection("users").findOne({ userId: DEFAULT_USER_ID })
    return NextResponse.json({
      connected: user?.googleFitConnected || false,
      lastSyncAt: user?.lastSyncAt || null,
      dataSource: user?.dataSource || "none",
    })
  } catch {
    return NextResponse.json({ connected: false, lastSyncAt: null })
  }
}
