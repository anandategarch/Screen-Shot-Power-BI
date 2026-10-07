import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ensureDefaultLink } from '@/lib/powerbi-seed'

// GET /api/powerbi-links — list all links (ordered)
export async function GET() {
  await ensureDefaultLink()
  const links = await db.powerBILink.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  })
  return NextResponse.json({ links })
}

// POST /api/powerbi-links — create a new link
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const title = (body.title ?? '').toString().trim()
    const url = (body.url ?? '').toString().trim()
    const category = (body.category ?? 'General').toString().trim() || 'General'
    const description = body.description ? body.description.toString().trim() : null

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!url) {
      return NextResponse.json({ error: 'Power BI URL is required' }, { status: 400 })
    }
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    const maxOrder = await db.powerBILink.aggregate({ _max: { order: true } })
    const link = await db.powerBILink.create({
      data: {
        title,
        url,
        category,
        description,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    })

    await db.activityLog.create({
      data: {
        action: 'create',
        targetType: 'link',
        targetId: link.id,
        targetTitle: link.title,
        details: `Link "${link.title}" added under category "${link.category}".`,
      },
    })

    return NextResponse.json({ link }, { status: 201 })
  } catch (err) {
    console.error('[powerbi-links POST]', err)
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 })
  }
}
