require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function run() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`)
    const data = await response.json()
    console.log("Available Models:")
    if (data.models) {
      data.models.filter(m => m.supportedGenerationMethods.includes('generateContent')).forEach(m => console.log(m.name))
    } else {
      console.log("Error or no models format:", data)
    }
  } catch (error) {
    console.error("Diagnostic Error:", error.message)
  }
}

run()
