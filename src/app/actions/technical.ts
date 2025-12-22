"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getTechnicalAudit(clientId: string) {
  try {
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
