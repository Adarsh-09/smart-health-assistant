"use client"

import useSWR from "swr"
import type { HealthData } from "@/app/api/data/route"
import type { AnalysisResult } from "@/app/api/analyze/route"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useHealthData() {
  const { data, error, isLoading, mutate } = useSWR<HealthData>(
    "/api/data",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  )

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
  }
}

export function useAnalysis(healthData: HealthData | undefined) {
  const { data, error, isLoading } = useSWR<AnalysisResult>(
    healthData ? ["/api/analyze", healthData] : null,
    async () => {
      if (!healthData) return null
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heartRate: healthData.heartRate,
          steps: healthData.steps,
          sleepHours: healthData.sleepHours,
        }),
      })
      return res.json()
    },
    {
      revalidateOnFocus: false,
    }
  )

  return {
    analysis: data,
    error,
    isLoading,
  }
}
