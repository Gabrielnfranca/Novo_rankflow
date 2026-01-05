"use server"

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { hash, compare } from "bcryptjs"

export async function updateProfile(formData: FormData) {
  const session = await getSession()
  if (!session?.user) return { error: "Não autorizado" }

  const name = formData.get("name") as string
  const email = formData.get("email") as string

  if (!name || !email) {
    return { error: "Nome e email são obrigatórios" }
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name, email },
    })
    
    revalidatePath("/dashboard/settings")
    return { success: "Perfil atualizado com sucesso" }
  } catch (error) {
    console.error("Update profile error:", error)
    return { error: "Erro ao atualizar perfil" }
  }
}

export async function updatePassword(formData: FormData) {
  const session = await getSession()
  if (!session?.user) return { error: "Não autorizado" }

  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Todos os campos são obrigatórios" }
  }

  if (newPassword !== confirmPassword) {
    return { error: "As novas senhas não coincidem" }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) return { error: "Usuário não encontrado" }

    const passwordMatch = await compare(currentPassword, user.password)
    if (!passwordMatch) {
      return { error: "Senha atual incorreta" }
    }

    const hashedPassword = await hash(newPassword, 10)

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    })

    return { success: "Senha atualizada com sucesso" }
  } catch (error) {
    console.error("Update password error:", error)
    return { error: "Erro ao atualizar senha" }
  }
}
