"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { ContentItem } from "@prisma/client"

export async function addContent(formData: FormData) {
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
