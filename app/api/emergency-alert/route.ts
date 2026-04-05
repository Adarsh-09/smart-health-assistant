import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { DEFAULT_USER_ID } from "@/lib/db-schema"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { alertType, userName, healthData } = body

    // Fetch emergency contacts
    const db = await getDb()
    let contacts: any[] = []
    if (db) {
      contacts = await db
        .collection("emergencyContacts")
        .find({ userId: DEFAULT_USER_ID })
        .toArray()
    }

    if (contacts.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No emergency contacts configured. Please add contacts first.",
        deliveryResults: [],
      })
    }

    // Build alert message
    const name = userName || "Health User"
    let contextMsg = ""
    if (healthData) {
      contextMsg = `\nCurrent vitals: HR ${healthData.heartRate} BPM, ${healthData.steps} steps, ${healthData.sleepHours}h sleep.`
    }
    const message = `⚠️ HEALTH ALERT: ${name} may need immediate help. Reason: ${alertType || "Emergency button pressed"}.${contextMsg}\n\nPlease check on them immediately. — HealthAI`

    const deliveryResults: any[] = []

    // Send via Twilio if configured
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      const twilio = require("twilio")
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

      for (const contact of contacts) {
        try {
          const result = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: contact.phone,
          })
          deliveryResults.push({
            contact: contact.name,
            phone: contact.phone,
            status: "sent",
            sid: result.sid,
          })
        } catch (err: any) {
          deliveryResults.push({
            contact: contact.name,
            phone: contact.phone,
            status: "failed",
            error: err.message,
          })
        }
      }
    } else {
      // Simulate delivery when Twilio is not configured
      for (const contact of contacts) {
        deliveryResults.push({
          contact: contact.name,
          phone: contact.phone,
          status: "simulated",
          message: "Twilio not configured — SMS simulated",
        })
      }
    }

    // Log the alert in the database
    if (db) {
      await db.collection("alertLog").insertOne({
        userId: DEFAULT_USER_ID,
        alertType,
        message,
        deliveryResults,
        createdAt: new Date(),
      })
    }

    return NextResponse.json({
      success: true,
      message: `Alert sent to ${deliveryResults.length} contact(s)`,
      deliveryResults,
    })
  } catch (error) {
    console.error("Emergency alert error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to send emergency alert" },
      { status: 500 }
    )
  }
}
