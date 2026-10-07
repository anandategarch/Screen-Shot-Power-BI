import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/activity-logs — list recent activity logs (newest first)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = Math.min(Number(searchParams.get('limit') ?? 100) || 100, 500)

  const logs = await db.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return NextResponse.json({ logs })
}

// DELETE /api/activity-logs — clear all activity logs
export async function DELETE() {
  await db.activityLog.deleteMany({})
  await db.activityLog.create({
    data: {
      action: 'clear',
      targetType: 'system',
      details: 'Activity log history cleared.',
    },
  })
  return NextResponse.json({ ok: true })
}
