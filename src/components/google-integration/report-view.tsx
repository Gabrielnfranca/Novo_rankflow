'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchGoogleReport } from '@/app/actions/google-integration';
import { Loader2, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportViewProps {
  clientId: string;
}

export function ReportView({ clientId }: ReportViewProps) {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('30');
  const [data, setData] = useState<{ gscData: any[], ga4Data: any } | null>(null);

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    setLoading(true);
    const endDate = format(new Date(), 'yyyy-MM-dd');
    const startDate = format(subDays(new Date(), parseInt(dateRange)), 'yyyy-MM-dd');
    
    const res = await fetchGoogleReport(clientId, startDate, endDate);
    if ('gscData' in res) {
      setData(res);
    }
    setLoading(false);
  };

  const formatDataForChart = () => {
    if (!data?.gscData) return [];
    // Merge GSC and GA4 data by date if needed, or just return GSC for now
    // GSC returns { keys: [date], clicks, impressions, ctr, position }
    // GA4 returns { rows: [ { dimensionValues: [{value: date}], metricValues: [{value: users}, ...] } ] }
    
    // Let's map GSC data first
    return data.gscData.map((row: any) => ({
      date: format(new Date(row.keys[0]), 'dd/MM', { locale: ptBR }),
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr * 100,
      position: row.position
    })).reverse(); // GSC usually returns newest first? No, usually sorted by date but let's check. Actually API returns sorted by date ascending usually.
  };

  const chartData = formatDataForChart();

  const getTotalClicks = () => data?.gscData?.reduce((acc: number, curr: any) => acc + curr.clicks, 0) || 0;
  const getTotalImpressions = () => data?.gscData?.reduce((acc: number, curr: any) => acc + curr.impressions, 0) || 0;
  
  // GA4 Totals
  const getGA4Totals = () => {
    if (!data?.ga4Data?.rows) return { users: 0, sessions: 0 };
    // Sum up all rows
    let users = 0;
    let sessions = 0;
    data.ga4Data.rows.forEach((row: any) => {
      users += parseInt(row.metricValues[0].value);
      sessions += parseInt(row.metricValues[1].value);
    });
    return { users, sessions };
  };

  const ga4Totals = getGA4Totals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Relatório de Performance</h2>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 3 meses</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cliques Totais (GSC)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalClicks().toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impressões (GSC)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalImpressions().toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários Ativos (GA4)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ga4Totals.users.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sessões (GA4)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ga4Totals.sessions.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Performance de Busca (GSC)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="clicks" stroke="#8884d8" fillOpacity={1} fill="url(#colorClicks)" yAxisId="left" name="Cliques" />
                    <Area type="monotone" dataKey="impressions" stroke="#82ca9d" fillOpacity={1} fill="url(#colorImpressions)" yAxisId="right" name="Impressões" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
