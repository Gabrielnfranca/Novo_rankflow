import { DashboardShell } from "@/components/dashboard-shell"
import { getSidebarClients } from "@/app/actions"
import { getSession } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const clients = await getSidebarClients()
  const session = await getSession()

  return (
    <DashboardShell clients={clients} user={session?.user}>
      {children}
    </DashboardShell>
  )
}
