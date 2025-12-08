"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { StatsCards } from "@/components/stats-cards"
import { StatusDistributionChart } from "@/components/charts/status-distribution-chart"
import { IndustryChart } from "@/components/charts/industry-chart"
import { DocumentComplianceChart } from "@/components/charts/document-compliance-chart"
import { LoanAmountChart } from "@/components/charts/loan-amount-chart"
import { CategoryChart } from "@/components/charts/category-chart"
import { WorkflowStatus } from "@/components/workflow-status"
import { RecentApplications } from "@/components/recent-applications"
import { ApplicationsTable } from "@/components/applications-table"
import { DocumentChecklist } from "@/components/document-checklist"
import { EligibilityCalculator } from "@/components/eligibility-calculator"
import { AnalyticsView } from "@/components/analytics-view"
import { SettingsPage } from "@/components/settings-page"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onNavigate={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "dashboard" && <DashboardView onNavigate={setActiveTab} />}
          {activeTab === "applications" && <ApplicationsTable />}
          {activeTab === "checklist" && <DocumentChecklist />}
          {activeTab === "analytics" && <AnalyticsView />}
          {activeTab === "eligibility" && <EligibilityCalculator />}
          {activeTab === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  )
}

function DashboardView({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Pre-Screening Dashboard</h2>
        <p className="text-muted-foreground">Right-First-Time SME Applications • Advantage Assam 2.0</p>
      </div>

      <StatsCards onNavigate={onNavigate} />

      <div className="grid gap-6 lg:grid-cols-2">
        <StatusDistributionChart />
        <IndustryChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DocumentComplianceChart />
        <LoanAmountChart />
        <CategoryChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentApplications onNavigate={onNavigate} />
        <WorkflowStatus />
      </div>
    </div>
  )
}
