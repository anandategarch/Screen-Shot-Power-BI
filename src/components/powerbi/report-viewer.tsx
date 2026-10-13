'use client'

import { useMemo, useState } from 'react'
import {
  ExternalLink,
  Eye,
  Loader2,
  Maximize2,
  Pencil,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { categoryStyle, formatDate } from '@/lib/format'
import { buildFilteredUrl } from '@/lib/powerbi-config'
import { useLinks } from '@/hooks/use-powerbi'
import type { PowerBILink } from '@/types/powerbi'
import { TipeFilter, useTipeFilter } from './tipe-filter'

type Props = {
  onEdit: (link: PowerBILink) => void
}

function ReportFrame({ url, title }: { url: string; title: string }) {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-card">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">Loading Power BI report…</p>
          <p className="max-w-md text-center text-xs text-muted-foreground">
            The embedded report is being fetched from Power BI service. This can take a few seconds.
          </p>
        </div>
      )}
      <iframe
        src={url}
        title={title}
        className="h-full w-full"
        onLoad={() => setLoading(false)}
        allowFullScreen
        style={{ border: 'none', minHeight: '60vh' }}
      />
    </>
  )
}

export function ReportViewer({ onEdit }: Props) {
  const { data: links, isLoading, isFetching, refetch } = useLinks()
  const active = (links ?? []).find((l) => l.isActive) ?? null
  const cat = active ? categoryStyle(active.category) : null

  // "Tipe" filter state, persisted to localStorage.
  const { tipe, setTipe, field, setField, hydrated } = useTipeFilter()

  // Build the iframe URL with the Tipe filter applied (if any).
  const filteredUrl = useMemo(() => {
    if (!active) return null
    return buildFilteredUrl(active.url, tipe, field)
  }, [active, tipe, field])

  // A stable key so the iframe reloads when the filter (or active link) changes.
  const frameKey = active ? `${active.id}:${tipe ?? 'all'}:${field}` : 'none'

  return (
    <div className="flex min-h-0 flex-col gap-3">
      {/* ── Filter Tipe (at the beginning, above the report) ─────────────── */}
      {hydrated && (
        <TipeFilter
          value={tipe}
          onChange={setTipe}
          field={field}
          onFieldChange={setField}
          disabled={!active}
        />
      )}

      <section className="flex min-h-0 flex-col rounded-xl border bg-card">
        {/* Info bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <div className="min-w-0">
            {active ? (
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-base font-semibold">{active.title}</h1>
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{ backgroundColor: cat!.bg, color: cat!.fg, border: `1px solid ${cat!.border}` }}
                >
                  {active.category}
                </span>
                {tipe && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-medium text-background">
                    Tipe: {tipe}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Eye className="h-3 w-3" /> {active.viewCount} view{active.viewCount === 1 ? '' : 's'}
                </span>
              </div>
            ) : isLoading ? (
              <Skeleton className="h-5 w-48" />
            ) : (
              <h1 className="text-base font-semibold text-muted-foreground">No active report</h1>
            )}
            {active && (
              <p className="mt-0.5 hidden truncate font-mono text-[11px] text-muted-foreground sm:block" title={active.url}>
                {filteredUrl ?? active.url}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Reload links"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              Reload
            </Button>
            {active && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() => onEdit(active)}
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button asChild size="sm" className="h-8 gap-1.5 text-xs">
                  <a href={filteredUrl ?? active.url} target="_blank" rel="noopener noreferrer">
                    <Maximize2 className="h-3.5 w-3.5" /> Open
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Embedded report */}
        <div className="relative min-h-0 flex-1 bg-muted/30">
          {active && filteredUrl ? (
            <ReportFrame key={frameKey} url={filteredUrl} title={active.title} />
          ) : (
            <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Eye className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No report selected</p>
              <p className="max-w-sm text-xs text-muted-foreground">
                Pick a link from the library on the left, or add a new Power BI link to embed it here.
              </p>
            </div>
          )}
        </div>

        {/* Meta footer */}
        {active && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2 text-[11px] text-muted-foreground">
            <span>
              Added {formatDate(active.createdAt)} · Last updated {formatDate(active.updatedAt)}
            </span>
            {active.description && (
              <span className="max-w-[60%] truncate" title={active.description}>
                {active.description}
              </span>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
