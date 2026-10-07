'use client'

import { BarChart3, Github, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'

type Props = {
  onAdd: () => void
  count: number
}

export function AppHeader({ onAdd, count }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold leading-tight sm:text-base">
              Power BI Link Manager
            </h1>
            <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
              Manage embedded Power BI report links · {count} saved
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden h-9 gap-1.5 sm:inline-flex">
            <a
              href="https://github.com/anandategarch/Screen-Shot-Power-BI"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" /> Repository
            </a>
          </Button>
          <ThemeToggle />
          <Button size="sm" className="h-9 gap-1.5" onClick={onAdd}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Link</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
