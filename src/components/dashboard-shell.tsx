"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { ClientNotifications } from "@/components/client-notifications"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface DashboardShellProps {
  children: React.ReactNode
  clients?: { id: string; name: string; logo?: string }[]
}

export function DashboardShell({ children, clients = [] }: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "relative z-20 hidden transition-all duration-300 md:block border-r",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <AppSidebar 
          isCollapsed={isCollapsed} 
          onCollapse={() => setIsCollapsed(!isCollapsed)} 
          clients={clients}
        />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden bg-background/50">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-md transition-all">
          
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Visão Geral</h1>
          </div>
          <div className="flex items-center gap-4">
            <ClientNotifications />
            <ModeToggle />
            <div className="flex flex-col items-end">
                <span className="text-sm font-medium">Especialista SEO</span>
                <span className="text-xs text-muted-foreground">Plano Pro</span>
            </div>
            <Avatar className="h-9 w-9 border-2 border-primary/20">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
