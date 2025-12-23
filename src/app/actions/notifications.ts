"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth"

export async function createNotification(formData: FormData) {
  const title = formData.get("title") as string
  const message = formData.get("message") as string
  const type = formData.get("type") as string || "INFO"
  const global = formData.get("global") === "true"

  if (!title || !message) {
    return { error: "Título e mensagem são obrigatórios" }
  }

  try {
    await prisma.notification.create({
      data: {
        title,
        message,
        type,
        global,
        read: false
      },
    })

    revalidatePath("/admin")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar notificação:", error)
    return { error: "Erro ao criar notificação" }
  }
}

export async function markNotificationAsRead(notificationId: string) {
    const session = await getSession()
    const userId = session?.user?.id
    
    if (!userId) return { success: false }

    try {
        await prisma.notificationRead.create({
            data: {
                notificationId,
                userId
            }
        })
        revalidatePath('/dashboard')
        return { success: true }
    } catch {
        // Ignore unique constraint error (already read)
        return { success: true }
    }
}

export async function getNotifications() {
  try {
    return await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })
  } catch {
    return []
  }
}

export async function deleteNotification(id: string) {
    try {
        await prisma.notification.delete({
            where: { id }
        })
        revalidatePath("/admin")
        revalidatePath("/dashboard")
        return { success: true }
    } catch {
        return { error: "Erro ao deletar notificação" }
    }
}

export async function getClientNotifications(clientId?: string | null) {
  try {
    const session = await getSession()
    const userId = session?.user?.id

    let globalNotifications = await prisma.notification.findMany({
        where: { global: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
            readBy: {
                where: { userId: userId || 'unknown' }
            }
        }
    })

    // Filter out notifications that have been read by the user
    if (userId) {
        globalNotifications = globalNotifications.filter(n => n.readBy.length === 0)
    }

    let overdueBacklinks = 0
    let technicalIssues = 0

    if (clientId) {
        const [backlinksCount, technicalAudit] = await Promise.all([
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
        
        overdueBacklinks = backlinksCount

        if (technicalAudit?.data) {
            const data = JSON.parse(technicalAudit.data)
            const items = Object.values(data) as { status: string }[]
            technicalIssues = items.filter((item) => item.status === 'fail' || item.status === 'warning').length
        }
    }

    return {
      overdueBacklinks,
      technicalIssues,
      globalNotifications,
      total: overdueBacklinks + technicalIssues + globalNotifications.length
    }
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return { overdueBacklinks: 0, technicalIssues: 0, globalNotifications: [], total: 0 }
  }
}
