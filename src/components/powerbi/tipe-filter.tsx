'use client'

import { useCallback, useState, useSyncExternalStore } from 'react'
import { Filter, RotateCcw, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  TIPE_OPTIONS,
  DEFAULT_TIPE_FIELD,
  TIPE_STORAGE_KEYS,
  type TipeOption,
} from '@/lib/powerbi-config'

type Props = {
  /** Current selected Tipe value (null = Semua / All). */
  value: string | null
  /** Called when the user picks a Tipe (null = Semua). */
  onChange: (tipe: string | null) => void
  /** Current model field reference (e.g. "Tipe/Tipe"). */
  field: string
  /** Called when the user edits the field reference. */
  onFieldChange: (field: string) => void
  /** Whether a report is currently active (disables the bar when false). */
  disabled?: boolean
}

export function TipeFilter({ value, onChange, field, onFieldChange, disabled }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [draftField, setDraftField] = useState(field)

  // Sync the settings input from the prop when the popover opens (event handler,
  // not an effect, so it stays lint-clean).
  function handleOpenChange(open: boolean) {
    if (open) setDraftField(field)
    setSettingsOpen(open)
  }

  function handlePick(tipe: string | null) {
    onChange(tipe)
  }

  function handleSaveField() {
    const next = draftField.trim() || DEFAULT_TIPE_FIELD
    onFieldChange(next)
    setSettingsOpen(false)
  }

  function handleResetField() {
    setDraftField(DEFAULT_TIPE_FIELD)
  }

  return (
    <div
      className={[
        'rounded-xl border bg-card transition-opacity',
        disabled ? 'pointer-events-none opacity-50' : 'opacity-100',
      ].join(' ')}
    >
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
        {/* Label + chips */}
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
              <Filter className="h-3.5 w-3.5" />
            </div>
            <div className="leading-tight">
              <p className="text-xs font-semibold">Filter Tipe</p>
              <p className="hidden text-[10px] text-muted-foreground sm:block">
                Pilih tipe laporan di awal
              </p>
            </div>
          </div>

          <div
            role="group"
            aria-label="Tipe filter"
            className="flex flex-wrap items-center gap-1.5"
          >
            {/* Semua / All chip */}
            <TipeChip
              active={value === null}
              onClick={() => handlePick(null)}
              label="Semua"
            />

            {TIPE_OPTIONS.map((opt) => (
              <TipeChip
                key={opt.value}
                active={value === opt.value}
                onClick={() => handlePick(opt.value)}
                label={opt.label}
                accent={value === opt.value ? opt.accent : undefined}
                dot={opt.accent.dot}
              />
            ))}
          </div>
        </div>

        {/* Active state + settings */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground md:flex">
            <span className="text-muted-foreground/70">Aktif:</span>
            <span className="text-foreground">
              {value ?? 'Semua'}
            </span>
          </div>

          <Popover open={settingsOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 px-2.5 text-xs"
                title="Pengaturan field filter"
              >
                <Settings2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Field</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold">Field Filter Tipe</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Referensi field model Power BI dalam format{' '}
                    <code className="rounded bg-muted px-1 py-0.5 text-[10px]">
                      Table/Field
                    </code>
                    . Ubah jika filter tidak diterapkan pada laporan.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tipe-field" className="text-xs">
                    Table / Field
                  </Label>
                  <Input
                    id="tipe-field"
                    value={draftField}
                    onChange={(e) => setDraftField(e.target.value)}
                    placeholder={DEFAULT_TIPE_FIELD}
                    className="h-8 font-mono text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveField()
                    }}
                  />
                </div>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 text-xs"
                    onClick={handleResetField}
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </Button>
                  <Button size="sm" className="h-7 text-xs" onClick={handleSaveField}>
                    Simpan
                  </Button>
                </div>
                <p className="border-t pt-2 text-[10px] leading-relaxed text-muted-foreground">
                  Tip: nilai default <code className="font-mono">Tipe/Tipe</code>{' '}
                  cocok untuk sebagian besar model. Cek nama tabel &amp; kolom
                  di Power BI Desktop jika filter tidak bereaksi.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}

function TipeChip({
  active,
  onClick,
  label,
  accent,
  dot,
}: {
  active: boolean
  onClick: () => void
  label: string
  accent?: TipeOption['accent']
  dot?: string
}) {
  const style = active && accent
    ? { backgroundColor: accent.bg, color: accent.fg, borderColor: accent.border }
    : undefined

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={style}
      className={[
        'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors',
        active
          ? accent
            ? 'border-transparent shadow-sm'
            : 'border-foreground bg-foreground text-background shadow-sm'
          : 'border-border bg-background text-muted-foreground hover:border-foreground/40 hover:bg-muted hover:text-foreground',
      ].join(' ')}
    >
      {dot && (
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: active ? (accent?.dot ?? dot) : dot }}
        />
      )}
      {label}
    </button>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// localStorage-backed state via useSyncExternalStore
// ───────────────────────────────────────────────────────────────────────────
// This keeps the Tipe selection + field reference in sync with localStorage
// without triggering the "setState in effect" lint rule, and stays
// hydration-safe (server returns defaults, client returns the real value).
// ───────────────────────────────────────────────────────────────────────────

const STORAGE_EVENT = 'powerbi:local-storage-change'

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener(STORAGE_EVENT, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(STORAGE_EVENT, callback)
  }
}

/** True once mounted on the client (false during SSR). */
function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

/**
 * Wires the Tipe filter state to localStorage. Returns `hydrated` which is
 * false during SSR and true on the client — use it to gate UI that depends on
 * the persisted value to avoid hydration mismatches.
 */
export function useTipeFilter() {
  const mounted = useMounted()

  const tipe = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(TIPE_STORAGE_KEYS.selected),
    () => null,
  )

  const rawField = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(TIPE_STORAGE_KEYS.field) || DEFAULT_TIPE_FIELD,
    () => DEFAULT_TIPE_FIELD,
  )
  const field = rawField || DEFAULT_TIPE_FIELD

  const setTipe = useCallback((v: string | null) => {
    if (v) window.localStorage.setItem(TIPE_STORAGE_KEYS.selected, v)
    else window.localStorage.removeItem(TIPE_STORAGE_KEYS.selected)
    window.dispatchEvent(new Event(STORAGE_EVENT))
  }, [])

  const setField = useCallback((v: string) => {
    const clean = v.trim()
    if (clean) window.localStorage.setItem(TIPE_STORAGE_KEYS.field, clean)
    else window.localStorage.removeItem(TIPE_STORAGE_KEYS.field)
    window.dispatchEvent(new Event(STORAGE_EVENT))
  }, [])

  return { tipe, setTipe, field, setField, hydrated: mounted }
}
