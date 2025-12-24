import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CalendarClock, CheckCircle2, AlertCircle, Clock, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getAllContentTasks } from "@/app/actions/content"

export default async function TasksPage() {
  const tasks = await getAllContentTasks()

  // Calculate KPIs
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.column === 'Done').length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  // Mock logic for "started today" or "due today" since we don't have full fields in ContentTask yet
  // We will just show 0 for now or use createdAt
  const tasksToday = tasks.filter(t => {
    const date = new Date(t.createdAt)
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }).length

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
            <div className="text-2xl font-bold">{totalTasks - completedTasks}</div>
            <p className="text-xs text-muted-foreground">{tasksToday} criadas hoje</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prioridade Alta</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
                {tasks.filter(t => t.priority === 'High' && t.column !== 'Done').length}
            </div>
            <p className="text-xs text-muted-foreground">Requer atenção</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregas da Semana</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Em breve</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Main Task List */}
        <Card className="md:col-span-7">
          <CardHeader>
            <CardTitle>Fila de Produção</CardTitle>
            <CardDescription>Tarefas prioritárias de todos os clientes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                      Nenhuma tarefa encontrada.
                  </div>
              ) : (
                  tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 h-2 w-2 rounded-full ${
                          task.column === 'Done' ? 'bg-green-500' : 
                          task.column === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'
                        }`} />
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="font-semibold text-primary">{task.client?.name || "Sem Cliente"}</span>
                            <span>•</span>
                            <span>{task.assignee || "Sem responsável"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block w-24">
                          <div className="text-sm font-medium">
                            {task.dueDate || "-"}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{task.column}</div>
                        </div>
                        <div className="w-20 flex justify-center">
                          <Badge variant={task.priority === 'High' ? 'destructive' : 'secondary'} className="w-full justify-center">
                            {task.priority}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
