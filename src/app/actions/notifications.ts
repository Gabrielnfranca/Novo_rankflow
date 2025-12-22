"use server"

import { prisma } from "@/lib/prisma"

export async function getClientNotifications(clientId: string) {
  if (!clientId) return null

  try {
    const [overdueBacklinks, technicalAudit] = await Promise.all([
      prisma.backlink.count({
        where: {
          clientId,
          followUpDate: { lt: new Date() },
          status: { notIn: ['Published', 'Rejected'] }
        }
      }),
      prisma.technicalAudit.findUnique({
        where: { clientId }
      })
    ])

    let technicalIssues = 0
    if (technicalAudit?.data) {
      const data = JSON.parse(technicalAudit.data)
      const items = Object.values(data) as { status: string }[]
      technicalIssues = items.filter((item) => item.status === 'fail' || item.status === 'warning').length
    }

    return {
      overdueBacklinks,
      technicalIssues,
      total: overdueBacklinks + technicalIssues
    }
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return { overdueBacklinks: 0, technicalIssues: 0, total: 0 }
  }
}
