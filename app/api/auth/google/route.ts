import { NextResponse } from "next/server"
import { google } from "googleapis"

export async function GET(request: Request) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("Missing Google OAuth credentials")
    return NextResponse.redirect(new URL("/#dashboard?error=MissingCredentials", request.url))
  }

  const host = request.headers.get("host")
  const protocol = host?.includes("localhost") ? "http" : "https"
  const baseUrl = `${protocol}://${host}`

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${baseUrl}/api/auth/callback`
  )

  const scopes = [
    "https://www.googleapis.com/auth/fitness.activity.read",
    "https://www.googleapis.com/auth/fitness.body.read",
  ]

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent", // Forces consent so we always get a refresh_token
  })

  return NextResponse.redirect(url)
}
