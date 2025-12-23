"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth"

export async function getTechnicalAudit(clientId: string) {
  try {
    const session = await getSession()
    const user = session?.user
    
    const client = await prisma.client.findUnique({ where: { id: clientId } })
    if (!client) return {}
    
    if (user?.role !== 'ADMIN' && client.userId !== user?.id) return {}

    const audit = await prisma.technicalAudit.findUnique({
      where: { clientId },
    })
    
    if (!audit) {
      return {}
    }

    return JSON.parse(audit.data)
  } catch (error) {
    console.error("Erro ao buscar auditoria:", error)
    return {}
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveTechnicalAudit(clientId: string, data: any) {
  try {
    const dataString = JSON.stringify(data)
    
    await prisma.technicalAudit.upsert({
      where: { clientId },
      create: {
        clientId,
        data: dataString
      },
      update: {
        data: dataString
      }
    })

    revalidatePath(`/dashboard/clients/${clientId}/technical`)
    return { success: true }
  } catch (error) {
    console.error("Erro ao salvar auditoria:", error)
    return { error: "Erro ao salvar auditoria" }
  }
}
