export type PowerBILink = {
  id: string
  title: string
  url: string
  category: string
  description: string | null
  isActive: boolean
  order: number
  viewCount: number
  createdAt: string
  updatedAt: string
}

export type ActivityLog = {
  id: string
  action: string
  targetType: string
  targetId: string | null
  targetTitle: string | null
  details: string | null
  createdAt: string
}

export type LinkInput = {
  title: string
  url: string
  category: string
  description?: string | null
}
