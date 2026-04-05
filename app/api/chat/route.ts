import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" })

export async function POST(request: Request) {
  try {
    const { message, healthData, analysis } = await request.json()

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing")
      return NextResponse.json({ 
        response: "I'm sorry, but my AI core is currently disconnected. Please make sure the Gemini API key is configured." 
      })
    }

    const systemPrompt = `
      You are a Smart Health Assistant. You help users understand their health metrics and provide actionable advice.
      
      User's Current Health Data:
      - Heart Rate: ${healthData.heartRate} BPM
      - Steps Today: ${healthData.steps.toLocaleString()}
      - Sleep Duration: ${healthData.sleepHours} hours
      
      Health Analysis Summary:
      - Overall Score: ${analysis?.healthScore ?? "Unknown"}/100
      - Status: ${analysis?.scoreStatus ?? "Unknown"}
      - Active Alerts: ${analysis?.alerts?.map((a: any) => a.title).join(", ") || "None"}
      
      Instructions:
      - Be encouraging, professional, and concise.
      - Use the user's specific health data in your response when relevant.
      - If the user asks for a health tip, provide a specific one based on their data (e.g., if sleep is low, suggest sleep hygiene).
      - If the user asks about heart rate, steps, or sleep, refer to their current numbers.
      - If the user asks something unrelated to health, politely redirect them to health-related topics.
      - You can use formatting like bullet points for clarity.
    `

    const prompt = `System: ${systemPrompt}\n\nUser: ${message}`
    
    const result = await model.generateContent(prompt)
    const response = result.response.text()

    return NextResponse.json({ response })
  } catch (error: any) {
    console.error("Error in chat API:", error)
    if (error.response) {
      console.error("Error response details:", error.response.data || error.response)
    }
    return NextResponse.json({ 
      response: "I encountered an error while processing your request. Please try again in a moment." 
    })
  }
}
