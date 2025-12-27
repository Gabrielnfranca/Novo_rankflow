'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowDown, ArrowUp, Globe, Calendar, MousePointerClick, Eye, Activity, CheckCircle2, Link as LinkIcon, Printer, Search, FileText } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { DashboardDateRangePicker } from "@/components/dashboard-date-range-picker";

interface ReportViewProps {
  data: any;
}

export function ReportView({ data }: ReportViewProps) {
  const { client, period, metrics, charts, topKeywords, topPages, workLog, trackedKeywords } = data;

  // Format Chart Data
  const chartData = charts.gsc?.map((row: any) => ({
    date: new Date(row.keys[0]).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    clicks: row.clicks,
    impressions: row.impressions
  })).reverse() || [];

  const GrowthIndicator = ({ value }: { value: number }) => {
    if (value === 0) return <span className="text-muted-foreground text-xs">0%</span>;
    const isPositive = value > 0;
    return (
      <span className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
        {Math.abs(value).toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="max-w-[210mm] mx-auto bg-white min-h-screen p-8 md:p-12 print:p-0 print:max-w-none print:min-h-0 print:w-full">
      {/* Print Button - Hidden when printing */}
      <div className="mb-8 flex justify-end gap-4 print:hidden">
        <DashboardDateRangePicker />
        <Button onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimir / Salvar PDF
        </Button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Relatório de Performance</h1>
          <p className="text-slate-500 mt-1">SEO & Tráfego Orgânico</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-slate-900">{client.name}</h2>
          <div className="flex items-center justify-end gap-2 text-sm text-slate-500 mt-1">
            <Globe className="h-3 w-3" />
            {client.url}
          </div>
          <div className="flex items-center justify-end gap-2 text-sm text-slate-500 mt-1">
            <Calendar className="h-3 w-3" />
            {format(new Date(period.start), "dd 'de' MMM", { locale: ptBR })} - {format(new Date(period.end), "dd 'de' MMM, yyyy", { locale: ptBR })}
          </div>
        </div>
      </div>

      {/* Executive Summary Placeholder */}
      <div className="mb-12 p-6 bg-slate-50 rounded-lg border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Resumo Executivo</h3>
        <p className="text-slate-600 leading-relaxed">
          Neste período, focamos em expandir a autoridade do domínio através de backlinks estratégicos e otimização de conteúdo.
          Observamos um crescimento de <span className="font-semibold">{metrics.clicks.growth.toFixed(1)}%</span> nos cliques orgânicos
          e <span className="font-semibold">{metrics.sessions.growth.toFixed(1)}%</span> nas sessões do site.
          As principais palavras-chave alvo apresentaram melhora no posicionamento médio.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-3 gap-6 mb-12 break-inside-avoid">
        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Sessões (Tráfego)</span>
            <Activity className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">{metrics.sessions.value.toLocaleString()}</span>
            <GrowthIndicator value={metrics.sessions.growth} />
          </div>
          <p className="text-xs text-slate-400 mt-2">vs. período anterior</p>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Cliques Orgânicos</span>
            <MousePointerClick className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">{metrics.clicks.value.toLocaleString()}</span>
            <GrowthIndicator value={metrics.clicks.growth} />
          </div>
          <p className="text-xs text-slate-400 mt-2">vs. período anterior</p>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Impressões</span>
            <Eye className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">{metrics.impressions.value.toLocaleString()}</span>
            <GrowthIndicator value={metrics.impressions.growth} />
          </div>
          <p className="text-xs text-slate-400 mt-2">vs. período anterior</p>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-12 break-inside-avoid">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Evolução de Tráfego Orgânico</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                itemStyle={{color: '#1e293b'}}
              />
              <Area type="monotone" dataKey="clicks" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tracked Keywords Section */}
      {trackedKeywords && trackedKeywords.length > 0 && (
        <div className="mb-12 break-inside-avoid">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b pb-2">Monitoramento de Palavras-Chave</h3>
          <div className="grid grid-cols-2 gap-6">
            {trackedKeywords.map((kw: any) => (
              <div key={kw.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-medium text-slate-700">{kw.term}</span>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="block text-xs text-slate-400">Posição</span>
                    <span className="font-bold text-slate-900 text-lg">{kw.position > 0 ? kw.position : '-'}</span>
                  </div>
                  {kw.previousPosition > 0 && (
                    <div className={`text-xs font-medium ${kw.position < kw.previousPosition ? 'text-green-600' : kw.position > kw.previousPosition ? 'text-red-600' : 'text-slate-400'}`}>
                      {kw.position < kw.previousPosition ? <ArrowUp className="h-4 w-4" /> : kw.position > kw.previousPosition ? <ArrowDown className="h-4 w-4" /> : '-'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Columns: Keywords & Pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 break-inside-avoid print:grid-cols-1 print:gap-8">
        {/* Top Keywords */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 p-1 rounded">
               <Search className="h-4 w-4" />
            </span>
            Top Palavras-Chave
          </h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                <tr>
                  <th className="px-4 py-3">Palavra-chave</th>
                  <th className="px-4 py-3 text-right">Pos.</th>
                  <th className="px-4 py-3 text-right">Clics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topKeywords.slice(0, 10).map((kw: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2 font-medium text-slate-700 truncate max-w-[180px] print:max-w-none">{kw.keys[0]}</td>
                    <td className="px-4 py-2 text-right text-slate-500">{kw.position.toFixed(1)}</td>
                    <td className="px-4 py-2 text-right text-slate-900 font-semibold">{kw.clicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Pages */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
             <span className="bg-green-100 text-green-700 p-1 rounded">
               <FileText className="h-4 w-4" />
            </span>
            Páginas Mais Acessadas
          </h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                <tr>
                  <th className="px-4 py-3">Página (URL)</th>
                  <th className="px-4 py-3 text-right">Usuários</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topPages.slice(0, 10).map((page: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2 font-medium text-slate-700 truncate max-w-[180px] print:max-w-none" title={page.dimensionValues[0].value}>
                      {page.dimensionValues[0].value}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-900 font-semibold">{page.metricValues[0].value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Work Log */}
      <div className="break-inside-avoid">
        <h3 className="text-lg font-semibold text-slate-900 mb-6 border-b pb-2">Atividades Realizadas</h3>
        
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <LinkIcon className="h-4 w-4" /> Backlinks Criados
            </h4>
            {workLog.backlinks.length > 0 ? (
              <ul className="space-y-3">
                {workLog.backlinks.map((link: any) => (
                  <li key={link.id} className="text-sm flex justify-between items-start">
                    <span className="text-slate-700">{link.domain}</span>
                    <span className="text-slate-400 text-xs">{format(new Date(link.createdAt), "dd/MM")}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400 italic">Nenhum backlink registrado neste período.</p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Tarefas Concluídas
            </h4>
            {workLog.tasks.length > 0 ? (
              <ul className="space-y-3">
                {workLog.tasks.map((task: any) => (
                  <li key={task.id} className="text-sm flex justify-between items-start">
                    <span className="text-slate-700">{task.title}</span>
                    <span className="text-slate-400 text-xs">{format(new Date(task.createdAt), "dd/MM")}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400 italic">Nenhuma tarefa concluída neste período.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>Relatório gerado automaticamente pelo RankFlow em {format(new Date(), "dd/MM/yyyy HH:mm")}</p>
      </div>
    </div>
  );
}
