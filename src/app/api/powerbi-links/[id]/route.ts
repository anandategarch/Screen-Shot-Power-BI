import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH /api/powerbi-links/[id] — update a link
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()

    const existing = await db.powerBILink.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    const data: Record<string, unknown> = {}
    if (typeof body.title === 'string') {
      const title = body.title.trim()
      if (!title) return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 })
      data.title = title
    }
    if (typeof body.url === 'string') {
      const url = body.url.trim()
      if (!url) return NextResponse.json({ error: 'URL cannot be empty' }, { status: 400 })
      try {
        new URL(url)
      } catch {
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
      }
      data.url = url
    }
    if (typeof body.category === 'string') {
      data.category = body.category.trim() || 'General'
    }
    if (body.description !== undefined) {
      data.description = body.description ? body.description.toString().trim() : null
    }

    const link = await db.powerBILink.update({ where: { id }, data })

    await db.activityLog.create({
      data: {
        action: 'update',
        targetType: 'link',
        targetId: link.id,
        targetTitle: link.title,
        details: `Link "${link.title}" details updated.`,
      },
    })

    return NextResponse.json({ link })
  } catch (err) {
    console.error('[powerbi-links PATCH]', err)
    return NextResponse.json({ error: 'Failed to update link' }, { status: 500 })
  }
}

// DELETE /api/powerbi-links/[id] — delete a link
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const existing = await db.powerBILink.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    await db.powerBILink.delete({ where: { id } })

    await db.activityLog.create({
      data: {
        action: 'delete',
        targetType: 'link',
        targetId: existing.id,
        targetTitle: existing.title,
        details: `Link "${existing.title}" removed.`,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[powerbi-links DELETE]', err)
    return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 })
  }
}
