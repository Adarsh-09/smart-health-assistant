import { NextResponse } from "next/server"
import { google } from "googleapis"
import { getDb } from "@/lib/mongodb"
import { DEFAULT_USER_ID } from "@/lib/db-schema"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  
  if (!code) {
    return NextResponse.redirect(new URL("/#dashboard?error=NoCode", request.url))
  }

  const host = request.headers.get("host")
  const protocol = host?.includes("localhost") ? "http" : "https"
  const baseUrl = `${protocol}://${host}`

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${baseUrl}/api/auth/callback`
  )

  try {
    const { tokens } = await oauth2Client.getToken(code)
    
    // Store tokens securely in MongoDB
    const db = await getDb()
    if (db) {
      await db.collection("users").updateOne(
        { userId: DEFAULT_USER_ID },
        { 
          $set: { 
            googleTokens: tokens,
            googleFitConnected: true,
            dataSource: "google_fit",
            updatedAt: new Date()
          } 
        },
        { upsert: true }
      )
    }

    return NextResponse.redirect(new URL("/#dashboard", request.url))
  } catch (error) {
    console.error("OAuth token exchange error:", error)
    return NextResponse.redirect(new URL("/#dashboard?error=OAuthFailed", request.url))
  }
}
