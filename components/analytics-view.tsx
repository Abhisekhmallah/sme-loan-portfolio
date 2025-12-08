"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { applications, getApplicationStatus, formatCurrency } from "@/lib/data"
import { TrendingUp, TrendingDown, Target, AlertTriangle } from "lucide-react"

export function AnalyticsView() {
  const analytics = useMemo(() => {
    const statusCounts = applications.reduce(
      (acc, app) => {
        const status = getApplicationStatus(app)
        acc[status] = (acc[status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const industryData = applications.reduce(
      (acc, app) => {
        const status = getApplicationStatus(app)
        if (!acc[app.industry]) {
          acc[app.industry] = { total: 0, approved: 0, rejected: 0, amount: 0 }
        }
        acc[app.industry].total++
        acc[app.industry].amount += app.loanAmount
        if (status === "Ready for Appraisal" || status === "Conditional Approval") {
          acc[app.industry].approved++
        } else if (status === "Rejected") {
          acc[app.industry].rejected++
        }
        return acc
      },
      {} as Record<string, { total: number; approved: number; rejected: number; amount: number }>,
    )

    const categoryData = applications.reduce(
      (acc, app) => {
        if (!acc[app.category]) {
          acc[app.category] = { count: 0, amount: 0 }
        }
        acc[app.category].count++
        acc[app.category].amount += app.loanAmount
        return acc
      },
      {} as Record<string, { count: number; amount: number }>,
    )

    const docComplianceRate = {
      kyc: (applications.filter((a) => a.kycSubmitted).length / applications.length) * 100,
      income: (applications.filter((a) => a.incomeDocSubmitted).length / applications.length) * 100,
      business: (applications.filter((a) => a.businessProofSubmitted).length / applications.length) * 100,
    }

    const approvalRate = ((statusCounts["Ready for Appraisal"] || 0) / applications.length) * 100

    const totalLoanAmount = applications.reduce((sum, app) => sum + app.loanAmount, 0)

    return {
      statusCounts,
      industryData,
      categoryData,
      docComplianceRate,
      approvalRate,
      totalLoanAmount,
    }
  }, [])

  const statusChartData = [
    { name: "Ready", value: analytics.statusCounts["Ready for Appraisal"] || 0, color: "#10b981" },
    { name: "Conditional", value: analytics.statusCounts["Conditional Approval"] || 0, color: "#f59e0b" },
    { name: "On Hold", value: analytics.statusCounts["On Hold"] || 0, color: "#8b5cf6" },
    { name: "Rejected", value: analytics.statusCounts["Rejected"] || 0, color: "#ef4444" },
  ]

  const industryChartData = Object.entries(analytics.industryData).map(([name, data]) => ({
    name,
    total: data.total,
    approved: data.approved,
    rejected: data.rejected,
    approvalRate: ((data.approved / data.total) * 100).toFixed(1),
  }))

  const complianceData = [
    { name: "KYC", rate: analytics.docComplianceRate.kyc },
    { name: "Income", rate: analytics.docComplianceRate.income },
    { name: "Business", rate: analytics.docComplianceRate.business },
  ]

  const trendData = [
    { month: "Jan", applications: 35, approved: 12 },
    { month: "Feb", applications: 42, approved: 18 },
    { month: "Mar", applications: 38, approved: 15 },
    { month: "Apr", applications: 45, approved: 22 },
    { month: "May", applications: 50, approved: 25 },
    { month: "Jun", applications: 40, approved: 20 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Comprehensive insights into SME loan pre-screening performance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold text-foreground">{applications.length}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <Target className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-accent">
              <TrendingUp className="h-3 w-3" />
              <span>+18% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
                <p className="text-2xl font-bold text-foreground">{analytics.approvalRate.toFixed(1)}%</p>
              </div>
              <Badge className="bg-accent/20 text-accent">Ready</Badge>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-accent">
              <TrendingUp className="h-3 w-3" />
              <span>+5.2% improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Loan Value</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(analytics.totalLoanAmount)}</p>
              </div>
              <Badge className="bg-primary/20 text-primary">Portfolio</Badge>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-accent">
              <TrendingUp className="h-3 w-3" />
              <span>+12% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejection Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {(((analytics.statusCounts["Rejected"] || 0) / applications.length) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="rounded-lg bg-destructive/10 p-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
              <TrendingDown className="h-3 w-3" />
              <span>-8% reduction</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Application Status Distribution</CardTitle>
            <CardDescription>Breakdown of all 250 applications by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Industry Performance</CardTitle>
            <CardDescription>Applications and approval rates by industry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={industryChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="approved" fill="#10b981" name="Approved" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rejected" fill="#ef4444" name="Rejected" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Document Compliance Rates</CardTitle>
            <CardDescription>Percentage of applications with complete documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complianceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, "Compliance Rate"]}
                  />
                  <Bar dataKey="rate" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Application Trends</CardTitle>
            <CardDescription>Monthly application and approval trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                    name="Applications"
                  />
                  <Area
                    type="monotone"
                    dataKey="approved"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                    name="Approved"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Key Insights</CardTitle>
          <CardDescription>AI-generated recommendations for improving approval rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-accent/30 bg-accent/10 p-4">
              <h4 className="font-medium text-accent">High Performer</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Services sector shows highest approval rate at{" "}
                {industryChartData.find((d) => d.name === "Services")?.approvalRate}%
              </p>
            </div>
            <div className="rounded-lg border border-warning/30 bg-warning/10 p-4">
              <h4 className="font-medium text-warning">Improvement Area</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Income documentation compliance at {analytics.docComplianceRate.income.toFixed(1)}% needs attention
              </p>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
              <h4 className="font-medium text-primary">Recommendation</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Focus on KYC completion to reduce rejection rate by up to 40%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
