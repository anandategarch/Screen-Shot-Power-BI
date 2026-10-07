'use client'

import { useState } from 'react'
import { Plus, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateLink, useUpdateLink } from '@/hooks/use-powerbi'
import type { LinkInput, PowerBILink } from '@/types/powerbi'

type Props = {
  trigger?: React.ReactNode
  editing?: PowerBILink | null
  knownCategories?: string[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const SUGGESTED = ['Default', 'Sales', 'Finance', 'Operations', 'HR', 'Inventory', 'Custom']

// Rendered inside DialogContent. Because Radix unmounts content when the
// dialog closes, this component remounts fresh every time the dialog opens,
// so initial state derived from `editing` is always correct — no effect needed.
function LinkFormFields({
  editing,
  knownCategories,
  onClose,
}: {
  editing: PowerBILink | null
  knownCategories: string[]
  onClose: () => void
}) {
  const createMut = useCreateLink()
  const updateMut = useUpdateLink()

  const [title, setTitle] = useState(editing?.title ?? '')
  const [url, setUrl] = useState(editing?.url ?? '')
  const [category, setCategory] = useState(editing?.category ?? 'General')
  const [description, setDescription] = useState(editing?.description ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = Array.from(new Set([...SUGGESTED, ...knownCategories]))

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!title.trim()) next.title = 'Title is required'
    if (!url.trim()) next.url = 'Power BI URL is required'
    else {
      try {
        new URL(url.trim())
      } catch {
        next.url = 'Enter a valid URL (must start with https://)'
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const payload: LinkInput = {
      title: title.trim(),
      url: url.trim(),
      category: category.trim() || 'General',
      description: description.trim() || null,
    }
    if (editing) {
      await updateMut.mutateAsync({ id: editing.id, input: payload })
    } else {
      await createMut.mutateAsync(payload)
    }
    onClose()
  }

  const pending = createMut.isPending || updateMut.isPending

  return (
    <form onSubmit={onSubmit} className="grid gap-4 py-2">
      <div className="grid gap-2">
        <Label htmlFor="pbi-title">Report title</Label>
        <Input
          id="pbi-title"
          placeholder="e.g. Quarterly Sales Dashboard"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="pbi-url">Power BI embed URL</Label>
        <Textarea
          id="pbi-url"
          placeholder="https://app.powerbi.com/view?r=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="resize-none font-mono text-xs"
          rows={3}
        />
        {errors.url && <p className="text-xs text-destructive">{errors.url}</p>}
        <p className="text-xs text-muted-foreground">
          Paste the full Power BI &quot;publish to web&quot; link.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="pbi-category">Category</Label>
        <Input
          id="pbi-category"
          list="pbi-categories"
          placeholder="General"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <datalist id="pbi-categories">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="pbi-desc">Description (optional)</Label>
        <Textarea
          id="pbi-desc"
          placeholder="Short note about this report…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : editing ? (
            <Save className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {editing ? 'Save changes' : 'Add link'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function LinkFormDialog({ trigger, editing = null, knownCategories = [], open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editing ? 'Edit Power BI Link' : 'Add Power BI Link'}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? 'Update the details of this embedded report link.'
              : 'Save a new Power BI report link to your library.'}
          </DialogDescription>
        </DialogHeader>

        <LinkFormFields
          editing={editing}
          knownCategories={knownCategories}
          onClose={() => onOpenChange?.(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
