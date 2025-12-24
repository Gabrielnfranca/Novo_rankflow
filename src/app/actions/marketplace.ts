"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { verifySession } from "@/lib/auth"

export async function getMarketplaceItems() {
  // Marketplace items are visible to all authenticated users
  const session = await verifySession()
  if (!session) return []
  
  return await prisma.marketplaceItem.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function createMarketplaceItem(formData: FormData) {
  const session = await verifySession()
  if (session?.user.role !== "ADMIN") return { error: "Unauthorized" }

  const domain = formData.get("domain") as string
  const dr = parseInt(formData.get("dr") as string)
  const price = parseFloat(formData.get("price") as string)
  const niche = formData.get("niche") as string
  const description = formData.get("description") as string
  const traffic = formData.get("traffic") as string

  if (!domain || !price) {
    return { error: "Domínio e preço são obrigatórios" }
  }

  try {
    await prisma.marketplaceItem.create({
      data: {
        domain,
        dr,
        price,
        niche,
        description,
        traffic,
        status: "Available"
      },
    })

    revalidatePath("/admin")
    revalidatePath("/dashboard/marketplace")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar item:", error)
    return { error: "Erro ao criar item" }
  }
}

export async function updateMarketplaceItem(id: string, formData: FormData) {
    const session = await verifySession()
    if (session?.user.role !== "ADMIN") return { error: "Unauthorized" }

    const domain = formData.get("domain") as string
    const dr = parseInt(formData.get("dr") as string)
    const price = parseFloat(formData.get("price") as string)
    const niche = formData.get("niche") as string
    const description = formData.get("description") as string
    const traffic = formData.get("traffic") as string
    const status = formData.get("status") as string

    try {
        await prisma.marketplaceItem.update({
            where: { id },
            data: {
                domain,
                dr,
                price,
                niche,
                description,
                traffic,
                status
            }
        })
        revalidatePath("/admin")
        revalidatePath("/dashboard/marketplace")
        return { success: true }
    } catch (error) {
        console.error("Erro ao atualizar item:", error)
        return { error: "Erro ao atualizar item" }
    }
}

export async function deleteMarketplaceItem(id: string) {
    const session = await verifySession()
    if (session?.user.role !== "ADMIN") return { error: "Unauthorized" }

    try {
        await prisma.marketplaceItem.delete({
            where: { id }
        })
        revalidatePath("/admin")
        revalidatePath("/dashboard/marketplace")
        return { success: true }
    } catch {
        return { error: "Erro ao deletar item" }
    }
}

export async function buyMarketplaceItem(itemId: string, clientId: string) {
  const session = await verifySession()
  if (!session) throw new Error("Unauthorized")

  // Verify client ownership
  const client = await prisma.client.findFirst({
    where: { id: clientId, userId: session.user.id }
  })
  if (!client) throw new Error("Client not found or access denied")

  const item = await prisma.marketplaceItem.findUnique({
    where: { id: itemId }
  })

  if (!item) throw new Error("Item not found")

  // Create a backlink for the client
  await prisma.backlink.create({
    data: {
      clientId,
      domain: item.domain,
      dr: item.dr,
      cost: item.price,
      status: "Awaiting Content", // New status
      type: "Guest Post", // Default type
      date: new Date(),
      // Copy other relevant info if needed
    }
  })

  revalidatePath(`/dashboard/clients/${clientId}/backlinks`)
  revalidatePath('/dashboard/marketplace')
}
