import { NextResponse } from "next/server"
import { applications, getApplicationStatus } from "@/lib/data"

export async function GET() {
  // Calculate analytics
  const totalApplications = applications.length

  const statusCounts = applications.reduce(
    (acc, app) => {
      const status = getApplicationStatus(app)
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const industryCounts = applications.reduce(
    (acc, app) => {
      acc[app.industry] = (acc[app.industry] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const categoryCounts = applications.reduce(
    (acc, app) => {
      acc[app.category] = (acc[app.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const documentCompliance = {
    kyc: applications.filter((app) => app.kycSubmitted).length,
    income: applications.filter((app) => app.incomeDocSubmitted).length,
    business: applications.filter((app) => app.businessProofSubmitted).length,
  }

  const totalLoanAmount = applications.reduce((sum, app) => sum + app.loanAmount, 0)
  const avgLoanAmount = totalLoanAmount / totalApplications

  const approvalRate =
    ((statusCounts["Ready for Appraisal"] || 0) + (statusCounts["Conditional Approval"] || 0)) / totalApplications

  return NextResponse.json({
    totalApplications,
    statusCounts,
    industryCounts,
    categoryCounts,
    documentCompliance,
    totalLoanAmount,
    avgLoanAmount,
    approvalRate: Math.round(approvalRate * 100),
    kycComplianceRate: Math.round((documentCompliance.kyc / totalApplications) * 100),
    incomeComplianceRate: Math.round((documentCompliance.income / totalApplications) * 100),
    businessComplianceRate: Math.round((documentCompliance.business / totalApplications) * 100),
  })
}
