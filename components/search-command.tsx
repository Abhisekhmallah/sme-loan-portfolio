"use client"

import { useState, useEffect } from "react"
import { Search, FileText, BarChart3, CheckSquare, Calculator, Settings, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { applications } from "@/lib/data"

interface SearchCommandProps {
  onNavigate: (tab: string) => void
}

export function SearchCommand({ onNavigate }: SearchCommandProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const recentApps = applications.slice(0, 5)

  const pages = [
    { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
    { name: "Applications", icon: FileText, id: "applications" },
    { name: "Document Checklist", icon: CheckSquare, id: "checklist" },
    { name: "Analytics", icon: BarChart3, id: "analytics" },
    { name: "Eligibility Calculator", icon: Calculator, id: "eligibility" },
    { name: "Settings", icon: Settings, id: "settings" },
  ]

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-64 bg-transparent"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search applications...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {pages.map((page) => (
              <CommandItem
                key={page.id}
                onSelect={() => {
                  onNavigate(page.id)
                  setOpen(false)
                }}
              >
                <page.icon className="mr-2 h-4 w-4" />
                {page.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Recent Applications">
            {recentApps.map((app) => (
              <CommandItem
                key={app.applicantId}
                onSelect={() => {
                  onNavigate("applications")
                  setOpen(false)
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>{app.applicantId}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {app.industry} • ₹{(app.loanAmount / 100000).toFixed(1)}L
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
