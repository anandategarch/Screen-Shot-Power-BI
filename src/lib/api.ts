import type { ActivityLog, LinkInput, PowerBILink } from '@/types/powerbi'

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error || `Request failed (${res.status})`)
  }
  return res.json() as Promise<T>
}

export const api = {
  async listLinks(): Promise<PowerBILink[]> {
    const r = await fetch('/api/powerbi-links', { cache: 'no-store' })
    const data = await json<{ links: PowerBILink[] }>(r)
    return data.links
  },

  async createLink(input: LinkInput): Promise<PowerBILink> {
    const r = await fetch('/api/powerbi-links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const data = await json<{ link: PowerBILink }>(r)
    return data.link
  },

  async updateLink(id: string, input: Partial<LinkInput>): Promise<PowerBILink> {
    const r = await fetch(`/api/powerbi-links/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const data = await json<{ link: PowerBILink }>(r)
    return data.link
  },

  async deleteLink(id: string): Promise<void> {
    const r = await fetch(`/api/powerbi-links/${id}`, { method: 'DELETE' })
    await json<{ ok: boolean }>(r)
  },

  async activateLink(id: string): Promise<PowerBILink> {
    const r = await fetch(`/api/powerbi-links/${id}/activate`, { method: 'POST' })
    const data = await json<{ link: PowerBILink }>(r)
    return data.link
  },

  async listLogs(): Promise<ActivityLog[]> {
    const r = await fetch('/api/activity-logs?limit=200', { cache: 'no-store' })
    const data = await json<{ logs: ActivityLog[] }>(r)
    return data.logs
  },

  async clearLogs(): Promise<void> {
    const r = await fetch('/api/activity-logs', { method: 'DELETE' })
    await json<{ ok: boolean }>(r)
  },
}
