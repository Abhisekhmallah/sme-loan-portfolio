"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export function useChartTheme() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark")

  return {
    mounted,
    isDark,
    gridColor: isDark ? "#334155" : "#e2e8f0",
    textColor: isDark ? "#94a3b8" : "#64748b",
    tooltipStyle: {
      backgroundColor: isDark ? "#1e293b" : "#ffffff",
      border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
      borderRadius: "8px",
      color: isDark ? "#f1f5f9" : "#1e293b",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    },
  }
}
