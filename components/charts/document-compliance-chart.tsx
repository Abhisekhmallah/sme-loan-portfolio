"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { applications } from "@/lib/data"
import { useChartTheme } from "@/lib/chart-theme"

export function DocumentComplianceChart() {
  const { gridColor, textColor, tooltipStyle } = useChartTheme()

  const kycYes = applications.filter((a) => a.kycSubmitted).length
  const kycNo = applications.length - kycYes
  const incomeYes = applications.filter((a) => a.incomeDocSubmitted).length
  const incomeNo = applications.length - incomeYes
  const businessYes = applications.filter((a) => a.businessProofSubmitted).length
  const businessNo = applications.length - businessYes

  const data = [
    { name: "KYC Documents", submitted: kycYes, missing: kycNo },
    { name: "Income Proof", submitted: incomeYes, missing: incomeNo },
    { name: "Business Proof", submitted: businessYes, missing: businessNo },
  ]

  return (
    <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Document Compliance Analysis</CardTitle>
        <CardDescription>Submission rates across document categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" stroke={textColor} fontSize={11} />
              <YAxis stroke={textColor} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                formatter={(value) => (
                  <span className="text-muted-foreground text-sm">
                    {value === "submitted" ? "Submitted" : "Missing"}
                  </span>
                )}
              />
              <Bar dataKey="submitted" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="missing" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
