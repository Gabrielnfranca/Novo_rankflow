"use server"

import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { encrypt } from "@/lib/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  let userRole = "USER"

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios" }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { error: "Credenciais inválidas" }
    }
    
    userRole = user.role

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      return { error: "Credenciais inválidas" }
    }

    // Create session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const sessionData = { 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      }, 
      expires 
    }
    const session = await encrypt(sessionData)

    const cookieStore = await cookies()
    cookieStore.set("session", session, { expires, httpOnly: true })

  } catch (error) {
    console.error("Login error:", error)
    return { error: "Erro ao realizar login" }
  }

  // Redirection must happen outside try/catch because it throws an error
  if (userRole === "ADMIN") {
    redirect("/admin")
  } else {
    redirect("/dashboard")
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.set("session", "", { expires: new Date(0) })
  redirect("/login")
}
