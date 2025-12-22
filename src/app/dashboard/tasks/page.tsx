"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CalendarClock, CheckCircle2, AlertCircle, Clock, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// Mock data for demonstration
const tasks = [
  {
    id: 1,
    client: "TechSolutions",
    title: "Artigo: Tendências de IA para 2025",
    status: "Em Redação",
    priority: "Alta",
    dueDate: "Hoje",
    assignee: "Ana Silva",
    assigneeInitials: "AS",
    progress: 45
  },
  {
    id: 2,
    client: "EcoMarket",
    title: "Review de Produtos Sustentáveis",
    status: "Atrasado",
    priority: "Urgente",
    dueDate: "Ontem",
    assignee: "Carlos Oliveira",
    assigneeInitials: "CO",
    progress: 10
  },
  {
    id: 3,
    client: "Dr. Saúde",
    title: "Post Instagram: Dicas de Nutrição",
    status: "Revisão",
    priority: "Média",
    dueDate: "Amanhã",
    assignee: "Beatriz Costa",
    assigneeInitials: "BC",
    progress: 80
  },
  {
    id: 4,
    client: "Advocacia Lima",
    title: "Guia Jurídico para Startups",
    status: "Aprovado",
    priority: "Baixa",
    dueDate: "22/12",
    assignee: "Ana Silva",
    assigneeInitials: "AS",
    progress: 100
  },
  {
    id: 5,
    client: "TechSolutions",
    title: "Otimização On-page Landing Page",
    status: "A Fazer",
    priority: "Alta",
    dueDate: "23/12",
    assignee: "Carlos Oliveira",
    assigneeInitials: "CO",
    progress: 0
  }
]

const teamLoad = [
  { name: "Ana Silva", tasks: 5, completed: 3, avatar: "AS" },
  { name: "Carlos Oliveira", tasks: 4, completed: 1, avatar: "CO" },
  { name: "Beatriz Costa", tasks: 3, completed: 2, avatar: "BC" },
]

export default function TasksPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Tarefas & Prazos</h2>
          <p className="text-muted-foreground">
            Controle a produção e entregas de todos os clientes em um só lugar.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>Nova Tarefa</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas em Aberto</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 iniciadas hoje</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-xs text-muted-foreground">Requer atenção imediata</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregas da Semana</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 para hoje</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <Progress value={85} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Main Task List */}
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle>Fila de Produção</CardTitle>
            <CardDescription>Tarefas prioritárias de todos os clientes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 h-2 w-2 rounded-full ${
                      task.status === 'Atrasado' ? 'bg-destructive' : 
                      task.status === 'Aprovado' ? 'bg-green-500' : 
                      task.status === 'Em Redação' ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="font-semibold text-primary">{task.client}</span>
                        <span>•</span>
                        <span>{task.assignee}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block w-24">
                      <div className={`text-sm font-medium ${task.status === 'Atrasado' ? 'text-destructive' : ''}`}>
                        {task.dueDate}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{task.status}</div>
                    </div>
                    <div className="w-20 flex justify-center">
                      <Badge variant={task.priority === 'Urgente' ? 'destructive' : 'secondary'} className="w-full justify-center">
                        {task.priority}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Load Widget */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Carga da Equipe</CardTitle>
            <CardDescription>Tarefas por membro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {teamLoad.map((member, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{member.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>{member.name}</span>
                      <span className="text-muted-foreground">{member.completed}/{member.tasks}</span>
                    </div>
                    <Progress value={(member.completed / member.tasks) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-semibold mb-2">Lembretes Rápidos</h4>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                <li>Reunião de pauta (Sexta, 14h)</li>
                <li>Enviar relatórios mensais (Dia 05)</li>
                <li>Renovar domínio EcoMarket</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
