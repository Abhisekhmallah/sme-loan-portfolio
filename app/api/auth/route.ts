import { NextResponse } from "next/server"

// This simulates auth endpoints - in production, use proper auth like NextAuth or Supabase
export async function POST(request: Request) {
  const body = await request.json()
  const { action, email, password, name, department } = body

  // Demo users
  const demoUsers: Record<string, { password: string; name: string; role: string; department: string }> = {
    "admin@hdfc.com": { password: "admin123", name: "Priya Sharma", role: "admin", department: "SME Loans" },
    "analyst@hdfc.com": {
      password: "analyst123",
      name: "Rahul Verma",
      role: "analyst",
      department: "Credit Analysis",
    },
    "demo@hdfc.com": { password: "demo123", name: "Demo User", role: "viewer", department: "Operations" },
  }

  if (action === "login") {
    const user = demoUsers[email?.toLowerCase()]
    if (user && user.password === password) {
      return NextResponse.json({
        success: true,
        user: {
          id: `usr_${Date.now()}`,
          email: email.toLowerCase(),
          name: user.name,
          role: user.role,
          department: user.department,
        },
      })
    }
    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
  }

  if (action === "signup") {
    if (demoUsers[email?.toLowerCase()]) {
      return NextResponse.json({ success: false, error: "Email already exists" }, { status: 400 })
    }
    return NextResponse.json({
      success: true,
      user: {
        id: `usr_${Date.now()}`,
        email: email.toLowerCase(),
        name,
        role: "viewer",
        department: department || "Operations",
      },
    })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
