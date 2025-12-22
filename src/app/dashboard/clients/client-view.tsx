"use client"

import * as React from "react"
import Link from "next/link"
import { 
  LayoutGrid, 
  List as ListIcon, 
  Plus, 
  MoreHorizontal, 
  ExternalLink, 
  Search,
  Filter
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AddClientDialog } from "@/components/add-client-dialog"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

type Client = {
  id: string
  name: string
  logo?: string
  url?: string | null
  createdAt?: Date
  monthlyValue?: number | null
  contractDuration?: string | null
  startDate?: Date | null
  status?: string
  _count?: {
    keywords: number
    backlinks: number
  }
}

interface ClientViewProps {
  clients: Client[]
}

export function ClientView({ clients }: ClientViewProps) {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("list")
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center border rounded-md bg-background">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-2 rounded-none rounded-l-md"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <div className="w-[1px] h-4 bg-border" />
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-2 rounded-none rounded-r-md"
              onClick={() => setViewMode("list")}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
          <AddClientDialog />
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium truncate pr-4">
                  {client.name}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem>Editar Cliente</DropdownMenuItem>
                    <DropdownMenuItem>Configurações</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 py-4">
                   <Avatar className="h-12 w-12 border-2 border-primary/10">
                      <AvatarImage src={client.logo} />
                      <AvatarFallback className="text-lg">{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                   </Avatar>
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-normal">
                            {client.status === "Active" ? "Ativo" : client.status || "Ativo"}
                        </Badge>
                        {client.monthlyValue && (
                            <span className="text-xs font-medium text-green-600">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.monthlyValue)}/mês
                            </span>
                        )}
                      </div>
                      {client.url && (
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">{client.url}</p>
                      )}
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Keywords</span>
                        <span className="font-bold">{client._count?.keywords || 0}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Backlinks</span>
                        <span className="font-bold">{client._count?.backlinks || 0}</span>
                    </div>
                </div>
              </CardContent>
              <CardFooter>
                  <Link href={`/dashboard/clients/${client.id}`} className="w-full">
                      <Button variant="outline" className="w-full group">
                          <ExternalLink className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                          Acessar Painel
                      </Button>
                  </Link>
              </CardFooter>
            </Card>
          ))}
          
          <Button variant="outline" className="h-full min-h-[200px] flex flex-col items-center justify-center gap-4 border-dashed hover:border-primary hover:bg-primary/5">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                  <h3 className="font-semibold">Novo Cliente</h3>
                  <p className="text-sm text-muted-foreground">Adicionar um novo projeto</p>
              </div>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contrato</TableHead>
                <TableHead>Valor Mensal</TableHead>
                <TableHead>Keywords</TableHead>
                <TableHead>Backlinks</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={client.logo} />
                            <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span>{client.name}</span>
                            {client.url && <span className="text-xs text-muted-foreground">{client.url}</span>}
                        </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      client.status === "Active" ? "bg-green-500/10 text-green-600 border-green-200" : 
                      client.status === "Inactive" ? "bg-red-500/10 text-red-600 border-red-200" :
                      "bg-yellow-500/10 text-yellow-600 border-yellow-200"
                    }>
                      {client.status === "Active" ? "Ativo" : client.status === "Inactive" ? "Inativo" : client.status || "Ativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="text-sm">{client.contractDuration || "-"}</span>
                        {client.startDate && (
                            <span className="text-xs text-muted-foreground">
                                Desde {new Date(client.startDate).toLocaleDateString('pt-BR')}
                            </span>
                        )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {client.monthlyValue ? (
                        <span className="font-medium">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.monthlyValue)}
                        </span>
                    ) : "-"}
                  </TableCell>
                  <TableCell>{client._count?.keywords || 0}</TableCell>
                  <TableCell>{client._count?.backlinks || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/clients/${client.id}`}>
                            <Button variant="ghost" size="sm">
                                Painel
                            </Button>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredClients.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        Nenhum cliente encontrado.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
