"use client"

import { useState, useEffect } from "react"
import { Building2, Moon, Sun, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { SearchCommand } from "@/components/search-command"
import { useAuth } from "@/lib/auth-context"

interface HeaderProps {
  onNavigate?: (tab: string) => void
}

export function Header({ onNavigate }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
              <Building2 className="h-6 w-6 text-primary-foreground" />
              <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent">
                <Sparkles className="h-2.5 w-2.5 text-accent-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">HDFC Bank</h1>
              <p className="text-xs font-medium text-muted-foreground">SME Pre-Screen Portal</p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <SearchCommand onNavigate={onNavigate || (() => {})} />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative overflow-hidden rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted ? (
              <>
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
              </>
            ) : (
              <div className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <NotificationsDropdown onNavigate={onNavigate} />

          {user && <ProfileDropdown onNavigate={onNavigate} />}
        </div>
      </div>
    </header>
  )
}
