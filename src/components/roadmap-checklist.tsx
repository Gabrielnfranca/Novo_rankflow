"use client"

import { useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ROADMAP_DATA } from "@/lib/roadmap-data"
import { toggleRoadmapTask } from "@/app/actions/roadmap"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface RoadmapChecklistProps {
  clientId: string
  completedTasks: string[] // Array of taskKeys that are completed
}

export function RoadmapChecklist({ clientId, completedTasks: initialCompletedTasks }: RoadmapChecklistProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(initialCompletedTasks))
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleToggle = async (taskKey: string) => {
    if (isLoading) return

    const isCompleted = completedTasks.has(taskKey)
    setIsLoading(taskKey)

    // Optimistic update
    const newSet = new Set(completedTasks)
    if (isCompleted) {
      newSet.delete(taskKey)
    } else {
      newSet.add(taskKey)
    }
    setCompletedTasks(newSet)

    try {
      await toggleRoadmapTask(clientId, taskKey, isCompleted)
    } catch (error) {
      // Revert on error
      setCompletedTasks(new Set(initialCompletedTasks))
      console.error(error)
    } finally {
      setIsLoading(null)
    }
  }

  // Calculate progress
  const totalTasks = ROADMAP_DATA.reduce((acc, step) => acc + step.tasks.length, 0)
  const completedCount = completedTasks.size
  const progressPercentage = Math.round((completedCount / totalTasks) * 100)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Progresso Geral</CardTitle>
            <span className="text-sm font-medium text-muted-foreground">
              {progressPercentage}% Concluído
            </span>
          </div>
          <CardDescription>
            {completedCount} de {totalTasks} tarefas finalizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="h-2" />
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="setup">
        {ROADMAP_DATA.map((step, index) => {
          const stepCompletedCount = step.tasks.filter(t => completedTasks.has(t.id)).length
          const stepTotal = step.tasks.length
          const isStepComplete = stepCompletedCount === stepTotal

          return (
            <AccordionItem key={step.id} value={step.id} className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-4 w-full">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                    isStepComplete 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-primary/10 text-primary"
                  )}>
                    {isStepComplete ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-base">{step.title}</span>
                    <span className="text-xs text-muted-foreground font-normal hidden sm:inline-block">
                      {step.description}
                    </span>
                  </div>
                  <div className="ml-auto mr-4 text-xs text-muted-foreground font-normal">
                    {stepCompletedCount}/{stepTotal}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <div className="grid gap-2 pl-12 pr-4">
                  {step.tasks.map((task) => {
                    const isTaskCompleted = completedTasks.has(task.id)
                    return (
                      <div 
                        key={task.id} 
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-md transition-colors cursor-pointer border border-transparent",
                          isTaskCompleted ? "bg-muted/50" : "hover:bg-muted hover:border-border"
                        )}
                        onClick={() => handleToggle(task.id)}
                      >
                        <div className={cn(
                          "mt-0.5 h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                          isTaskCompleted 
                            ? "bg-primary border-primary text-primary-foreground" 
                            : "border-muted-foreground/30"
                        )}>
                          {isTaskCompleted && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </div>
                        <div className="space-y-1">
                          <p className={cn(
                            "text-sm font-medium leading-none",
                            isTaskCompleted && "text-muted-foreground line-through"
                          )}>
                            {task.label}
                          </p>
                          {task.description && (
                            <p className="text-xs text-muted-foreground">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
