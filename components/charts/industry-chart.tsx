"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { applications, formatCurrency } from "@/lib/data"
import { useChartTheme } from "@/lib/chart-theme"

export function IndustryChart() {
  const { gridColor, textColor, tooltipStyle } = useChartTheme()

  const industryData = applications.reduce(
    (acc, app) => {
      if (!acc[app.industry]) {
        acc[app.industry] = { count: 0, amount: 0 }
      }
      acc[app.industry].count++
      acc[app.industry].amount += app.loanAmount
      return acc
    },
    {} as Record<string, { count: number; amount: number }>,
  )

  const data = Object.entries(industryData).map(([industry, data]) => ({
    name: industry,
    applications: data.count,
    amount: data.amount,
  }))

  const colors = ["#3b82f6", "#10b981", "#f59e0b"]

  return (
    <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Applications by Industry</CardTitle>
        <CardDescription>Distribution across Services, Trading, and Manufacturing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
              <XAxis type="number" stroke={textColor} fontSize={12} />
              <YAxis dataKey="name" type="category" stroke={textColor} fontSize={12} width={100} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number, name: string) => [
                  name === "amount" ? formatCurrency(value) : value,
                  name === "amount" ? "Total Amount" : "Applications",
                ]}
              />
              <Bar dataKey="applications" radius={[0, 4, 4, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
