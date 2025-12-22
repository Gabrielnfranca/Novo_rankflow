import { getKeywords } from "@/app/actions"
import { AddKeywordDialog } from "@/components/add-keyword-dialog"
import { KeywordHistoryDialog } from "@/components/keyword-history-dialog"
import { EditKeywordDialog } from "@/components/edit-keyword-dialog"
import { DeleteKeywordDialog } from "@/components/delete-keyword-dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"

export default async function KeywordsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const keywords = await getKeywords(clientId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Palavras-chave</h2>
          <p className="text-muted-foreground">
            Monitoramento de posições e performance orgânica.
          </p>
        </div>
        <AddKeywordDialog clientId={clientId} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Rank Tracker</CardTitle>
          <CardDescription>Acompanhe o posicionamento das suas palavras-chave.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Termo</TableHead>
                <TableHead>Posição Atual</TableHead>
                <TableHead>Variação</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Dificuldade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.map((keyword) => {
                let trendIcon = <Minus className="h-4 w-4 text-muted-foreground" />
                let trendColor = "text-muted-foreground"
                
                if (keyword.previousPosition !== 0 && keyword.position !== 0) {
                    if (keyword.position < keyword.previousPosition) {
                        trendIcon = <ArrowUp className="h-4 w-4 text-green-500" />
                        trendColor = "text-green-500"
                    } else if (keyword.position > keyword.previousPosition) {
                        trendIcon = <ArrowDown className="h-4 w-4 text-red-500" />
                        trendColor = "text-red-500"
                    }
                }

                return (
                  <TableRow key={keyword.id}>
                    <TableCell className="font-medium">{keyword.term}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">{keyword.position === 0 ? "-" : keyword.position}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className={`flex items-center gap-1 ${trendColor}`}>
                            {trendIcon}
                            {keyword.previousPosition !== 0 && Math.abs(keyword.previousPosition - keyword.position) > 0 && (
                                <span>{Math.abs(keyword.previousPosition - keyword.position)}</span>
                            )}
                        </div>
                    </TableCell>
                    <TableCell>{keyword.volume}</TableCell>
                    <TableCell>
                        <Badge variant="outline">{keyword.difficulty}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                            <KeywordHistoryDialog keyword={keyword} />
                            <EditKeywordDialog keyword={keyword} />
                            <DeleteKeywordDialog keyword={keyword} />
                        </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {keywords.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nenhuma palavra-chave cadastrada.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
