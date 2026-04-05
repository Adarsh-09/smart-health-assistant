require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

async function run() {
  try {
    const result = await model.generateContent("What is AI? Reply in one sentence.")
    console.log("Success:", result.response.text())
  } catch (error) {
    console.error("Diagnostic Error:", error.message)
    console.error("Status:", error.status)
    if (error.response) console.error("Response:", error.response)
  }
}

run()
