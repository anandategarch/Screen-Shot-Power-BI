'use client'

import { useMemo } from 'react'
import {
  Activity,
  CheckCircle2,
  Eraser,
  FilePlus2,
  FileEdit,
  Pencil,
  Rocket,
  Star,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { formatTime, formatRelative, formatDate } from '@/lib/format'
import { useClearLogs, useLogs } from '@/hooks/use-powerbi'
import type { ActivityLog } from '@/types/powerbi'

type ActionMeta = {
  label: string
  Icon: React.ComponentType<{ className?: string }>
  color: string
  bg: string
}

const ACTION_META: Record<string, ActionMeta> = {
  create: { label: 'Created', Icon: FilePlus2, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  update: { label: 'Updated', Icon: FileEdit, color: 'text-amber-600', bg: 'bg-amber-500/10' },
  delete: { label: 'Deleted', Icon: Trash2, color: 'text-rose-600', bg: 'bg-rose-500/10' },
  activate: { label: 'Switched', Icon: Star, color: 'text-violet-600', bg: 'bg-violet-500/10' },
  seed: { label: 'Seeded', Icon: Rocket, color: 'text-sky-600', bg: 'bg-sky-500/10' },
  clear: { label: 'Cleared', Icon: Eraser, color: 'text-muted-foreground', bg: 'bg-muted' },
  view: { label: 'Viewed', Icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  edit: { label: 'Edited', Icon: Pencil, color: 'text-amber-600', bg: 'bg-amber-500/10' },
}

function meta(action: string): ActionMeta {
  return ACTION_META[action] ?? { label: action, Icon: Activity, color: 'text-muted-foreground', bg: 'bg-muted' }
}

function LogRow({ log }: { log: ActivityLog }) {
  const m = meta(log.action)
  return (
    <div className="flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-muted/40">
      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${m.bg}`}>
        <m.Icon className={`h-3.5 w-3.5 ${m.color}`} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium leading-tight">
            {m.label}
            {log.targetTitle && <span className="text-muted-foreground"> · {log.targetTitle}</span>}
          </p>
          <time className="shrink-0 font-mono text-[10px] text-muted-foreground" title={formatDate(log.createdAt)}>
            {formatTime(log.createdAt)}
          </time>
        </div>
        {log.details && (
          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{log.details}</p>
        )}
      </div>
    </div>
  )
}

export function ActivityLogPanel() {
  const { data: logs, isLoading } = useLogs()
  const clear = useClearLogs()

  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayCount = (logs ?? []).filter((l) => new Date(l.createdAt) >= today).length
    return {
      total: logs?.length ?? 0,
      today: todayCount,
      last: logs?.[0],
    }
  }, [logs])

  return (
    <section className="flex min-h-0 flex-col rounded-xl border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Activity Log</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {stats.total}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 text-[11px] text-muted-foreground sm:flex">
            <span><strong className="text-foreground">{stats.today}</strong> today</span>
            <span className="h-3 w-px bg-border" />
            <span>Last: {stats.last ? formatRelative(stats.last.createdAt) : '—'}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 px-2.5 text-xs"
            onClick={() => clear.mutate()}
            disabled={clear.isPending || !stats.total}
          >
            <Eraser className="h-3.5 w-3.5" /> Clear
          </Button>
        </div>
      </div>

      <ScrollArea className="max-h-80 min-h-0 flex-1">
        <div className="divide-y">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-2.5 w-2/3" />
                </div>
              </div>
            ))
          ) : (logs ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <Activity className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium">No activity yet</p>
              <p className="text-xs text-muted-foreground">
                Actions you perform — add, edit, switch, delete — will appear here in real time.
              </p>
            </div>
          ) : (
            (logs ?? []).map((log) => <LogRow key={log.id} log={log} />)
          )}
        </div>
      </ScrollArea>
    </section>
  )
}
