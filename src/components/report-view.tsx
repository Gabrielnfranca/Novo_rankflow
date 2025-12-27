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

  // Generate Dynamic Insights
  const generateExecutiveSummary = () => {
    const sessionGrowth = metrics.sessions.growth;
    const clickGrowth = metrics.clicks.growth;
    const impressionGrowth = metrics.impressions.growth;
    
    let trafficText = "";
    if (sessionGrowth > 5) {
      trafficText = `Tivemos um excelente desempenho em tráfego, com um aumento de ${sessionGrowth.toFixed(1)}% nas sessões.`;
    } else if (sessionGrowth > 0) {
      trafficText = `O tráfego manteve-se estável com um leve crescimento de ${sessionGrowth.toFixed(1)}%.`;
    } else {
      trafficText = `Observamos uma retração de ${Math.abs(sessionGrowth).toFixed(1)}% no tráfego, o que indica a necessidade de reforçar as estratégias de aquisição.`;
    }

    let visibilityText = "";
    if (clickGrowth > 0 && impressionGrowth > 0) {
      visibilityText = `A visibilidade orgânica também cresceu, com ${clickGrowth.toFixed(1)}% mais cliques e ${impressionGrowth.toFixed(1)}% mais impressões no Google.`;
    } else if (clickGrowth < 0 && impressionGrowth > 0) {
      visibilityText = `Apesar do aumento nas impressões (+${impressionGrowth.toFixed(1)}%), tivemos menos cliques, sugerindo oportunidades de melhoria nos títulos e descrições (CTR).`;
    } else {
      visibilityText = `Houve uma variação de ${clickGrowth.toFixed(1)}% nos cliques orgânicos em comparação ao período anterior.`;
    }

    return `${trafficText} ${visibilityText} Continuamos monitorando as principais palavras-chave para garantir a evolução constante do projeto.`;
  };

  const generateKeywordAnalysis = () => {
    if (!trackedKeywords || trackedKeywords.length === 0) return null;
    
    const improved = trackedKeywords.filter((k: any) => k.previousPosition > 0 && k.position < k.previousPosition).length;
    const declined = trackedKeywords.filter((k: any) => k.previousPosition > 0 && k.position > k.previousPosition).length;
    const stable = trackedKeywords.filter((k: any) => k.previousPosition > 0 && k.position === k.previousPosition).length;
    const newRankings = trackedKeywords.filter((k: any) => k.previousPosition === 0 && k.position > 0).length;

    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800 border border-blue-100">
        <p className="font-semibold mb-1 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Análise de Movimentação
        </p>
        <p>
          Neste período, monitoramos {trackedKeywords.length} palavras-chave estratégicas. 
          {improved > 0 && ` ${improved} subiram de posição,`}
          {declined > 0 && ` ${declined} sofreram queda,`}
          {stable > 0 && ` ${stable} mantiveram a posição`}
          {newRankings > 0 && ` e ${newRankings} entraram no ranking pela primeira vez`}.
        </p>
      </div>
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
      <div className="flex justify-between items-start mb-12 print:mb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 print:text-2xl">Relatório de Performance</h1>
          <p className="text-slate-500 mt-1 print:text-sm">SEO & Tráfego Orgânico</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-slate-900 print:text-lg">{client.name}</h2>
          <div className="flex items-center justify-end gap-2 text-sm text-slate-500 mt-1 print:text-xs">
            <Globe className="h-3 w-3" />
            {client.url}
          </div>
          <div className="flex items-center justify-end gap-2 text-sm text-slate-500 mt-1 print:text-xs">
            <Calendar className="h-3 w-3" />
            {format(new Date(period.start), "dd 'de' MMM", { locale: ptBR })} - {format(new Date(period.end), "dd 'de' MMM, yyyy", { locale: ptBR })}
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mb-12 p-6 bg-slate-50 rounded-lg border border-slate-100 print:mb-4 print:p-4">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 print:mb-2">Resumo Executivo</h3>
        <p className="text-slate-600 leading-relaxed print:text-sm">
          {generateExecutiveSummary()}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-3 gap-6 mb-12 break-inside-avoid print:mb-4 print:gap-4">
        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm print:p-4">
          <div className="flex items-center justify-between mb-4 print:mb-2">
            <span className="text-sm font-medium text-slate-500">Sessões (Tráfego)</span>
            <Activity className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900 print:text-2xl">{metrics.sessions.value.toLocaleString()}</span>
            <GrowthIndicator value={metrics.sessions.growth} />
          </div>
          <p className="text-xs text-slate-400 mt-2">vs. período anterior</p>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm print:p-4">
          <div className="flex items-center justify-between mb-4 print:mb-2">
            <span className="text-sm font-medium text-slate-500">Cliques Orgânicos</span>
            <MousePointerClick className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900 print:text-2xl">{metrics.clicks.value.toLocaleString()}</span>
            <GrowthIndicator value={metrics.clicks.growth} />
          </div>
          <p className="text-xs text-slate-400 mt-2">vs. período anterior</p>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm print:p-4">
          <div className="flex items-center justify-between mb-4 print:mb-2">
            <span className="text-sm font-medium text-slate-500">Impressões</span>
            <Eye className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900 print:text-2xl">{metrics.impressions.value.toLocaleString()}</span>
            <GrowthIndicator value={metrics.impressions.growth} />
          </div>
          <p className="text-xs text-slate-400 mt-2">vs. período anterior</p>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-12 break-inside-avoid print:mb-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-6 print:mb-2 print:text-base">Evolução de Tráfego Orgânico</h3>
        <div className="h-[300px] w-full print:h-[200px]">
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
        <div className="mb-12 break-inside-avoid print:mb-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b pb-2 print:mb-2">Monitoramento de Palavras-Chave</h3>
          <div className="grid grid-cols-2 gap-6 print:gap-2">
            {trackedKeywords.map((kw: any) => (
              <div key={kw.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 print:p-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 break-inside-avoid print:grid-cols-1 print:gap-4 print:mb-4">
        {/* Top Keywords */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2 print:mb-2">
            <span className="bg-blue-100 text-blue-700 p-1 rounded">
               <Search className="h-4 w-4" />
            </span>
            Top Palavras-Chave
          </h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                <tr>
                  <th className="px-4 py-3 print:py-2">Palavra-chave</th>
                  <th className="px-4 py-3 text-right print:py-2">Pos.</th>
                  <th className="px-4 py-3 text-right print:py-2">Clics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topKeywords.slice(0, 10).map((kw: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2 font-medium text-slate-700 break-words print:py-1">{kw.keys[0]}</td>
                    <td className="px-4 py-2 text-right text-slate-500 print:py-1">{kw.position.toFixed(1)}</td>
                    <td className="px-4 py-2 text-right text-slate-900 font-semibold print:py-1">{kw.clicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {generateKeywordAnalysis()}
        </div>

        {/* Top Pages */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2 print:mb-2">
             <span className="bg-green-100 text-green-700 p-1 rounded">
               <FileText className="h-4 w-4" />
            </span>
            Páginas Mais Acessadas
          </h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                <tr>
                  <th className="px-4 py-3 print:py-2">Página (URL)</th>
                  <th className="px-4 py-3 text-right print:py-2">Usuários</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topPages.slice(0, 10).map((page: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2 font-medium text-slate-700 break-all print:py-1" title={page.dimensionValues[0].value}>
                      {page.dimensionValues[0].value}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-900 font-semibold print:py-1">{page.metricValues[0].value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Work Log */}
      <div className="break-inside-avoid">
        <h3 className="text-lg font-semibold text-slate-900 mb-6 border-b pb-2 print:mb-2">Atividades Realizadas</h3>
        
        <div className="grid grid-cols-2 gap-12 print:gap-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2 print:mb-2">
              <LinkIcon className="h-4 w-4" /> Backlinks Criados
            </h4>
            {workLog.backlinks.length > 0 ? (
              <ul className="space-y-3 print:space-y-1">
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
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2 print:mb-2">
              <CheckCircle2 className="h-4 w-4" /> Tarefas Concluídas
            </h4>
            {workLog.tasks.length > 0 ? (
              <ul className="space-y-3 print:space-y-1">
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
      <div className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm print:mt-8 print:pt-4">
        <p>Relatório gerado automaticamente pelo RankFlow em {format(new Date(), "dd/MM/yyyy HH:mm")}</p>
      </div>
    </div>
  );
}
