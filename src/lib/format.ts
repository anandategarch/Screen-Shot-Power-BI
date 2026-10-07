// Deterministic accent color per category, so each category is visually distinct.
// Returns a tailwind-friendly inline style using HSL.
export function categoryStyle(category: string): { backgroundColor: string; color: string; borderColor: string } {
  const palette = [
    { bg: 'hsl(150 60% 94%)', fg: 'hsl(150 70% 26%)', border: 'hsl(150 50% 70%)' }, // emerald
    { bg: 'hsl(38 95% 95%)', fg: 'hsl(32 80% 32%)', border: 'hsl(38 80% 70%)' },     // amber
    { bg: 'hsl(280 50% 96%)', fg: 'hsl(280 45% 38%)', border: 'hsl(280 45% 72%)' },  // violet
    { bg: 'hsl(190 60% 93%)', fg: 'hsl(190 70% 30%)', border: 'hsl(190 60% 65%)' },  // cyan
    { bg: 'hsl(0 70% 96%)', fg: 'hsl(0 65% 38%)', border: 'hsl(0 60% 75%)' },        // rose
    { bg: 'hsl(90 45% 94%)', fg: 'hsl(90 45% 28%)', border: 'hsl(90 45% 65%)' },     // lime
  ]
  let hash = 0
  for (let i = 0; i < category.length; i++) hash = (hash * 31 + category.charCodeAt(i)) >>> 0
  return palette[hash % palette.length]
}

export function truncateUrl(url: string, max = 48): string {
  if (url.length <= max) return url
  return url.slice(0, max - 1) + '…'
}

export function formatRelative(dateStr: string): string {
  const date = new Date(dateStr)
  const now = Date.now()
  const diff = Math.max(0, now - date.getTime())
  const sec = Math.floor(diff / 1000)
  if (sec < 5) return 'just now'
  if (sec < 60) return `${sec}s ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}d ago`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
