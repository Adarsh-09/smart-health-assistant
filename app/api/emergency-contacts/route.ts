import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { DEFAULT_USER_ID, type EmergencyContact } from "@/lib/db-schema"
import { ObjectId } from "mongodb"

// GET: List all emergency contacts
export async function GET() {
  try {
    const db = await getDb()
    if (!db) {
      return NextResponse.json({ contacts: [] })
    }
    const contacts = await db
      .collection("emergencyContacts")
      .find({ userId: DEFAULT_USER_ID })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json({ contacts: [] })
  }
}

// POST: Add a new emergency contact
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, relationship } = body

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: "Name and phone are required" },
        { status: 400 }
      )
    }

    const contact: EmergencyContact = {
      userId: DEFAULT_USER_ID,
      name,
      phone,
      relationship: relationship || "Family",
      createdAt: new Date(),
    }

    const db = await getDb()
    if (db) {
      await db.collection("emergencyContacts").insertOne(contact)
    }

    return NextResponse.json({ success: true, contact })
  } catch (error) {
    console.error("Error adding contact:", error)
    return NextResponse.json(
      { success: false, message: "Failed to add contact" },
      { status: 500 }
    )
  }
}

// DELETE: Remove an emergency contact
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Contact ID is required" },
        { status: 400 }
      )
    }

    const db = await getDb()
    if (db) {
      await db.collection("emergencyContacts").deleteOne({
        _id: new ObjectId(id),
        userId: DEFAULT_USER_ID,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting contact:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete contact" },
      { status: 500 }
    )
  }
}
