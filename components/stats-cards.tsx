"use client"

import { FileCheck, Clock, AlertTriangle, XCircle, TrendingUp, TrendingDown, IndianRupee } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { applications, getApplicationStatus, formatCurrency } from "@/lib/data"

interface StatsCardsProps {
  onNavigate?: (tab: string) => void
}

export function StatsCards({ onNavigate }: StatsCardsProps) {
  const stats = applications.reduce(
    (acc, app) => {
      const status = getApplicationStatus(app)
      acc.totalAmount += app.loanAmount
      if (status === "Ready for Appraisal") acc.ready++
      else if (status === "Conditional Approval") acc.conditional++
      else if (status === "On Hold") acc.onHold++
      else acc.rejected++
      return acc
    },
    { ready: 0, conditional: 0, onHold: 0, rejected: 0, totalAmount: 0 },
  )

  const cards = [
    {
      title: "Ready for Appraisal",
      value: stats.ready,
      icon: FileCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Conditional Approval",
      value: stats.conditional,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "On Hold",
      value: stats.onHold,
      icon: AlertTriangle,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
      trend: "-5%",
      trendUp: false,
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      trend: "-15%",
      trendUp: false,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={cn(
            "border bg-card cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
            card.borderColor,
          )}
          onClick={() => onNavigate?.("applications")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={`rounded-xl ${card.bgColor} p-3`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${card.trendUp ? "text-emerald-500" : "text-red-500"}`}
              >
                {card.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {card.trend}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-foreground">{card.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{card.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
      <Card
        className="border-primary/20 bg-gradient-to-br from-card to-primary/5 md:col-span-2 lg:col-span-4 cursor-pointer hover:shadow-lg transition-all duration-300"
        onClick={() => onNavigate?.("analytics")}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <IndianRupee className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                <p className="text-3xl font-bold text-foreground">{formatCurrency(stats.totalAmount)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Applications</p>
              <p className="text-3xl font-bold text-primary">{applications.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
