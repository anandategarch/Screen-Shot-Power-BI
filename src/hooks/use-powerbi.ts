'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { LinkInput } from '@/types/powerbi'
import { toast } from '@/hooks/use-toast'

export const qKeys = {
  links: ['powerbi-links'] as const,
  logs: ['activity-logs'] as const,
}

export function useLinks() {
  return useQuery({
    queryKey: qKeys.links,
    queryFn: api.listLinks,
  })
}

export function useLogs() {
  return useQuery({
    queryKey: qKeys.logs,
    queryFn: api.listLogs,
    refetchInterval: 10_000,
  })
}

export function useCreateLink() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: LinkInput) => api.createLink(input),
    onSuccess: (link) => {
      qc.invalidateQueries({ queryKey: qKeys.links })
      qc.invalidateQueries({ queryKey: qKeys.logs })
      toast({ title: 'Link added', description: `"${link.title}" was saved to the library.` })
    },
    onError: (e: Error) => toast({ variant: 'destructive', title: 'Failed to add link', description: e.message }),
  })
}

export function useUpdateLink() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<LinkInput> }) =>
      api.updateLink(id, input),
    onSuccess: (link) => {
      qc.invalidateQueries({ queryKey: qKeys.links })
      qc.invalidateQueries({ queryKey: qKeys.logs })
      toast({ title: 'Link updated', description: `"${link.title}" was saved.` })
    },
    onError: (e: Error) => toast({ variant: 'destructive', title: 'Failed to update', description: e.message }),
  })
}

export function useDeleteLink() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteLink(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qKeys.links })
      qc.invalidateQueries({ queryKey: qKeys.logs })
      toast({ title: 'Link removed', description: 'The link was deleted from the library.' })
    },
    onError: (e: Error) => toast({ variant: 'destructive', title: 'Failed to delete', description: e.message }),
  })
}

export function useActivateLink() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.activateLink(id),
    onSuccess: (link) => {
      qc.invalidateQueries({ queryKey: qKeys.links })
      qc.invalidateQueries({ queryKey: qKeys.logs })
      toast({ title: 'Report switched', description: `Now showing "${link.title}".` })
    },
    onError: (e: Error) => toast({ variant: 'destructive', title: 'Failed to switch', description: e.message }),
  })
}

export function useClearLogs() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.clearLogs(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qKeys.logs })
      toast({ title: 'Log cleared', description: 'Activity history was reset.' })
    },
    onError: (e: Error) => toast({ variant: 'destructive', title: 'Failed to clear log', description: e.message }),
  })
}
