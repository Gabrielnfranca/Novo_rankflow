"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LayoutGrid, List, ExternalLink, Users } from "lucide-react"
import Link from "next/link"

type Client = {
  id: string
  name: string
  url: string | null
  color: string | null
  createdAt: Date
  updatedAt: Date
  _count: {
    keywords: number
    backlinks: number
  }
}

interface ClientListProps {
  clients: Client[]
}

export function ClientList({ clients }: ClientListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl text-muted-foreground">
        <Users className="h-12 w-12 mb-4 opacity-20" />
        <p className="text-lg font-medium">Nenhum cliente cadastrado</p>
        <p className="text-sm">Adicione seu primeiro cliente para começar.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only">Visualização em Grade</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">Visualização em Lista</span>
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-all duration-300 border-l-4" style={{ borderLeftColor: client.color || '#000' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">
                  {client.name}
                </CardTitle>
                {client.url && (
                  <a href={client.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  {client.url || "Sem URL cadastrada"}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{client._count.keywords}</span>
                    <span className="text-muted-foreground">Keywords</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{client._count.backlinks}</span>
                    <span className="text-muted-foreground">Backlinks</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/dashboard/rank-tracker?clientId=${client.id}`}>
                    Ver Detalhes
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-center">Keywords</TableHead>
                <TableHead className="text-center">Backlinks</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: client.color || '#000' }}
                      />
                      {client.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {client.url ? (
                      <a href={client.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline text-muted-foreground hover:text-primary">
                        {client.url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">{client._count.keywords}</TableCell>
                  <TableCell className="text-center">{client._count.backlinks}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/rank-tracker?clientId=${client.id}`}>
                        Ver Detalhes
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
