"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { applications, getApplicationStatus } from "@/lib/data"
import { useTheme } from "next-themes"

export function StatusDistributionChart() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const statusCounts = applications.reduce(
    (acc, app) => {
      const status = getApplicationStatus(app)
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const data = [
    { name: "Ready for Appraisal", value: statusCounts["Ready for Appraisal"] || 0, color: "#10b981" },
    { name: "Conditional Approval", value: statusCounts["Conditional Approval"] || 0, color: "#f59e0b" },
    { name: "On Hold", value: statusCounts["On Hold"] || 0, color: "#8b5cf6" },
    { name: "Rejected", value: statusCounts["Rejected"] || 0, color: "#ef4444" },
  ]

  const isDark = mounted && theme === "dark"
  const tooltipStyle = {
    backgroundColor: isDark ? "#1e293b" : "#ffffff",
    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
    borderRadius: "8px",
    color: isDark ? "#f1f5f9" : "#1e293b",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  }

  return (
    <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Application Status Distribution</CardTitle>
        <CardDescription>Overview of all 250 applications by status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" className="drop-shadow-sm" />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => <span className="text-muted-foreground text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
