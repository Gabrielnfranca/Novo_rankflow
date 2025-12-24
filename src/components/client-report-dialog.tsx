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
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell
} from 'recharts';

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
    history: { date: string, top3: number, top10: number, top100: number }[]
  }
  backlinks: {
    total: number
    new: number
    published: number
    history: { date: string, count: number }[]
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
      window.location.reload() 
    }
  }

  // Prepare data for charts
  const rankDistributionData = [
    { name: 'Top 3', value: data.seo.top3, fill: '#16a34a' },
    { name: 'Top 10', value: data.seo.top10 - data.seo.top3, fill: '#2563eb' }, // Exclusive
    { name: 'Top 100', value: data.seo.top100 - data.seo.top10, fill: '#4b5563' }, // Exclusive
  ].filter(d => d.value > 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <FileText className="h-4 w-4" />
          Gerar Relatório Semanal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Relatório de Desempenho</DialogTitle>
          <DialogDescription>
            Resumo das atividades e métricas dos últimos 7 dias.
          </DialogDescription>
        </DialogHeader>

        <div id="report-content" className="space-y-8 p-6 bg-white text-black rounded-lg border shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">{data.clientName}</h1>
              <p className="text-base text-gray-500 mt-1">Relatório Semanal de SEO & Performance</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                <Calendar className="h-4 w-4" />
                {new Date(data.period.start).toLocaleDateString('pt-BR')} - {new Date(data.period.end).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          {/* SEO Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 border-l-4 border-blue-600 pl-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Performance de Palavras-chave
            </h3>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border text-center shadow-sm">
                <div className="text-3xl font-bold text-gray-900">{data.seo.totalKeywords}</div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mt-1">Monitoradas</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-center shadow-sm">
                <div className="text-3xl font-bold text-green-700">{data.seo.top3}</div>
                <div className="text-xs text-green-600 uppercase font-bold tracking-wider mt-1">Top 3</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center shadow-sm">
                <div className="text-3xl font-bold text-blue-700">{data.seo.top10}</div>
                <div className="text-xs text-blue-600 uppercase font-bold tracking-wider mt-1">Top 10</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border text-center shadow-sm">
                <div className="text-3xl font-bold text-gray-700">{data.seo.top100}</div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mt-1">Top 100</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rank History Chart */}
                <div className="p-4 border rounded-xl bg-white shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">Evolução de Rankings (30 dias)</h4>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.seo.history}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})} fontSize={10} />
                                <YAxis fontSize={10} />
                                <Tooltip contentStyle={{fontSize: '12px'}} />
                                <Legend wrapperStyle={{fontSize: '10px'}} />
                                <Line type="monotone" dataKey="top3" stroke="#16a34a" strokeWidth={2} dot={false} name="Top 3" />
                                <Line type="monotone" dataKey="top10" stroke="#2563eb" strokeWidth={2} dot={false} name="Top 10" />
                                <Line type="monotone" dataKey="top100" stroke="#4b5563" strokeWidth={2} dot={false} name="Top 100" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Current Distribution Pie */}
                <div className="p-4 border rounded-xl bg-white shadow-sm flex flex-col items-center">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">Distribuição Atual</h4>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={rankDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {rankDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend wrapperStyle={{fontSize: '10px'}} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Winners List */}
            {data.seo.winners.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Destaques da Semana</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.seo.winners.map((k: any) => (
                    <div key={k.id} className="flex items-center justify-between text-sm p-3 bg-green-50/50 rounded-lg border border-green-100">
                      <span className="font-medium text-gray-800 truncate mr-2">{k.term}</span>
                      <span className="text-green-700 font-bold whitespace-nowrap flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        +{k.previousPosition - k.position} pos
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Backlinks Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 border-l-4 border-purple-600 pl-3">
              <LinkIcon className="h-6 w-6 text-purple-600" />
              Link Building
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-center shadow-sm">
                <div className="text-3xl font-bold text-purple-700">{data.backlinks.new}</div>
                <div className="text-xs text-purple-600 uppercase font-bold tracking-wider mt-1">Novos (7 dias)</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-center shadow-sm">
                <div className="text-3xl font-bold text-green-700">{data.backlinks.published}</div>
                <div className="text-xs text-green-600 uppercase font-bold tracking-wider mt-1">Publicados (7 dias)</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border text-center shadow-sm">
                <div className="text-3xl font-bold text-gray-700">{data.backlinks.total}</div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mt-1">Total Ativos</div>
              </div>
            </div>

            {/* Backlink History Chart */}
            <div className="p-4 border rounded-xl bg-white shadow-sm">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">Aquisição de Backlinks (6 Meses)</h4>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.backlinks.history}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tickFormatter={(d) => {
                                const [y, m] = d.split('-');
                                return `${m}/${y.slice(2)}`;
                            }} fontSize={10} />
                            <YAxis fontSize={10} allowDecimals={false} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{fontSize: '12px'}} />
                            <Bar dataKey="count" fill="#9333ea" radius={[4, 4, 0, 0]} name="Novos Backlinks" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </div>

          <Separator />

          {/* Content Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 border-l-4 border-orange-600 pl-3">
              <CheckCircle2 className="h-6 w-6 text-orange-600" />
              Conteúdo & Tarefas
            </h3>
            <div className="flex gap-4">
               <div className="flex-1 p-5 bg-orange-50 rounded-xl border border-orange-100 flex items-center justify-between shadow-sm">
                  <span className="text-sm font-bold text-orange-800 uppercase tracking-wide">Novas Tarefas</span>
                  <span className="text-3xl font-bold text-orange-700">{data.content.newTasks}</span>
               </div>
               <div className="flex-1 p-5 bg-gray-50 rounded-xl border flex items-center justify-between shadow-sm">
                  <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Concluídas</span>
                  <span className="text-3xl font-bold text-gray-900">{data.content.completedTasks}</span>
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
