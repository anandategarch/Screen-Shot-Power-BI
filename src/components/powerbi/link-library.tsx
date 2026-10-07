'use client'

import { useMemo, useState } from 'react'
import { Library, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { LinkCard } from './link-card'
import { useLinks } from '@/hooks/use-powerbi'
import type { PowerBILink } from '@/types/powerbi'

type Props = {
  onAdd: () => void
  onEdit: (link: PowerBILink) => void
}

export function LinkLibrary({ onAdd, onEdit }: Props) {
  const { data: links, isLoading } = useLinks()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!links) return []
    const q = query.trim().toLowerCase()
    if (!q) return links
    return links.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.url.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        (l.description ?? '').toLowerCase().includes(q)
    )
  }, [links, query])

  return (
    <aside className="flex h-full min-h-0 flex-col rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Library className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Link Library</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {links?.length ?? 0}
          </span>
        </div>
        <Button size="sm" className="h-7 gap-1 px-2.5 text-xs" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" /> Add
        </Button>
      </div>

      <div className="border-b px-3 py-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search links…"
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-2 p-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <Library className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium">No links found</p>
              <p className="text-xs text-muted-foreground">
                {query ? 'Try a different search.' : 'Add your first Power BI link to get started.'}
              </p>
            </div>
          ) : (
            filtered.map((link) => <LinkCard key={link.id} link={link} onEdit={onEdit} />)
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}
