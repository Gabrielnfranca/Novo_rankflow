"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { ptBR } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DashboardDateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const from = searchParams.get("from")
  const to = searchParams.get("to")

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: from ? new Date(from + 'T00:00:00') : addDays(new Date(), -28),
    to: to ? new Date(to + 'T00:00:00') : new Date(),
  })

  const onSelect = (newDate: DateRange | undefined) => {
    setDate(newDate)
    
    if (newDate?.from && newDate?.to) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("from", format(newDate.from, "yyyy-MM-dd"))
      params.set("to", format(newDate.to, "yyyy-MM-dd"))
      router.push(`${pathname}?${params.toString()}`)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd 'de' MMM, yyyy", { locale: ptBR })} -{" "}
                  {format(date.to, "dd 'de' MMM, yyyy", { locale: ptBR })}
                </>
              ) : (
                format(date.from, "dd 'de' MMM, yyyy", { locale: ptBR })
              )
            ) : (
              <span>Selecione o período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onSelect}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
