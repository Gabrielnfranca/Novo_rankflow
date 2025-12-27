"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { ClientNotifications } from "@/components/client-notifications"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DashboardShellProps {
  children: React.ReactNode
  clients?: { id: string; name: string; logo?: string }[]
  user?: { name: string; email: string; role?: string }
}

export function DashboardShell({ children, clients = [], user }: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background print:h-auto print:overflow-visible print:bg-white">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "relative z-20 hidden transition-all duration-300 md:block border-r print:hidden",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <AppSidebar 
          isCollapsed={isCollapsed} 
          onCollapse={() => setIsCollapsed(!isCollapsed)} 
          clients={clients}
          user={user}
        />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden bg-background/50 print:overflow-visible print:h-auto print:bg-white">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-md transition-all print:hidden">
          
          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <AppSidebar 
                  isCollapsed={false} 
                  clients={clients}
                  user={user}
                />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex-1">
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-foreground truncate">Visão Geral</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <ClientNotifications />
            <ModeToggle />
            <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium">{user?.name || "Usuário"}</span>
                <span className="text-xs text-muted-foreground">{user?.role || "Membro"}</span>
            </div>
            <Avatar className="h-8 w-8 md:h-9 md:w-9 border-2 border-primary/20">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=random`} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 print:overflow-visible print:h-auto print:p-0">
          <div className="mx-auto max-w-6xl space-y-6 md:space-y-8 print:max-w-none print:space-y-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
