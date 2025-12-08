"use client"

import { FileCheck, Clock, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const workflowSteps = [
  {
    id: 1,
    title: "KYC Check",
    description: "Verify identity documents",
    icon: FileCheck,
    pass: "Proceed to document review",
    fail: "Application Rejected",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 2,
    title: "Income Proof",
    description: "Financial documentation",
    icon: Clock,
    pass: "Check business proof",
    fail: "Put on Hold (pending income docs)",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    id: 3,
    title: "Business Proof",
    description: "Registration & compliance",
    icon: AlertTriangle,
    pass: "Ready for Appraisal",
    fail: "Conditional Approval (pending business proof)",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
]

export function WorkflowStatus() {
  return (
    <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Pre-Screening Workflow</CardTitle>
        <CardDescription>Document verification process flow</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${step.bgColor} ${step.color}`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                {index < workflowSteps.length - 1 && (
                  <div className="mt-2 h-12 w-0.5 bg-gradient-to-b from-border to-transparent" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <h4 className="font-semibold text-foreground">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                <div className="mt-3 flex flex-col gap-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 rounded-md px-2 py-1 w-fit">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="font-medium">Pass: {step.pass}</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-500 bg-red-500/10 rounded-md px-2 py-1 w-fit">
                    <XCircle className="h-3 w-3" />
                    <span className="font-medium">Fail: {step.fail}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
