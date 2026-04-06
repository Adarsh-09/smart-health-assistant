import { NextResponse } from "next/server"

export interface Alert {
  id: string
  type: "danger" | "warning" | "info"
  title: string
  message: string
  suggestions: string[]
}

export interface Insight {
  id: string
  message: string
  category: "sleep" | "activity" | "heart"
}

export interface AnalysisResult {
  healthScore: number
  scoreStatus: "good" | "moderate" | "poor"
  alerts: Alert[]
  insights: Insight[]
}

function calculateHealthScore(
  sleepHours: number,
  steps: number,
  heartRate: number
): { score: number; status: "good" | "moderate" | "poor" } {
  // Sleep score (40% weight) - optimal 7-9 hours
  let sleepScore = 0
  if (sleepHours >= 7 && sleepHours <= 9) {
    sleepScore = 100
  } else if (sleepHours >= 6 && sleepHours < 7) {
    sleepScore = 70
  } else if (sleepHours >= 5 && sleepHours < 6) {
    sleepScore = 50
  } else if (sleepHours < 5) {
    sleepScore = 20
  } else {
    sleepScore = 60 // More than 9 hours
  }

  // Steps score (30% weight) - optimal 10000+ steps
  let stepsScore = 0
  if (steps >= 10000) {
    stepsScore = 100
  } else if (steps >= 7500) {
    stepsScore = 80
  } else if (steps >= 5000) {
    stepsScore = 60
  } else if (steps >= 3000) {
    stepsScore = 40
  } else {
    stepsScore = 20
  }

  // Heart rate score (30% weight) - optimal 60-80 BPM resting
  let heartScore = 0
  if (heartRate >= 60 && heartRate <= 80) {
    heartScore = 100
  } else if (heartRate >= 50 && heartRate < 60) {
    heartScore = 80
  } else if (heartRate > 80 && heartRate <= 90) {
    heartScore = 70
  } else if (heartRate > 90 && heartRate <= 100) {
    heartScore = 50
  } else if (heartRate > 100) {
    heartScore = 30
  } else {
    heartScore = 40 // Below 50 BPM
  }

  const totalScore = Math.round(
    sleepScore * 0.4 + stepsScore * 0.3 + heartScore * 0.3
  )

  let status: "good" | "moderate" | "poor"
  if (totalScore >= 70) {
    status = "good"
  } else if (totalScore >= 50) {
    status = "moderate"
  } else {
    status = "poor"
  }

  return { score: totalScore, status }
}

function generateAlerts(
  sleepHours: number,
  steps: number,
  heartRate: number
): Alert[] {
  const alerts: Alert[] = []

  if (heartRate > 100) {
    alerts.push({
      id: "high-hr",
      type: "danger",
      title: "High Heart Rate",
      message: `Your resting heart rate is ${heartRate} BPM, which is above normal range.`,
      suggestions: [
        "Practice deep breathing or meditation",
        "Avoid caffeine or stimulants",
        "Contact a doctor if persists"
      ]
    })
  }

  if (sleepHours < 5) {
    alerts.push({
      id: "low-sleep",
      type: "danger",
      title: "Insufficient Sleep",
      message: `You only slept ${sleepHours} hours. This may affect your health and performance.`,
      suggestions: [
        "Take a short power nap (max 20 min)",
        "Avoid intense exercise today",
        "Set a consistent sleep schedule"
      ]
    })
  } else if (sleepHours < 6) {
    alerts.push({
      id: "moderate-sleep",
      type: "warning",
      title: "Low Sleep Duration",
      message: `You slept ${sleepHours} hours. Consider getting more rest tonight.`,
      suggestions: [
        "Avoid blue light/screens before bed",
        "Ensure a cool, dark sleeping environment",
        "Avoid heavy meals tonight"
      ]
    })
  }

  if (steps < 3000) {
    alerts.push({
      id: "sedentary",
      type: "warning",
      title: "Low Activity",
      message: `Only ${steps.toLocaleString()} steps today. Try to move more!`,
      suggestions: [
        "Try a 10-minute active stretch",
        "Take the stairs instead of the elevator",
        "Go for a short walk after your next meal"
      ]
    })
  }

  if (heartRate < 50) {
    alerts.push({
      id: "low-hr",
      type: "info",
      title: "Low Heart Rate",
      message: `Your heart rate is ${heartRate} BPM. This could indicate excellent fitness or bradycardia.`,
      suggestions: [
        "Monitor for any dizziness or fatigue",
        "Check with a doctor if you feel lightheaded",
        "Keep track of physical activity intensity"
      ]
    })
  }

  return alerts
}

function generateInsights(
  sleepHours: number,
  steps: number,
  heartRate: number
): Insight[] {
  const insights: Insight[] = []

  // Sleep insights
  if (sleepHours < 6) {
    insights.push({
      id: "sleep-1",
      message:
        "You slept less than recommended. Your body may feel fatigued today.",
      category: "sleep",
    })
  } else if (sleepHours >= 7 && sleepHours <= 9) {
    insights.push({
      id: "sleep-2",
      message: "Great sleep! You got the recommended 7-9 hours of rest.",
      category: "sleep",
    })
  }

  // Activity insights
  if (steps < 5000) {
    insights.push({
      id: "activity-1",
      message: "Low activity detected. Try taking a short walk or stretching.",
      category: "activity",
    })
  } else if (steps >= 10000) {
    insights.push({
      id: "activity-2",
      message:
        "Excellent activity level! You've reached your daily step goal.",
      category: "activity",
    })
  } else {
    insights.push({
      id: "activity-3",
      message: `${(10000 - steps).toLocaleString()} more steps to reach your daily goal.`,
      category: "activity",
    })
  }

  // Heart rate insights
  if (heartRate > 90) {
    insights.push({
      id: "heart-1",
      message:
        "Your heart rate is elevated. Consider relaxation techniques or check stress levels.",
      category: "heart",
    })
  } else if (heartRate >= 60 && heartRate <= 80) {
    insights.push({
      id: "heart-2",
      message: "Your resting heart rate is in the healthy range.",
      category: "heart",
    })
  }

  return insights
}

export async function POST(request: Request) {
  const body = await request.json()
  const { heartRate, steps, sleepHours } = body

  const { score, status } = calculateHealthScore(sleepHours, steps, heartRate)
  const alerts = generateAlerts(sleepHours, steps, heartRate)
  const insights = generateInsights(sleepHours, steps, heartRate)

  const result: AnalysisResult = {
    healthScore: score,
    scoreStatus: status,
    alerts,
    insights,
  }

  return NextResponse.json(result)
}
