"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getMarketplaceItems() {
  return await prisma.marketplaceItem.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function createMarketplaceItem(data: {
  domain: string
  dr: number
  traffic?: string
  price: number
  niche?: string
  description?: string
}) {
  await prisma.marketplaceItem.create({
    data
  })
  revalidatePath('/dashboard/marketplace')
}

export async function buyMarketplaceItem(itemId: string, clientId: string) {
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
