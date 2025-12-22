"use client"

import { ContentItem } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Calendar, User } from "lucide-react"

import { EditContentDialog } from "./edit-content-dialog"
import { DeleteContentDialog } from "./delete-content-dialog"

interface ContentBoardProps {
  items: ContentItem[]
  clientId: string
}

const COLUMNS = [
  { id: "IDEA", title: "Ideias", color: "bg-gray-100/50 border-gray-200" },
  { id: "BRIEFING", title: "Briefing", color: "bg-blue-50/50 border-blue-100" },
  { id: "WRITING", title: "Redação", color: "bg-yellow-50/50 border-yellow-100" },
  { id: "REVIEW", title: "Revisão", color: "bg-purple-50/50 border-purple-100" },
  { id: "SCHEDULED", title: "Agendado", color: "bg-orange-50/50 border-orange-100" },
  { id: "PUBLISHED", title: "Publicado", color: "bg-green-50/50 border-green-100" },
]

export function ContentBoard({ items }: ContentBoardProps) {
  // Function to get deadline status color
  const getDeadlineStatus = (deadline: Date | null) => {
    if (!deadline) return "text-muted-foreground"
    const now = new Date()
    const diffTime = deadline.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "text-red-500 font-bold" // Overdue
    if (diffDays <= 2) return "text-orange-500 font-bold" // Warning
    return "text-muted-foreground"
  }

  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((column) => {
        const columnItems = items.filter((item) => item.status === column.id)
        
        return (
          <div key={column.id} className={`flex-shrink-0 w-80 flex flex-col rounded-lg border ${column.color} p-4`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider">{column.title}</h3>
              <Badge variant="secondary" className="bg-white/50">{columnItems.length}</Badge>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-250px)]">
              {columnItems.map((item) => (
                <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow bg-white group">
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                            <span className="font-medium text-sm leading-tight">{item.title}</span>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <EditContentDialog item={item} />
                                <DeleteContentDialog item={item} />
                            </div>
                        </div>
                        {item.keyword && (
                            <p className="text-xs text-muted-foreground">KW: {item.keyword}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        {item.author ? (
                            <div className="flex items-center gap-1 text-muted-foreground" title={`Responsável: ${item.author}`}>
                                <User className="h-3 w-3" />
                                <span className="truncate max-w-[80px]">{item.author}</span>
                            </div>
                        ) : <span></span>}
                        
                        {item.deadline && (
                            <div className={`flex items-center gap-1 ${getDeadlineStatus(item.deadline)}`} title="Prazo">
                                <Calendar className="h-3 w-3" />
                                <span>{format(item.deadline, "dd/MM")}</span>
                            </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {columnItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-xs border-2 border-dashed border-gray-200 rounded-lg">
                    Vazio
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
