import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SettingsView } from "@/components/settings/settings-view"
import { prisma } from "@/lib/prisma"

export default async function SettingsPage() {
  const session = await getSession()
  if (!session?.user) {
    redirect("/login")
  }

  // Fetch fresh user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true }
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
      </div>
      <SettingsView user={user} />
    </div>
  )
}
