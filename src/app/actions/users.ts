"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { hash } from "bcryptjs"
import { verifySession } from "@/lib/auth"

export async function createUser(formData: FormData) {
  const session = await verifySession()
  if (session?.user.role !== 'ADMIN') return { error: "Unauthorized" }

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string || "USER"

  if (!name || !email || !password) {
    return { error: "Nome, email e senha são obrigatórios" }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "Email já cadastrado" }
    }

    const hashedPassword = await hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return { error: "Erro ao criar usuário" }
  }
}

export async function deleteUser(id: string) {
  const session = await verifySession()
  if (session?.user.role !== 'ADMIN') return { error: "Unauthorized" }

  try {
    await prisma.user.delete({
      where: { id },
    })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir usuário:", error)
    return { error: "Erro ao excluir usuário" }
  }
}

export async function resetPassword(formData: FormData) {
  const session = await verifySession()
  if (session?.user.role !== 'ADMIN') return { error: "Unauthorized" }

  const id = formData.get("id") as string
  const newPassword = formData.get("newPassword") as string

  if (!id || !newPassword) {
    return { error: "ID e nova senha são obrigatórios" }
  }

  try {
    const hashedPassword = await hash(newPassword, 10)

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    })

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Erro ao resetar senha:", error)
    return { error: "Erro ao resetar senha" }
  }
}

export async function getUsers() {
  const session = await verifySession()
  if (session?.user.role !== 'ADMIN') return []

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    })
    return users
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    return []
  }
}
