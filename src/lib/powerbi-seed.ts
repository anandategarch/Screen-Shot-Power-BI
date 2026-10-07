import { db } from '@/lib/db'

// The default Power BI report link provided by the operator.
export const DEFAULT_POWERBI_LINK = {
  title: 'Default Power BI Report',
  url: 'https://app.powerbi.com/view?r=eyJrIjoiZGJmYzFlNWQtZmI0Yi00N2FmLThjOTEtZmY4NzA1ODQyZjZiIiwidCI6ImRmZjE0NWY0LTdlOTctNDVkYS1iMTJhLTc0MzJmMWNiN2U2OCIsImMiOjEwfQ%3D%3D',
  category: 'Default',
  description:
    'Power BI report embedded by default. You can switch to any other saved link or edit this one at any time.',
}

// Ensures the default link exists and at least one link is active.
// Safe to call repeatedly — only acts when needed.
export async function ensureDefaultLink() {
  const count = await db.powerBILink.count()

  if (count === 0) {
    const link = await db.powerBILink.create({
      data: {
        title: DEFAULT_POWERBI_LINK.title,
        url: DEFAULT_POWERBI_LINK.url,
        category: DEFAULT_POWERBI_LINK.category,
        description: DEFAULT_POWERBI_LINK.description,
        isActive: true,
        order: 0,
      },
    })
    await db.activityLog.create({
      data: {
        action: 'seed',
        targetType: 'link',
        targetId: link.id,
        targetTitle: link.title,
        details: 'Default Power BI report link seeded automatically.',
      },
    })
    return
  }

  // Make sure there's always exactly one active link.
  const active = await db.powerBILink.findFirst({ where: { isActive: true } })
  if (!active) {
    const first = await db.powerBILink.findFirst({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    })
    if (first) {
      await db.powerBILink.update({
        where: { id: first.id },
        data: { isActive: true },
      })
    }
  }
}
