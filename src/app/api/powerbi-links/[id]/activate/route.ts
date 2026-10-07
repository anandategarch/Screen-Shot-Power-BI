import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/powerbi-links/[id]/activate — set a link as the active (default) report
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const target = await db.powerBILink.findUnique({ where: { id } })
    if (!target) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    const [, activeLink] = await db.$transaction([
      db.powerBILink.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      }),
      db.powerBILink.update({
        where: { id },
        data: { isActive: true, viewCount: { increment: 1 } },
      }),
    ])

    await db.activityLog.create({
      data: {
        action: 'activate',
        targetType: 'link',
        targetId: activeLink.id,
        targetTitle: activeLink.title,
        details: `Switched active report to "${activeLink.title}".`,
      },
    })

    return NextResponse.json({ link: activeLink })
  } catch (err) {
    console.error('[powerbi-links activate]', err)
    return NextResponse.json({ error: 'Failed to activate link' }, { status: 500 })
  }
}
