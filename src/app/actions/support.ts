'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getTickets() {
  try {
    const tickets = await prisma.ticket.findMany({
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

export async function createTicket(userId: string, subject: string, message: string) {
    try {
        const ticket = await prisma.ticket.create({
            data: {
                userId,
                subject,
                status: 'OPEN',
                messages: {
                    create: {
                        content: message,
                        senderId: userId
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

export async function replyTicket(ticketId: string, message: string, isAdmin: boolean = false) {
    try {
        await prisma.ticketMessage.create({
            data: {
                ticketId,
                content: message,
                senderId: isAdmin ? 'ADMIN' : 'USER'
            }
        })

        await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                status: isAdmin ? 'ANSWERED' : 'OPEN',
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
    try {
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
