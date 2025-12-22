import { getContentItems } from "@/app/actions/content"
import { AddContentDialog } from "@/components/content/add-content-dialog"
import { ContentBoard } from "@/components/content/content-board"
import { ContentCalendar } from "@/components/content/content-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Kanban, Calendar as CalendarIcon } from "lucide-react"

export default async function ContentPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const items = await getContentItems(clientId)

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Planejador de Conteúdo</h2>
          <p className="text-muted-foreground">
            Gerencie o fluxo de produção, prazos e publicações.
          </p>
        </div>
        <AddContentDialog clientId={clientId} />
      </div>

      <Tabs defaultValue="board" className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <TabsList>
                <TabsTrigger value="board" className="gap-2">
                    <Kanban className="h-4 w-4" />
                    Quadro
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Calendário
                </TabsTrigger>
            </TabsList>
        </div>

        <TabsContent value="board" className="flex-1 overflow-hidden">
            <ContentBoard items={items} clientId={clientId} />
        </TabsContent>
        
        <TabsContent value="calendar" className="flex-1 overflow-y-auto">
            <ContentCalendar items={items} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
