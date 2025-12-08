"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { applications, formatCurrency } from "@/lib/data"
import { useChartTheme } from "@/lib/chart-theme"

export function LoanAmountChart() {
  const { gridColor, textColor, tooltipStyle } = useChartTheme()

  const ranges = [
    { min: 0, max: 1000000, label: "0-10L" },
    { min: 1000001, max: 2000000, label: "10L-20L" },
    { min: 2000001, max: 3000000, label: "20L-30L" },
    { min: 3000001, max: 4000000, label: "30L-40L" },
    { min: 4000001, max: 5000000, label: "40L-50L" },
  ]

  const data = ranges.map((range) => {
    const apps = applications.filter((a) => a.loanAmount >= range.min && a.loanAmount <= range.max)
    return {
      range: range.label,
      count: apps.length,
      totalAmount: apps.reduce((sum, a) => sum + a.loanAmount, 0),
    }
  })

  return (
    <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Loan Amount Distribution</CardTitle>
        <CardDescription>Applications grouped by loan amount ranges</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="range" stroke={textColor} fontSize={12} />
              <YAxis stroke={textColor} fontSize={12} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number, name: string) => [
                  name === "totalAmount" ? formatCurrency(value) : value,
                  name === "totalAmount" ? "Total Value" : "Applications",
                ]}
              />
              <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
