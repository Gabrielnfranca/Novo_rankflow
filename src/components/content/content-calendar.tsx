"use client"

import { ContentItem } from "@prisma/client"
import { useState } from "react"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ContentCalendarProps {
  items: ContentItem[]
}

export function ContentCalendar({ items }: ContentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const firstDayOfMonth = startOfMonth(currentMonth)
  const lastDayOfMonth = endOfMonth(currentMonth)
  const startDate = startOfWeek(firstDayOfMonth)
  const endDate = endOfWeek(lastDayOfMonth)

  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const getItemsForDay = (date: Date) => {
    return items.filter(item => {
        // Check publication date first, then deadline
        const targetDate = item.publicationDate || item.deadline
        return targetDate && isSameDay(targetDate, date)
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
        case "PUBLISHED": return "bg-green-100 text-green-800 hover:bg-green-200"
        case "SCHEDULED": return "bg-orange-100 text-orange-800 hover:bg-orange-200"
        case "REVIEW": return "bg-purple-100 text-purple-800 hover:bg-purple-200"
        case "WRITING": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
        default: return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden border">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
          <div key={day} className="bg-background p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        
        {days.map((day) => {
            const dayItems = getItemsForDay(day)
            const isCurrentMonth = isSameMonth(day, currentMonth)

            return (
                <div 
                    key={day.toString()} 
                    className={`bg-background min-h-[120px] p-2 transition-colors hover:bg-muted/50 ${
                        !isCurrentMonth ? "bg-muted/20 text-muted-foreground" : ""
                    }`}
                >
                    <div className={`text-right text-sm mb-2 ${isSameDay(day, new Date()) ? "font-bold text-primary" : ""}`}>
                        {format(day, "d")}
                    </div>
                    <div className="space-y-1">
                        {dayItems.map(item => (
                            <div 
                                key={item.id} 
                                className={`text-[10px] p-1 rounded truncate cursor-pointer ${getStatusColor(item.status)}`}
                                title={item.title}
                            >
                                {item.title}
                            </div>
                        ))}
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  )
}
