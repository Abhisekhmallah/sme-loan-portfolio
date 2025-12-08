import { NextResponse } from "next/server"
import { applications, getApplicationStatus } from "@/lib/data"

// GET single application
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const app = applications.find((a) => a.applicantId === id)

  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  return NextResponse.json({
    ...app,
    status: getApplicationStatus(app),
  })
}

// PATCH update application
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const appIndex = applications.findIndex((a) => a.applicantId === id)

  if (appIndex === -1) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  // In a real app, this would update the database
  const updatedApp = { ...applications[appIndex], ...body }

  return NextResponse.json({
    success: true,
    data: { ...updatedApp, status: getApplicationStatus(updatedApp) },
  })
}

// DELETE application
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const appIndex = applications.findIndex((a) => a.applicantId === id)

  if (appIndex === -1) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  // In a real app, this would delete from database
  return NextResponse.json({ success: true, message: "Application deleted" })
}
