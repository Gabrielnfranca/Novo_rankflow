import { getBacklinks, getClient } from "@/app/actions"
import { AddBacklinkDialog } from "@/components/add-backlink-dialog"
import { EditBacklinkDialog } from "@/components/edit-backlink-dialog"
import { DeleteBacklinkDialog } from "@/components/delete-backlink-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { differenceInDays, format, isPast, isToday } from "date-fns"
import { ExternalLink, Search, AlertCircle, CheckCircle2, Clock, Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const statusMap: Record<string, string> = {
  "Prospecting": "Prospecção",
  "Negotiating": "Negociação",
  "Content Sent": "Conteúdo Enviado",
  "Published": "Publicado",
  "Rejected": "Rejeitado"
}

export default async function BacklinksPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const [backlinks, client] = await Promise.all([
    getBacklinks(clientId),
    getClient(clientId)
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Backlinks</h2>
          <p className="text-muted-foreground">
            Acompanhe suas prospecções e links publicados para {client?.name}.
          </p>
        </div>
        <AddBacklinkDialog clientId={clientId} />
      </div>

      <div className="flex items-center gap-2 rounded-xl border bg-card p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por domínio, responsável ou palavra-chave..."
            className="pl-9 border-none bg-muted/50 focus-visible:ring-0"
          />
        </div>
        <Button variant="outline">Filtros</Button>
        <Button variant="outline">Exportar</Button>
      </div>

      <Card>
        <CardHeader className="p-0">
           {/* Optional: Add tabs or summary stats here */}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[1800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px] text-center">
                    <div className="flex items-center justify-center gap-1">
                      Status
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Acompanhe em que etapa está a negociação do link.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead className="w-[200px] text-center">
                    <div className="flex items-center justify-center gap-1">
                      Domínio
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>URL do site parceiro onde o link será publicado.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead className="w-[150px] text-center">
                    <div className="flex items-center justify-center gap-1">
                      Responsável
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Pessoa de contato ou dono do site parceiro.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead className="w-[180px] text-center">
                    <div className="flex items-center justify-center gap-1">
                      Palavra-chave
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Termo principal que queremos ranquear com este link.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead className="w-[150px] text-center">
                    <div className="flex items-center justify-center gap-1">
                      Texto Âncora
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Texto clicável exato que aparecerá no artigo.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead className="w-[200px] text-center">Title</TableHead>
                  <TableHead className="w-[250px] text-center">Meta Description</TableHead>
                  <TableHead className="w-[120px] text-center">Intenção</TableHead>
                  <TableHead className="w-[150px] text-center">
                    <div className="flex items-center justify-center gap-1">
                      Cobrar em
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Data para entrar em contato novamente (Follow-up).</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead className="w-[120px] text-center">Links</TableHead>
                  <TableHead className="w-[120px] text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backlinks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
                      Nenhum backlink cadastrado. Inicie uma prospecção.
                    </TableCell>
                  </TableRow>
                ) : (
                  backlinks.map((backlink) => {
                    const followUpDate = backlink.followUpDate ? new Date(backlink.followUpDate) : null
                    let statusColor = "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    let statusIcon = <Clock className="h-3 w-3 mr-1" />

                    // Logic for Status Color based on Follow Up Date
                    if (followUpDate && backlink.status !== 'Published' && backlink.status !== 'Rejected') {
                        const daysUntil = differenceInDays(followUpDate, new Date())
                        
                        if (isPast(followUpDate) && !isToday(followUpDate)) {
                            statusColor = "bg-red-100 text-red-700 border-red-200 hover:bg-red-200" // Overdue
                            statusIcon = <AlertCircle className="h-3 w-3 mr-1" />
                        } else if (daysUntil <= 2) {
                            statusColor = "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200" // Warning
                            statusIcon = <Clock className="h-3 w-3 mr-1" />
                        } else {
                            statusColor = "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" // On track
                        }
                    } else if (backlink.status === 'Published') {
                        statusColor = "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                        statusIcon = <CheckCircle2 className="h-3 w-3 mr-1" />
                    }

                    return (
                      <TableRow key={backlink.id}>
                        <TableCell className="align-middle text-center">
                          <Badge variant="outline" className={`border ${statusColor} font-medium whitespace-nowrap mx-auto`}>
                            {statusIcon}
                            {statusMap[backlink.status] || backlink.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium align-middle text-center">
                          <div className="whitespace-normal break-words w-[200px] mx-auto">
                            {backlink.domain}
                          </div>
                        </TableCell>
                        <TableCell className="align-middle text-center">
                            <div className="whitespace-normal break-words w-[150px] mx-auto">
                                {backlink.owner || "-"}
                            </div>
                        </TableCell>
                        <TableCell className="align-middle text-center">
                          {backlink.keyword ? (
                              <div className="flex flex-col w-[180px] mx-auto items-center">
                                  <span className="whitespace-normal break-words">{backlink.keyword}</span>
                                  <span className="text-xs text-muted-foreground">Vol: {backlink.volume || "N/A"}</span>
                              </div>
                          ) : "-"}
                        </TableCell>
                        <TableCell className="align-middle text-center">
                            <div className="whitespace-normal break-words w-[150px] mx-auto">
                                {backlink.anchorText || "-"}
                            </div>
                        </TableCell>
                        <TableCell className="align-middle text-center">
                            <div className="whitespace-normal break-words w-[200px] mx-auto">
                                {backlink.title || "-"}
                            </div>
                        </TableCell>
                        <TableCell className="align-middle text-center">
                            <div className="whitespace-normal break-words w-[250px] text-sm text-muted-foreground mx-auto">
                                {backlink.metaDescription || "-"}
                            </div>
                        </TableCell>
                        <TableCell className="align-middle text-center">
                            <div className="whitespace-normal break-words w-[120px] mx-auto">
                                {backlink.intent || "-"}
                            </div>
                        </TableCell>
                        <TableCell className="align-middle text-center">
                          {followUpDate ? (
                              <span className={isPast(followUpDate) && !isToday(followUpDate) && backlink.status !== 'Published' ? "text-red-600 font-bold" : ""}>
                                  {format(followUpDate, "dd/MM/yyyy")}
                              </span>
                          ) : "-"}
                        </TableCell>
                        <TableCell className="align-middle text-center">
                          <div className="flex gap-2 justify-center">
                              {backlink.driveUrl && (
                                  <a href={backlink.driveUrl} target="_blank" rel="noreferrer" title="Ver no Drive" className="text-muted-foreground hover:text-primary">
                                      <ExternalLink className="h-4 w-4" />
                                  </a>
                              )}
                              {backlink.postUrl && (
                                  <a href={backlink.postUrl} target="_blank" rel="noreferrer" title="Ver Post Publicado" className="text-green-600 hover:text-green-700">
                                      <CheckCircle2 className="h-4 w-4" />
                                  </a>
                              )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center align-middle">
                          <div className="flex items-center justify-center gap-2">
                            <EditBacklinkDialog backlink={backlink} clientId={clientId} />
                            <DeleteBacklinkDialog backlinkId={backlink.id} clientId={clientId} />
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
