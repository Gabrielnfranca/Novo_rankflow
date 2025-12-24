"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getSession, verifySession } from "@/lib/auth"

export async function addContent(formData: FormData) {
  const session = await verifySession()
  if (!session) return { error: "Unauthorized" }

  const title = formData.get("title") as string
  const keyword = formData.get("keyword") as string
  const status = formData.get("status") as string || "IDEA"
  const h1 = formData.get("h1") as string
  const metaTitle = formData.get("metaTitle") as string
  const metaDescription = formData.get("metaDescription") as string
  const author = formData.get("author") as string
  const clientId = formData.get("clientId") as string
  
  const deadlineStr = formData.get("deadline") as string
  const deadline = deadlineStr ? new Date(deadlineStr) : undefined
  
  const publicationDateStr = formData.get("publicationDate") as string
  const publicationDate = publicationDateStr ? new Date(publicationDateStr) : undefined

  if (!title || !clientId) {
    return { error: "Título e Cliente são obrigatórios" }
  }

  // Verify ownership
  const client = await prisma.client.findFirst({
    where: { id: clientId, userId: session.user.id }
  })
  if (!client) return { error: "Client not found or access denied" }

  try {
    await prisma.contentItem.create({
      data: {
        title,
        keyword,
        status,
        h1,
        metaTitle,
        metaDescription,
        author,
        deadline,
        publicationDate,
        clientId,
      },
    })

    revalidatePath(`/dashboard/clients/${clientId}/content`)
    return { success: true }
  } catch (error) {
    console.error("Erro ao adicionar conteúdo:", error)
    return { error: "Erro ao salvar conteúdo" }
  }
}

export async function updateContent(formData: FormData) {
  const session = await verifySession()
  if (!session) return { error: "Unauthorized" }

  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const keyword = formData.get("keyword") as string
  const status = formData.get("status") as string
  const h1 = formData.get("h1") as string
  const metaTitle = formData.get("metaTitle") as string
  const metaDescription = formData.get("metaDescription") as string
  const author = formData.get("author") as string
  const clientId = formData.get("clientId") as string
  
  const deadlineStr = formData.get("deadline") as string
  const deadline = deadlineStr ? new Date(deadlineStr) : null // null to clear
  
  const publicationDateStr = formData.get("publicationDate") as string
  const publicationDate = publicationDateStr ? new Date(publicationDateStr) : null // null to clear

  if (!id || !title) {
    return { error: "ID e Título são obrigatórios" }
  }

  // Verify ownership
  const item = await prisma.contentItem.findUnique({
    where: { id },
    include: { client: true }
  })

  if (!item || item.client.userId !== session.user.id) {
    return { error: "Content not found or access denied" }
  }

  try {
    await prisma.contentItem.update({
      where: { id },
      data: {
        title,
        keyword,
        status,
        h1,
        metaTitle,
        metaDescription,
        author,
        deadline,
        publicationDate,
      },
    })

    if (clientId) {
        revalidatePath(`/dashboard/clients/${clientId}/content`)
    }
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar conteúdo:", error)
    return { error: "Erro ao atualizar conteúdo" }
  }
}

export async function updateContentStatus(id: string, status: string, clientId: string) {
    const session = await verifySession()
    if (!session) return { error: "Unauthorized" }

    // Verify ownership
    const item = await prisma.contentItem.findUnique({
        where: { id },
        include: { client: true }
    })

    if (!item || item.client.userId !== session.user.id) {
        return { error: "Content not found or access denied" }
    }

    try {
        await prisma.contentItem.update({
            where: { id },
            data: { status }
        })
        revalidatePath(`/dashboard/clients/${clientId}/content`)
        return { success: true }
    } catch (error) {
        console.error("Erro ao atualizar status:", error)
        return { error: "Erro ao atualizar status" }
    }
}

export async function deleteContent(id: string, clientId: string) {
  const session = await verifySession()
  if (!session) return { error: "Unauthorized" }

  // Verify ownership
  const item = await prisma.contentItem.findUnique({
      where: { id },
      include: { client: true }
  })

  if (!item || item.client.userId !== session.user.id) {
      return { error: "Content not found or access denied" }
  }

  try {
    await prisma.contentItem.delete({
      where: { id },
    })

    revalidatePath(`/dashboard/clients/${clientId}/content`)
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir conteúdo:", error)
    return { error: "Erro ao excluir conteúdo" }
  }
}

export async function getContentItems(clientId: string) {
  try {
    const session = await getSession()
    const user = session?.user
    
    const client = await prisma.client.findUnique({ where: { id: clientId } })
    if (!client) return []
    
    if (user?.role !== 'ADMIN' && client.userId !== user?.id) return []

    const items = await prisma.contentItem.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
    })
    return items
  } catch (error) {
    console.error("Erro ao buscar conteúdos:", error)
    return []
  }
}

export async function getAllContentTasks() {
  const session = await verifySession()
  if (!session) return []

  try {
    const tasks = await prisma.contentTask.findMany({
      where: {
        client: {
          userId: session.user.id
        }
      },
      include: {
        client: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })
    return tasks
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error)
    return []
  }
}

export async function getAllContentItems() {
  const session = await verifySession()
  if (!session) return []

  try {
    const items = await prisma.contentItem.findMany({
      where: {
        client: {
          userId: session.user.id
        }
      },
      include: {
        client: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })
    return items
  } catch (error) {
    console.error("Erro ao buscar todos os conteúdos:", error)
    return []
  }
}
