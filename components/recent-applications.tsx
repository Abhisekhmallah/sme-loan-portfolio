"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { applications, getApplicationStatus, formatCurrency } from "@/lib/data"
import { ArrowRight } from "lucide-react"

const statusStyles = {
  "Ready for Appraisal": "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  "Conditional Approval": "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
  "On Hold": "bg-violet-500/20 text-violet-600 dark:text-violet-400 border-violet-500/30",
  Rejected: "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30",
}

interface RecentApplicationsProps {
  onNavigate?: (tab: string) => void
}

export function RecentApplications({ onNavigate }: RecentApplicationsProps) {
  const recentApps = applications.slice(0, 8)

  return (
    <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-foreground">Recent Applications</CardTitle>
          <CardDescription>Latest SME loan applications received</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-primary hover:text-primary"
          onClick={() => onNavigate?.("applications")}
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentApps.map((app) => {
            const status = getApplicationStatus(app)
            return (
              <div
                key={app.applicantId}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 cursor-pointer hover:bg-muted/50 hover:border-primary/30 transition-all duration-200"
                onClick={() => onNavigate?.("applications")}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-sm font-bold text-primary border border-primary/20">
                    {app.applicantId.slice(-2)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{app.applicantId}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.industry} • {app.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(app.loanAmount)}</span>
                  <Badge variant="outline" className={statusStyles[status]}>
                    {status}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
