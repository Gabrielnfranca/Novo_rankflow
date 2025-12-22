import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, DollarSign, Link as LinkIcon, TrendingUp, ExternalLink } from "lucide-react"

const backlinks = [
  { id: 1, domain: "tecmundo.com.br", dr: 88, type: "Guest Post", cost: 1500, status: "Paid", date: "15 Dez 2024" },
  { id: 2, domain: "meunegocio.com", dr: 45, type: "Niche Edit", cost: 350, status: "Pending", date: "18 Dez 2024" },
  { id: 3, domain: "blogdojoao.com.br", dr: 32, type: "Troca", cost: 0, status: "Active", date: "10 Dez 2024" },
  { id: 4, domain: "exame.com", dr: 91, type: "Assessoria", cost: 2500, status: "Paid", date: "01 Dez 2024" },
  { id: 5, domain: "uol.com.br", dr: 94, type: "Press Release", cost: 1200, status: "Paid", date: "28 Nov 2024" },
]

export default function BacklinksPage() {
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

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-lg shadow-gray-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Investimento Total (Mês)</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">R$ 4.350,00</div>
            <p className="text-xs text-muted-foreground mt-1">+12% vs mês anterior</p>
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
            <div className="text-3xl font-bold text-foreground">5</div>
            <p className="text-xs text-muted-foreground mt-1">Meta: 8 links/mês</p>
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
            <div className="text-3xl font-bold text-foreground">70</div>
            <p className="text-xs text-muted-foreground mt-1">Alta autoridade</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
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
            {backlinks.map((link) => (
              <TableRow key={link.id} className="group hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium text-base">{link.domain}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-bold">
                    {link.dr}
                  </Badge>
                </TableCell>
                <TableCell>{link.type}</TableCell>
                <TableCell className="font-medium">
                  {link.cost > 0 ? `R$ ${link.cost.toFixed(2)}` : <span className="text-green-600">Grátis</span>}
                </TableCell>
                <TableCell>
                  <Badge className={
                    link.status === "Paid" ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200" :
                    link.status === "Pending" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200" :
                    "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200"
                  }>
                    {link.status === "Paid" ? "Pago" : link.status === "Pending" ? "Pendente" : "Ativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{link.date}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
