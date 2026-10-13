// ───────────────────────────────────────────────────────────────────────────
// Power BI "Tipe" filter configuration
// ───────────────────────────────────────────────────────────────────────────
// The embedded Power BI report ("Laporan Deviasi" — PT Pesta Pora Abadi / ME
// GACOAN) ships with a "Tipe" slicer on its data pages. These are the exact
// values discovered by inspecting the live report:
//
//   • COM DEVIASI        (default selection in the report)
//   • CONSUME
//   • PACKAGING DEVIASI
//   • PACKAGING USAGE
//
// The filter is pushed to the embedded report through Power BI's URL query
// string parameter:
//
//     ?filter=Table/Field eq 'VALUE'
//
// `field` below is the model field reference in "Table/Field" form. It defaults
// to "Tipe/Tipe" (the most common convention for this kind of dashboard). If
// the filter does not seem to apply, the user can change it at runtime via the
// gear icon on the filter bar — the value is persisted in localStorage.
// ───────────────────────────────────────────────────────────────────────────

export type TipeOption = {
  /** Exact value as it appears in the Power BI model / slicer. */
  value: string
  /** Short, friendly label shown in the UI. */
  label: string
  /** Tailwind-friendly HSL accent for the chip. */
  accent: { bg: string; fg: string; border: string; dot: string }
}

export const TIPE_OPTIONS: TipeOption[] = [
  {
    value: 'COM DEVIASI',
    label: 'COM Deviasi',
    accent: { bg: 'hsl(150 60% 94%)', fg: 'hsl(150 70% 26%)', border: 'hsl(150 50% 70%)', dot: 'hsl(150 70% 40%)' },
  },
  {
    value: 'CONSUME',
    label: 'Consume',
    accent: { bg: 'hsl(38 95% 95%)', fg: 'hsl(32 80% 32%)', border: 'hsl(38 80% 70%)', dot: 'hsl(32 80% 48%)' },
  },
  {
    value: 'PACKAGING DEVIASI',
    label: 'Packaging Deviasi',
    accent: { bg: 'hsl(280 50% 96%)', fg: 'hsl(280 45% 38%)', border: 'hsl(280 45% 72%)', dot: 'hsl(280 45% 52%)' },
  },
  {
    value: 'PACKAGING USAGE',
    label: 'Packaging Usage',
    accent: { bg: 'hsl(190 60% 93%)', fg: 'hsl(190 70% 30%)', border: 'hsl(190 60% 65%)', dot: 'hsl(190 70% 42%)' },
  },
]

/** localStorage keys for persisting the user's filter choices. */
export const TIPE_STORAGE_KEYS = {
  selected: 'powerbi.tipe.selected',
  field: 'powerbi.tipe.field',
} as const

/** Default model field reference if the user hasn't overridden it. */
export const DEFAULT_TIPE_FIELD = 'Tipe/Tipe'

/**
 * Escape a value for use inside a Power BI URL filter expression.
 * Single quotes are doubled, per the Power BI filter syntax.
 */
function escapeFilterValue(v: string): string {
  return v.replace(/'/g, "''")
}

/**
 * Build a Power BI report URL with the Tipe filter applied via the `filter`
 * query string parameter. When `tipe` is null/empty the base URL is returned
 * untouched (i.e. "Semua" / All).
 */
export function buildFilteredUrl(baseUrl: string, tipe: string | null, field: string): string {
  const clean = (tipe ?? '').trim()
  if (!clean || !field.trim()) return baseUrl
  const expr = `${field.trim()} eq '${escapeFilterValue(clean)}'`
  const sep = baseUrl.includes('?') ? '&' : '?'
  return `${baseUrl}${sep}filter=${encodeURIComponent(expr)}`
}

/** Read the persisted Tipe selection (or null for "All"). */
export function readTipeSelection(): string | null {
  if (typeof window === 'undefined') return null
  const v = window.localStorage.getItem(TIPE_STORAGE_KEYS.selected)
  return v && v.length ? v : null
}

/** Persist the Tipe selection (pass null for "All"). */
export function writeTipeSelection(tipe: string | null): void {
  if (typeof window === 'undefined') return
  if (tipe) window.localStorage.setItem(TIPE_STORAGE_KEYS.selected, tipe)
  else window.localStorage.removeItem(TIPE_STORAGE_KEYS.selected)
}

/** Read the persisted model field reference, falling back to the default. */
export function readTipeField(): string {
  if (typeof window === 'undefined') return DEFAULT_TIPE_FIELD
  return window.localStorage.getItem(TIPE_STORAGE_KEYS.field) || DEFAULT_TIPE_FIELD
}

/** Persist the model field reference. */
export function writeTipeField(field: string): void {
  if (typeof window === 'undefined') return
  const v = field.trim()
  if (v) window.localStorage.setItem(TIPE_STORAGE_KEYS.field, v)
  else window.localStorage.removeItem(TIPE_STORAGE_KEYS.field)
}
