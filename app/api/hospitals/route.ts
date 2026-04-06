import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 })
  }

  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:10000,${lat},${lon});
      way["amenity"="hospital"](around:10000,${lat},${lon});
      relation["amenity"="hospital"](around:10000,${lat},${lon});
    );
    out center;
  `

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
      headers: {
        "Content-Type": "text/plain",
      },
    })

    if (!response.ok) {
      throw new Error(`Overpass API responded with ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Overpass API proxy error:", error)
    return NextResponse.json(
      { error: "Failed to fetch medical data from Overpass API" },
      { status: 500 }
    )
  }
}
