import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowUp, ArrowDown } from "lucide-react"

interface Keyword {
  id: number
  term: string
  position: number
  previousPosition: number
  client?: {
    name: string
  } | null
}

interface RecentActivityProps {
  winners: Keyword[]
  losers: Keyword[]
}

export function RecentActivity({ winners, losers }: RecentActivityProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4 lg:col-span-4">
        <CardHeader>
          <CardTitle>Maiores Altas (24h)</CardTitle>
          <CardDescription>
            Palavras-chave que ganharam mais posições recentemente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {winners.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma alteração positiva recente.</p>
            ) : (
                winners.map((keyword) => {
                    const diff = keyword.previousPosition - keyword.position
                    return (
                        <div key={keyword.id} className="flex items-center">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{keyword.term}</p>
                                <p className="text-xs text-muted-foreground">
                                    {keyword.client?.name || "Sem cliente"}
                                </p>
                            </div>
                            <div className="ml-auto font-medium text-green-600 dark:text-green-400">
                                +{diff} posições
                            </div>
                            <div className="ml-4 text-sm text-muted-foreground w-12 text-right">
                                #{keyword.position}
                            </div>
                        </div>
                    )
                })
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-3 lg:col-span-3">
        <CardHeader>
          <CardTitle>Quedas Recentes</CardTitle>
          <CardDescription>
            Atenção necessária para estas palavras.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {losers.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma queda recente.</p>
            ) : (
                losers.map((keyword) => {
                    const diff = keyword.position - keyword.previousPosition
                    return (
                        <div key={keyword.id} className="flex items-center">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                                <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{keyword.term}</p>
                                <p className="text-xs text-muted-foreground">
                                    {keyword.client?.name || "Sem cliente"}
                                </p>
                            </div>
                            <div className="ml-auto font-medium text-red-600 dark:text-red-400">
                                -{diff}
                            </div>
                            <div className="ml-4 text-sm text-muted-foreground w-12 text-right">
                                #{keyword.position}
                            </div>
                        </div>
                    )
                })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
