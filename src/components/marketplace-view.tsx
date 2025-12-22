"use client"

import { useState } from "react"
import { LayoutGrid, List, Globe, BarChart, Tag, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BuyViaWhatsapp } from "@/components/buy-via-whatsapp"

interface MarketplaceItem {
  id: string
  domain: string
  dr: number
  traffic: string | null
  price: number
  niche: string | null
  description: string | null
  status: string
  createdAt: Date
  updatedAt: Date
}

interface MarketplaceViewProps {
  items: MarketplaceItem[]
}

export function MarketplaceView({ items }: MarketplaceViewProps) {
  const [view, setView] = useState<"grid" | "list">("list")

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg border-dashed">
        <Globe className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">Nenhum site no inventário</h3>
        <p className="text-muted-foreground max-w-sm mt-2">
            Comece adicionando sites parceiros para criar seu catálogo de vendas.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("grid")}
            className="h-8 w-8 px-2"
            title="Visualização em Grade"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("list")}
            className="h-8 w-8 px-2"
            title="Visualização em Lista"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                 <Badge variant="outline" className="mb-2">{item.niche || "Geral"}</Badge>
                 <Badge variant={item.status === 'Available' ? 'default' : 'secondary'}>
                    {item.status === 'Available' ? 'Disponível' : item.status}
                 </Badge>
              </div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-4 w-4 text-muted-foreground" />
                {item.domain}
              </CardTitle>
              <CardDescription className="line-clamp-2 h-10">
                {item.description || "Sem descrição."}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 flex-1">
               <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-col gap-1">
                     <span className="text-muted-foreground flex items-center gap-1">
                        <BarChart className="h-3 w-3" /> DR
                     </span>
                     <span className="font-bold text-lg">{item.dr}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-muted-foreground flex items-center gap-1">
                        <Tag className="h-3 w-3" /> Tráfego
                     </span>
                     <span className="font-medium">{item.traffic || "N/A"}</span>
                  </div>
               </div>
               <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <span className="text-sm font-medium">Preço</span>
                  <span className="text-lg font-bold text-primary">
                     R$ {item.price.toFixed(2)}
                  </span>
               </div>
            </CardContent>
            <CardFooter>
               <BuyViaWhatsapp item={item} />
            </CardFooter>
          </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Domínio</TableHead>
                <TableHead className="w-[80px]">DR</TableHead>
                <TableHead className="w-[100px]">Tráfego</TableHead>
                <TableHead className="w-[150px]">Nicho</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="w-[120px]">Preço</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="text-right w-[100px]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        {item.domain}
                        <a 
                          href={`https://${item.domain}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                          title="Abrir site"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                  </TableCell>
                  <TableCell>{item.dr}</TableCell>
                  <TableCell>{item.traffic || "-"}</TableCell>
                  <TableCell><Badge variant="outline">{item.niche || "Geral"}</Badge></TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground" title={item.description || ""}>
                    {item.description || "-"}
                  </TableCell>
                  <TableCell className="font-bold text-primary">R$ {item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Available' ? 'default' : 'secondary'}>
                        {item.status === 'Available' ? 'Disponível' : item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                        <div className="w-[120px]">
                            <BuyViaWhatsapp item={item} />
                        </div>
                    </div>
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
