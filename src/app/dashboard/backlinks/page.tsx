import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, DollarSign, Link as LinkIcon, TrendingUp, ExternalLink } from "lucide-react"
import { getBacklinks } from "@/app/actions"

export default async function BacklinksPage() {
  const backlinks = await getBacklinks()

  // Calculate KPIs
  const totalInvestment = backlinks.reduce((acc, link) => acc + (link.cost || 0), 0)
  const totalLinks = backlinks.length
  const avgDr = totalLinks > 0 
    ? Math.round(backlinks.reduce((acc, link) => acc + (link.dr || 0), 0) / totalLinks) 
    : 0

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Backlinks</h2>
          <p className="text-muted-foreground">Controle seus investimentos em Link Building e monitore o ROI.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Novo Backlink
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="border-none shadow-lg shadow-gray-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Investimento Total</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvestment)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total acumulado</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg shadow-gray-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Links Adquiridos</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <LinkIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalLinks}</div>
            <p className="text-xs text-muted-foreground mt-1">Total de links</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg shadow-gray-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">DR Médio</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{avgDr}</div>
            <p className="text-xs text-muted-foreground mt-1">Autoridade média</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[300px]">Domínio</TableHead>
                <TableHead>DR (Authority)</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Custo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backlinks.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Nenhum backlink encontrado.
                      </TableCell>
                  </TableRow>
              ) : (
                  backlinks.map((link) => (
                    <TableRow key={link.id} className="group hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium text-base min-w-[200px]">
                          <div>{link.domain}</div>
                          {link.client?.name && (
                              <div className="text-xs text-muted-foreground">{link.client.name}</div>
                          )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-bold">
                          {link.dr || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{link.type || "-"}</TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        {(link.cost || 0) > 0 ? 
                          new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(link.cost || 0) 
                          : <span className="text-green-600">Grátis</span>}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          link.status === "Paid" || link.status === "Published" ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200" :
                          link.status === "Pending" || link.status === "Negotiating" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200" :
                          "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200"
                        }>
                          {link.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{new Date(link.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
