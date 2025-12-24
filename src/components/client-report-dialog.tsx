"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, Download, Printer, TrendingUp, Link as LinkIcon, CheckCircle2, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface ReportData {
  clientName: string
  period: {
    start: Date
    end: Date
  }
  seo: {
    totalKeywords: number
    top3: number
    top10: number
    top100: number
    winners: any[]
  }
  backlinks: {
    total: number
    new: number
    published: number
  }
  content: {
    newTasks: number
    completedTasks: number
  }
}

export function ClientReportDialog({ data }: { data: ReportData | null }) {
  const [open, setOpen] = useState(false)

  if (!data) return null

  const handlePrint = () => {
    const printContent = document.getElementById("report-content")
    if (printContent) {
      const originalContents = document.body.innerHTML
      document.body.innerHTML = printContent.innerHTML
      window.print()
      document.body.innerHTML = originalContents
      window.location.reload() // Reload to restore event listeners
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <FileText className="h-4 w-4" />
          Gerar Relatório Semanal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Relatório de Desempenho</DialogTitle>
          <DialogDescription>
            Resumo das atividades e métricas dos últimos 7 dias.
          </DialogDescription>
        </DialogHeader>

        <div id="report-content" className="space-y-6 p-4 bg-white text-black rounded-lg border">
          {/* Header do Relatório */}
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">{data.clientName}</h1>
              <p className="text-sm text-gray-500">Relatório Semanal de SEO & Performance</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                {new Date(data.period.start).toLocaleDateString('pt-BR')} - {new Date(data.period.end).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          {/* Seção SEO */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Performance de Palavras-chave
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg border text-center">
                <div className="text-2xl font-bold text-gray-900">{data.seo.totalKeywords}</div>
                <div className="text-xs text-gray-500 uppercase font-medium">Monitoradas</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-100 text-center">
                <div className="text-2xl font-bold text-green-700">{data.seo.top3}</div>
                <div className="text-xs text-green-600 uppercase font-medium">Top 3</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-center">
                <div className="text-2xl font-bold text-blue-700">{data.seo.top10}</div>
                <div className="text-xs text-blue-600 uppercase font-medium">Top 10</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border text-center">
                <div className="text-2xl font-bold text-gray-700">{data.seo.top100}</div>
                <div className="text-xs text-gray-500 uppercase font-medium">Top 100</div>
              </div>
            </div>

            {data.seo.winners.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Destaques da Semana (Maiores Subidas)</h4>
                <div className="space-y-2">
                  {data.seo.winners.map((k: any) => (
                    <div key={k.id} className="flex items-center justify-between text-sm p-2 bg-green-50/50 rounded border border-green-100">
                      <span className="font-medium text-gray-800">{k.term}</span>
                      <span className="text-green-700 font-bold">+{k.previousPosition - k.position} posições</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Seção Backlinks */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <LinkIcon className="h-5 w-5 text-purple-600" />
              Link Building
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 text-center">
                <div className="text-2xl font-bold text-purple-700">{data.backlinks.new}</div>
                <div className="text-xs text-purple-600 uppercase font-medium">Novos (7 dias)</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-100 text-center">
                <div className="text-2xl font-bold text-green-700">{data.backlinks.published}</div>
                <div className="text-xs text-green-600 uppercase font-medium">Publicados (7 dias)</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border text-center">
                <div className="text-2xl font-bold text-gray-700">{data.backlinks.total}</div>
                <div className="text-xs text-gray-500 uppercase font-medium">Total Ativos</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seção Conteúdo */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <CheckCircle2 className="h-5 w-5 text-orange-600" />
              Conteúdo & Tarefas
            </h3>
            <div className="flex gap-4">
               <div className="flex-1 p-4 bg-orange-50 rounded-lg border border-orange-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-800">Novas Tarefas Criadas</span>
                  <span className="text-2xl font-bold text-orange-700">{data.content.newTasks}</span>
               </div>
               <div className="flex-1 p-4 bg-gray-50 rounded-lg border flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Tarefas Concluídas</span>
                  <span className="text-2xl font-bold text-gray-900">{data.content.completedTasks}</span>
               </div>
            </div>
          </div>

          <div className="pt-8 text-center text-xs text-gray-400 border-t mt-8">
            Gerado automaticamente por RankFlow em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <div className="text-xs text-muted-foreground self-center">
            * Este é um resumo visual para impressão.
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Fechar</Button>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir / Salvar PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
