'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDown, ArrowUp, MousePointerClick, Eye, Users, Activity, Search, FileText } from "lucide-react";

interface ClientSeoDashboardProps {
  data: {
    gsc: {
      performance: any[];
      topQueries: any[];
    } | null;
    ga4: {
      traffic: any;
      topPages: any;
    } | null;
  };
  recentActivity?: {
    completedTasks: number;
    createdBacklinks: number;
  };
}

export function ClientSeoDashboard({ data, recentActivity }: ClientSeoDashboardProps) {
  const { gsc, ga4 } = data;

  // Format GSC Data for Chart
  const gscChartData = gsc?.performance?.map((row: any) => ({
    date: new Date(row.keys[0]).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr * 100,
    position: row.position
  })).reverse() || [];

  // Format GA4 Data for Chart
  const ga4ChartData = ga4?.traffic?.rows?.map((row: any) => ({
    date: new Date(row.dimensionValues[0].value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    activeUsers: parseInt(row.metricValues[0].value),
    sessions: parseInt(row.metricValues[1].value),
    views: parseInt(row.metricValues[2].value)
  })) || [];

  // Calculate Totals
  const totalClicks = gsc?.performance?.reduce((acc: number, row: any) => acc + row.clicks, 0) || 0;
  const totalImpressions = gsc?.performance?.reduce((acc: number, row: any) => acc + row.impressions, 0) || 0;
  const totalSessions = ga4?.traffic?.rows?.reduce((acc: number, row: any) => acc + parseInt(row.metricValues[1].value), 0) || 0;
  const totalUsers = ga4?.traffic?.rows?.reduce((acc: number, row: any) => acc + parseInt(row.metricValues[0].value), 0) || 0;

  if (!gsc && !ga4) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dados de SEO</CardTitle>
          <CardDescription>Nenhum dado disponível. Conecte o Google Search Console e Analytics nas configurações.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques Totais (GSC)</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Últimos 28 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressões (GSC)</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Últimos 28 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões (GA4)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Últimos 28 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos (GA4)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Últimos 28 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="gsc" disabled={!gsc}>Search Console</TabsTrigger>
          <TabsTrigger value="ga4" disabled={!ga4}>Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Desempenho de Tráfego</CardTitle>
                <CardDescription>Comparativo de Cliques (GSC) e Sessões (GA4)</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={gscChartData.length > 0 ? gscChartData : ga4ChartData}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="clicks" name="Cliques (GSC)" stroke="#8884d8" fillOpacity={1} fill="url(#colorClicks)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>O que foi feito no período</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Backlinks Criados</p>
                      <p className="text-sm text-muted-foreground">
                        {recentActivity?.createdBacklinks || 0} novos links
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+{recentActivity?.createdBacklinks || 0}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Tarefas Concluídas</p>
                      <p className="text-sm text-muted-foreground">
                        {recentActivity?.completedTasks || 0} tarefas de conteúdo
                      </p>
                    </div>
                    <div className="ml-auto font-medium">+{recentActivity?.completedTasks || 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gsc" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Cliques vs Impressões</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={gscChartData}>
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="clicks" name="Cliques" stroke="#8884d8" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="impressions" name="Impressões" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Keywords</CardTitle>
                <CardDescription>Termos mais buscados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gsc?.topQueries?.map((query: any, i: number) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{query.keys[0]}</span>
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {query.clicks} cliques
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ga4" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Tráfego do Site</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={ga4ChartData}>
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sessions" name="Sessões" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="activeUsers" name="Usuários" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Páginas Mais Visitadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ga4?.topPages?.rows?.map((row: any, i: number) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm font-medium truncate" title={row.dimensionValues[0].value}>
                          {row.dimensionValues[0].value}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {row.metricValues[0].value} usuários
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
