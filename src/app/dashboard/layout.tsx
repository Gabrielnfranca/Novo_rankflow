import { DashboardShell } from "@/components/dashboard-shell"
import { getSidebarClients } from "@/app/actions"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const clients = await getSidebarClients()

  return (
    <DashboardShell clients={clients}>
      {children}
    </DashboardShell>
  )
}
