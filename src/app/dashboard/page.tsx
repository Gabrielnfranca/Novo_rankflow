import { getDashboardStats } from "@/app/actions"
import { DashboardStats } from "@/components/dashboard-stats"
import { RankDistributionChart } from "@/components/rank-distribution-chart"
import { RecentActivity } from "@/components/recent-activity"

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Visão geral do desempenho de SEO de todos os clientes.
          </p>
        </div>
      </div>

      <div className="space-y-4">
          <DashboardStats stats={stats} />
          <RecentActivity winners={stats.winners} losers={stats.losers} />
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
            <RankDistributionChart data={stats.distribution} />
          </div>
      </div>
    </div>
  )
}
