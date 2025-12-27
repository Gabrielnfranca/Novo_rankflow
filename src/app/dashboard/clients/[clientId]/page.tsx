import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, MapPin, CheckCircle2, Clock, FileWarning, ArrowRight, TrendingUp, Link as LinkIcon, FileText } from "lucide-react"
import Link from "next/link"
import { getClientReportStats } from "@/app/actions"
import { ClientReportDialog } from "@/components/client-report-dialog"
import { getGoogleDashboardData } from "@/app/actions/google-integration"
import { ClientSeoDashboard } from "@/components/client-seo-dashboard"
import { subDays, format } from "date-fns"

export default async function ClientPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  
  const endDate = format(new Date(), 'yyyy-MM-dd');
  const startDate = format(subDays(new Date(), 28), 'yyyy-MM-dd');
  const startDateObj = subDays(new Date(), 28);

  const [
    client, 
    overdueBacklinks, 
    pendingTasks, 
    technicalAudit, 
    reportData,
    googleData,
    recentBacklinks,
    completedTasks
  ] = await Promise.all([
    prisma.client.findUnique({
      where: { id: clientId },
      include: {
        _count: {
          select: {
            keywords: true,
            backlinks: true,
            contentTasks: true,
            contentItems: true
          }
        }
      }
    }),
    prisma.backlink.count({
      where: {
        clientId,
        followUpDate: { lt: new Date() },
        status: { notIn: ['Published', 'Rejected'] }
      }
    }),
    prisma.contentTask.count({
      where: {
        clientId,
        column: { not: 'Done' }
      }
    }),
    prisma.technicalAudit.findUnique({
      where: { clientId }
    }),
    getClientReportStats(clientId),
    getGoogleDashboardData(clientId, startDate, endDate),
    prisma.backlink.count({
      where: {
        clientId,
        createdAt: { gte: startDateObj }
      }
    }),
    prisma.contentTask.count({
      where: {
        clientId,
        column: 'Done',
        updatedAt: { gte: startDateObj }
      }
    })
  ])

  if (!client) {
    return notFound()
  }

  // Process Technical Audit
  let technicalIssues = 0
  let auditProgress = 0
  if (technicalAudit?.data) {
    const data = JSON.parse(technicalAudit.data)
    const items = Object.values(data) as { status: string }[]
    technicalIssues = items.filter((item) => item.status === 'fail' || item.status === 'warning').length
    const completedItems = items.filter((item) => item.status !== 'pending').length
    // Assuming total items is around 18 based on the board structure, or we can calculate dynamically if we had the structure here.
    // For now, let's just use the count of keys in the data vs total expected (approx 18)
    auditProgress = Math.round((completedItems / 18) * 100) 
  }

  const hasAlerts = overdueBacklinks > 0 || technicalIssues > 0

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header do Cliente */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {client.url && (
              <a href={client.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Globe className="h-4 w-4" />
                {client.url}
              </a>
            )}
            {client.address && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {client.address}
              </span>
            )}
            <Badge variant={client.status === 'Active' ? 'default' : 'secondary'} className="capitalize">
              {client.status === 'Active' ? 'Ativo' : client.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
            <ClientReportDialog data={reportData} />
            <Button variant="outline" asChild>
                <Link href={`/dashboard/clients/${clientId}/settings`}>Editar Cliente</Link>
            </Button>
        </div>
      </div>

      {/* Área de Alertas e Atenção */}
      {hasAlerts && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {overdueBacklinks > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-4">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                        <Clock className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-red-900">Backlinks Atrasados</h3>
                        <p className="text-sm text-red-700 mt-1">
                            Você tem {overdueBacklinks} prospecções que precisam de follow-up hoje.
                        </p>
                        <Link href={`/dashboard/clients/${clientId}/backlinks`} className="text-xs font-medium text-red-800 hover:underline mt-2 inline-block">
                            Ver Backlinks &rarr;
                        </Link>
                    </div>
                </div>
            )}
            {technicalIssues > 0 && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 flex items-start gap-4">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                        <FileWarning className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-yellow-900">Problemas Técnicos</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                            Foram identificados {technicalIssues} itens críticos na auditoria técnica.
                        </p>
                        <Link href={`/dashboard/clients/${clientId}/technical`} className="text-xs font-medium text-yellow-800 hover:underline mt-2 inline-block">
                            Revisar Auditoria &rarr;
                        </Link>
                    </div>
                </div>
            )}
        </div>
      )}

      {/* SEO & Performance Dashboard */}
      <ClientSeoDashboard 
        data={googleData} 
        recentActivity={{
          completedTasks,
          createdBacklinks: recentBacklinks
        }}
      />

      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <span className="text-muted-foreground font-bold">R$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {client.monthlyValue?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
                Contrato: {client.contractDuration || "Indefinido"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Palavras-chave</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{client._count.keywords}</div>
            <Link href={`/dashboard/clients/${clientId}/keywords`} className="text-xs text-primary hover:underline mt-1 inline-flex items-center">
                Ver Rank Tracker <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backlinks</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{client._count.backlinks}</div>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                    {overdueBacklinks > 0 ? `${overdueBacklinks} atrasados` : "Tudo em dia"}
                </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conteúdo</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{client._count.contentItems}</div>
            <Link href={`/dashboard/clients/${clientId}/content`} className="text-xs text-primary hover:underline mt-1 inline-flex items-center">
                Ver Planejador <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auditoria Técnica</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditProgress > 100 ? 100 : auditProgress}%</div>
            <p className="text-xs text-muted-foreground mt-1">
                Concluído
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Acesso Rápido / Resumo */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Próximas Tarefas</CardTitle>
                <CardDescription>Resumo do que precisa ser feito.</CardDescription>
            </CardHeader>
            <CardContent>
                {pendingTasks > 0 ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <span className="text-sm font-medium">Tarefas de Conteúdo</span>
                            <Badge variant="secondary">{pendingTasks} pendentes</Badge>
                        </div>
                        {/* Aqui poderíamos listar as top 3 tarefas se tivéssemos buscado */}
                        <Button variant="ghost" className="w-full text-xs" asChild>
                            <Link href={`/dashboard/clients/${clientId}/roadmap`}>Ver Roadmap Completo</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                        <CheckCircle2 className="h-8 w-8 mb-2 text-green-500" />
                        <p>Nenhuma tarefa pendente.</p>
                    </div>
                )}
            </CardContent>
        </Card>

        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Status do Projeto</CardTitle>
                <CardDescription>Visão geral da saúde do projeto.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Saúde Técnica</span>
                        <Badge variant={technicalIssues === 0 ? "default" : "destructive"}>
                            {technicalIssues === 0 ? "Saudável" : `${technicalIssues} Problemas`}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Link Building</span>
                        <Badge variant={overdueBacklinks === 0 ? "outline" : "destructive"}>
                            {overdueBacklinks === 0 ? "Em dia" : "Atenção"}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Conteúdo</span>
                        <Badge variant="outline">
                            {pendingTasks} em produção
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
