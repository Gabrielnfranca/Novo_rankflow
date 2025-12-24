import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Calendar, MoreHorizontal } from "lucide-react"
import { getAllContentItems } from "@/app/actions/content"

const columns = [
  { id: "IDEA", title: "Ideias", color: "bg-gray-100 border-gray-200" },
  { id: "BRIEFING", title: "Briefing", color: "bg-blue-50 border-blue-100" },
  { id: "WRITING", title: "Redação", color: "bg-yellow-50 border-yellow-100" },
  { id: "REVIEW", title: "Revisão", color: "bg-purple-50 border-purple-100" },
  { id: "PUBLISHED", title: "Publicado", color: "bg-green-50 border-green-100" },
]

export default async function ContentPlannerPage() {
  const items = await getAllContentItems()

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Content Planner</h2>
          <p className="text-muted-foreground">Gerencie a produção de conteúdo do seu blog.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Nova Pauta
        </Button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex h-full min-w-[1200px] gap-6">
          {columns.map((col) => (
            <div key={col.id} className="flex h-full w-80 flex-col rounded-xl bg-muted/30 border border-muted/60 p-3">
              <div className={`mb-4 flex items-center justify-between rounded-lg border px-3 py-3 ${col.color}`}>
                <span className="font-semibold text-sm text-foreground/80">{col.title}</span>
                <Badge variant="secondary" className="bg-white/80 text-xs font-bold shadow-sm">
                  {items.filter(t => t.status === col.id).length}
                </Badge>
              </div>
              
              <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
                {items.filter(t => t.status === col.id).map(item => (
                  <Card key={item.id} className="cursor-grab hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-none shadow-sm">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-semibold leading-snug text-foreground/90">{item.title}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                           {item.client?.name && (
                               <Badge variant="outline" className="text-xs">
                                   {item.client.name}
                               </Badge>
                           )}
                        </div>
                        {item.author && (
                          <Avatar className="h-6 w-6 text-[10px] border border-background">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {item.author.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      
                      {item.deadline && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground/70 text-sm h-10 hover:bg-background/50 hover:text-primary border border-transparent hover:border-dashed hover:border-primary/30">
                  <Plus className="h-3 w-3" />
                  Adicionar Tarefa
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
