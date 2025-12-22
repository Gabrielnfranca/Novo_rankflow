import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, Trophy, Medal } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    totalClients: number
    totalKeywords: number
    top3: number
    top10: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Clientes
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalClients}</div>
          <p className="text-xs text-muted-foreground">
            Ativos na plataforma
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Palavras-chave
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalKeywords}</div>
          <p className="text-xs text-muted-foreground">
            Monitoradas diariamente
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Top 3 (Ouro)
          </CardTitle>
          <Trophy className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.top3}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalKeywords > 0 ? ((stats.top3 / stats.totalKeywords) * 100).toFixed(1) : 0}% do total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Primeira Página
          </CardTitle>
          <Medal className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.top10}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalKeywords > 0 ? ((stats.top10 / stats.totalKeywords) * 100).toFixed(1) : 0}% do total
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
