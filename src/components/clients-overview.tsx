"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react"
import Link from "next/link"

export interface ClientOverview {
  id: string
  name: string
  url: string | null
  status: string
  monthlyValue: number | null
  totalKeywords: number
  top3: number
  top10: number
  trend: number
}

export function ClientsOverview({ clients }: { clients: ClientOverview[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Geral dos Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {clients.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum cliente encontrado.</p>
          ) : (
            clients.map((client) => (
              <div key={client.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-1 min-w-[200px]">
                  <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">{client.name}</p>
                      <Badge variant={client.status === 'Active' ? 'default' : 'secondary'} className="text-[10px] h-5">
                          {client.status === 'Active' ? 'Ativo' : client.status}
                      </Badge>
                  </div>
                  <a href={client.url || '#'} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground flex items-center hover:underline">
                    {client.url} <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
                
                <div className="flex items-center justify-between gap-4 sm:gap-8 flex-1">
                  <div className="text-center">
                      <p className="text-[10px] uppercase text-muted-foreground font-semibold">Keywords</p>
                      <p className="text-sm font-bold">{client.totalKeywords}</p>
                  </div>
                  <div className="text-center">
                      <p className="text-[10px] uppercase text-muted-foreground font-semibold">Top 3</p>
                      <p className="text-sm font-bold text-green-600">{client.top3}</p>
                  </div>
                  <div className="text-center">
                      <p className="text-[10px] uppercase text-muted-foreground font-semibold">Top 10</p>
                      <p className="text-sm font-bold text-blue-600">{client.top10}</p>
                  </div>
                  <div className="text-center w-12">
                      <p className="text-[10px] uppercase text-muted-foreground font-semibold">Trend</p>
                      <div className="flex justify-center mt-1">
                          {client.trend > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : client.trend < 0 ? (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                          ) : (
                              <Minus className="h-4 w-4 text-slate-300" />
                          )}
                      </div>
                  </div>
                </div>

                <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
                  <Link href={`/dashboard/clients/${client.id}`}>
                    Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
