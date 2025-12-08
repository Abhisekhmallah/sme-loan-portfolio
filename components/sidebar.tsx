"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  BarChart3,
  Calculator,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: FileText, label: "Applications", id: "applications" },
  { icon: CheckSquare, label: "Checklist", id: "checklist" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Calculator, label: "Eligibility", id: "eligibility" },
  { icon: Settings, label: "Settings", id: "settings" },
]

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-md hover:bg-sidebar-accent hover:scale-110 transition-transform"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <nav className="flex-1 space-y-1 p-3 pt-8">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200",
              collapsed && "justify-center px-2",
              activeTab === item.id &&
                "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground shadow-sm",
            )}
            onClick={() => onTabChange(item.id)}
          >
            <item.icon className={cn("h-5 w-5 shrink-0", activeTab === item.id && "animate-pulse")} />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </Button>
        ))}
      </nav>

      {!collapsed && (
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-gradient-to-br from-sidebar-primary/20 to-sidebar-primary/5 p-3 border border-sidebar-primary/20">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-sidebar-primary" />
              <p className="text-xs font-semibold text-sidebar-primary">Right-First-Time</p>
            </div>
            <p className="mt-1 text-xs text-sidebar-foreground/70">Advantage Assam 2.0 Initiative</p>
          </div>
        </div>
      )}
    </aside>
  )
}
