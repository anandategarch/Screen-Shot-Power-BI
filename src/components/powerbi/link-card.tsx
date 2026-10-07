'use client'

import { useState } from 'react'
import { Check, ExternalLink, Pencil, Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { categoryStyle, formatRelative, truncateUrl } from '@/lib/format'
import { useActivateLink, useDeleteLink } from '@/hooks/use-powerbi'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { PowerBILink } from '@/types/powerbi'

type Props = {
  link: PowerBILink
  onEdit: (link: PowerBILink) => void
}

export function LinkCard({ link, onEdit }: Props) {
  const activate = useActivateLink()
  const del = useDeleteLink()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const cat = categoryStyle(link.category)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => activate.mutate(link.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          activate.mutate(link.id)
        }
      }}
      className={[
        'group relative w-full rounded-lg border bg-card p-3 text-left transition-all',
        'hover:border-foreground/30 hover:shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        link.isActive
          ? 'border-emerald-500/60 bg-emerald-50/60 ring-1 ring-emerald-500/40 dark:bg-emerald-950/30'
          : 'border-border',
      ].join(' ')}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold leading-tight">{link.title}</p>
            {link.isActive && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                <Star className="h-2.5 w-2.5 fill-current" /> Active
              </span>
            )}
          </div>
          <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground" title={link.url}>
            {truncateUrl(link.url, 38)}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{ backgroundColor: cat.bg, color: cat.fg, border: `1px solid ${cat.border}` }}
            >
              {link.category}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {link.viewCount} view{link.viewCount === 1 ? '' : 's'} · {formatRelative(link.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-1">
          {!link.isActive ? (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-muted-foreground hover:text-emerald-600"
              onClick={(e) => {
                e.stopPropagation()
                activate.mutate(link.id)
              }}
              aria-label="Set as active report"
              title="Set as active report"
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <span className="flex h-7 w-7 items-center justify-center text-emerald-600">
              <Star className="h-4 w-4 fill-current" />
            </span>
          )}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between border-t pt-2 opacity-0 transition-opacity group-hover:opacity-100">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
        >
          <ExternalLink className="h-3 w-3" /> Open
        </a>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-[11px]"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(link)
            }}
          >
            <Pencil className="h-3 w-3" /> Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-[11px] text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              setConfirmOpen(true)
            }}
          >
            <Trash2 className="h-3 w-3" /> Delete
          </Button>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this link?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong className="font-medium text-foreground">{link.title}</strong> from your library. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => del.mutate(link.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
