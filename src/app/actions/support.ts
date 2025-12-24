'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { verifySession } from "@/lib/auth"

export async function getTickets() {
  const session = await verifySession()
  if (!session) return []

  try {
    const where = session.user.role === 'ADMIN' ? {} : { userId: session.user.id }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
    return tickets
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return []
  }
}

export async function createTicket(subject: string, message: string) {
    const session = await verifySession()
    if (!session) return { success: false, error: "Unauthorized" }

    try {
        const ticket = await prisma.ticket.create({
            data: {
                userId: session.user.id,
                subject,
                status: 'OPEN',
                messages: {
                    create: {
                        content: message,
                        senderId: session.user.id
                    }
                }
            }
        })
        revalidatePath('/dashboard/support')
        revalidatePath('/admin')
        return { success: true, ticket }
    } catch (error) {
        console.error("Error creating ticket:", error)
        return { success: false, error: "Failed to create ticket" }
    }
}

export async function replyTicket(ticketId: string, message: string) {
    const session = await verifySession()
    if (!session) return { success: false, error: "Unauthorized" }

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } })
        if (!ticket) return { success: false, error: "Ticket not found" }

        if (session.user.role !== 'ADMIN' && ticket.userId !== session.user.id) {
            return { success: false, error: "Unauthorized" }
        }

        const senderId = session.user.role === 'ADMIN' ? 'ADMIN' : session.user.id

        await prisma.ticketMessage.create({
            data: {
                ticketId,
                content: message,
                senderId
            }
        })

        await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                status: session.user.role === 'ADMIN' ? 'ANSWERED' : 'OPEN',
                updatedAt: new Date()
            }
        })

        revalidatePath('/dashboard/support')
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error("Error replying to ticket:", error)
        return { success: false, error: "Failed to reply" }
    }
}

export async function closeTicket(ticketId: string) {
    const session = await verifySession()
    if (!session) return { success: false, error: "Unauthorized" }

    try {
        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } })
        if (!ticket) return { success: false, error: "Ticket not found" }

        if (session.user.role !== 'ADMIN' && ticket.userId !== session.user.id) {
            return { success: false, error: "Unauthorized" }
        }

        await prisma.ticket.update({
            where: { id: ticketId },
            data: { status: 'CLOSED' }
        })
        revalidatePath('/dashboard/support')
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error("Error closing ticket:", error)
        return { success: false, error: "Failed to close ticket" }
    }
}
