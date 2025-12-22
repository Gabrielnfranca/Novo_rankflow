import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { RoadmapChecklist } from "@/components/roadmap-checklist"

export default async function RoadmapPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      roadmapTasks: {
        where: { status: "COMPLETED" },
        select: { taskKey: true }
      }
    }
  })

  if (!client) {
    return notFound()
  }

  const completedTasks = client.roadmapTasks.map(t => t.taskKey)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Roadmap SEO</h2>
        <p className="text-muted-foreground">
          Acompanhe o progresso da implementação do projeto.
        </p>
      </div>
      
      <RoadmapChecklist clientId={client.id} completedTasks={completedTasks} />
    </div>
  )
}
