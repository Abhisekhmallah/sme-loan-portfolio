"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { applications } from "@/lib/data"
import { useChartTheme } from "@/lib/chart-theme"

export function CategoryChart() {
  const { tooltipStyle } = useChartTheme()

  const categoryData = applications.reduce(
    (acc, app) => {
      acc[app.category] = (acc[app.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const data = [
    { name: "Small", value: categoryData["Small"] || 0, color: "#3b82f6" },
    { name: "Medium", value: categoryData["Medium"] || 0, color: "#10b981" },
    { name: "Large", value: categoryData["Large"] || 0, color: "#f59e0b" },
  ]

  return (
    <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">SME Category Distribution</CardTitle>
        <CardDescription>Applications by enterprise size</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend formatter={(value) => <span className="text-muted-foreground text-sm">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
