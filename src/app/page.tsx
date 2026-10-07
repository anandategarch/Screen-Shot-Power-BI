'use client'

import { useMemo, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { AppHeader } from '@/components/powerbi/app-header'
import { LinkLibrary } from '@/components/powerbi/link-library'
import { ReportViewer } from '@/components/powerbi/report-viewer'
import { ActivityLogPanel } from '@/components/powerbi/activity-log'
import { LinkFormDialog } from '@/components/powerbi/link-form-dialog'
import { useLinks } from '@/hooks/use-powerbi'
import type { PowerBILink } from '@/types/powerbi'

export default function Home() {
  const { data: links } = useLinks()
  const [addOpen, setAddOpen] = useState(false)
  const [editing, setEditing] = useState<PowerBILink | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const categories = useMemo(
    () => Array.from(new Set((links ?? []).map((l) => l.category))).sort(),
    [links]
  )

  function openEdit(link: PowerBILink) {
    setEditing(link)
    setEditOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <AppHeader onAdd={() => setAddOpen(true)} count={links?.length ?? 0} />

      <main className="flex-1">
        <div className="mx-auto max-w-[1400px] px-4 py-4 lg:py-6">
          <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-4">
            {/* Sidebar (library) */}
            <div className="lg:h-[calc(100vh-8.5rem)] lg:min-h-[28rem]">
              <LinkLibrary onAdd={() => setAddOpen(true)} onEdit={openEdit} />
            </div>

            {/* Main column: report viewer + activity log */}
            <div className="flex min-h-0 flex-col gap-4 lg:h-[calc(100vh-8.5rem)] lg:min-h-[28rem]">
              <div className="min-h-0 flex-1">
                <ReportViewer onEdit={openEdit} />
              </div>
              <ActivityLogPanel />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t bg-background">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>
              Power BI Link Manager · manage &amp; embed your Power BI reports from one place.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>Built with Next.js · Tailwind · shadcn/ui</span>
            <span className="hidden h-3 w-px bg-border sm:block" />
            <span>{links?.length ?? 0} links in library</span>
          </div>
        </div>
      </footer>

      {/* Add dialog */}
      <LinkFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        knownCategories={categories}
      />

      {/* Edit dialog */}
      <LinkFormDialog
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o)
          if (!o) setEditing(null)
        }}
        editing={editing}
        knownCategories={categories}
      />
    </div>
  )
}
