import { NextResponse } from "next/server"
import { applications, getApplicationStatus, type Application } from "@/lib/data"

// GET all applications with filtering
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const industry = searchParams.get("industry")
  const category = searchParams.get("category")
  const status = searchParams.get("status")
  const search = searchParams.get("search")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  let filtered = [...applications]

  if (industry && industry !== "all") {
    filtered = filtered.filter((app) => app.industry === industry)
  }

  if (category && category !== "all") {
    filtered = filtered.filter((app) => app.category === category)
  }

  if (status && status !== "all") {
    filtered = filtered.filter((app) => getApplicationStatus(app) === status)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(
      (app) => app.applicantId.toLowerCase().includes(searchLower) || app.industry.toLowerCase().includes(searchLower),
    )
  }

  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const paginatedData = filtered.slice(offset, offset + limit)

  // Add computed status to each application
  const withStatus = paginatedData.map((app) => ({
    ...app,
    status: getApplicationStatus(app),
  }))

  return NextResponse.json({
    data: withStatus,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  })
}

// POST new application
export async function POST(request: Request) {
  const body = await request.json()

  const newApp: Application = {
    sNo: applications.length + 1,
    applicantId: `SME${body.industry.slice(0, 4)}${applications.length + 1}`,
    industry: body.industry,
    loanAmount: body.loanAmount,
    loanCategory: "SME",
    category: body.loanAmount <= 1000000 ? "Small" : body.loanAmount <= 5000000 ? "Medium" : "Large",
    incomeDocSubmitted: body.incomeDocSubmitted || false,
    kycSubmitted: body.kycSubmitted || false,
    businessProofSubmitted: body.businessProofSubmitted || false,
  }

  // In a real app, this would save to database
  // applications.push(newApp)

  return NextResponse.json({
    success: true,
    data: { ...newApp, status: getApplicationStatus(newApp) },
  })
}
