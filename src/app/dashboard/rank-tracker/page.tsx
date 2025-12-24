import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowUpRight, ArrowDownRight, Minus, ExternalLink, MoreHorizontal } from "lucide-react"
import { getKeywords, getClient } from "@/app/actions"
import { AddKeywordDialog } from "@/components/add-keyword-dialog"

export default async function RankTrackerPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const clientId = typeof resolvedSearchParams.clientId === 'string' ? resolvedSearchParams.clientId : undefined
  const keywords = await getKeywords(clientId)
  const client = clientId ? await getClient(clientId) : null

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Rank Tracker {client ? `- ${client.name}` : ""}
          </h2>
          <p className="text-muted-foreground">
            Monitore o posicionamento das suas palavras-chave no Google.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AddKeywordDialog clientId={clientId} />
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-center gap-2 rounded-xl border bg-card p-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar palavra-chave..."
            className="pl-9 border-none bg-muted/50 focus-visible:ring-0 w-full"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none">Filtros</Button>
            <Button variant="outline" className="flex-1 sm:flex-none">Exportar</Button>
        </div>
      </div>

      {/* Tabela de Rank */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[300px]">Palavra-Chave</TableHead>
                <TableHead className="text-center">Posição</TableHead>
                <TableHead className="text-center">Mudança</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Dificuldade</TableHead>
                <TableHead>URL Ranqueada</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          Nenhuma palavra-chave monitorada. Adicione a primeira!
                      </TableCell>
                  </TableRow>
              ) : (
                  keywords.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium min-w-[200px]">
                      <div className="flex flex-col">
                          <span className="text-base">{item.term}</span>
                          <span className="text-xs text-muted-foreground">Atualizado: {new Date(item.updatedAt).toLocaleDateString()}</span>
                      </div>
                      </TableCell>
                      <TableCell className="text-center">
                      <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg font-bold ${
                          item.position === 0 ? "bg-gray-100 text-gray-400 border border-gray-200" :
                          item.position <= 3 ? "bg-yellow-100 text-yellow-700 border border-yellow-200" : 
                          item.position <= 10 ? "bg-green-100 text-green-700 border border-green-200" : 
                          "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}>
                          {item.position === 0 ? "-" : item.position}
                      </div>
                      </TableCell>
                      <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                          {item.position < item.previousPosition && item.position !== 0 && (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 gap-1">
                              <ArrowUpRight className="h-3 w-3" />
                              {item.previousPosition - item.position}
                          </Badge>
                          )}
                          {item.position > item.previousPosition && (
                          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 gap-1">
                              <ArrowDownRight className="h-3 w-3" />
                            {item.position - item.previousPosition}
                        </Badge>
                        )}
                        {(item.position === item.previousPosition || item.position === 0) && (
                        <Badge variant="outline" className="text-muted-foreground gap-1">
                            <Minus className="h-3 w-3" />
                            -
                        </Badge>
                        )}
                    </div>
                    </TableCell>
                    <TableCell>{item.volume}</TableCell>
                    <TableCell>
                    <Badge variant="secondary" className={
                        item.difficulty === "Hard" ? "bg-red-100 text-red-700 hover:bg-red-100" :
                        item.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" :
                        "bg-green-100 text-green-700 hover:bg-green-100"
                    }>
                        {item.difficulty}
                    </Badge>
                    </TableCell>
                    <TableCell>
                    {item.url ? (
                        <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors truncate max-w-[200px]">
                            <ExternalLink className="h-3 w-3" />
                            {item.url.replace('https://', '').replace('http://', '')}
                        </a>
                    ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                    )}
                    </TableCell>
                    <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
