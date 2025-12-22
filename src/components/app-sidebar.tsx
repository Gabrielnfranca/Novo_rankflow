"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  LineChart, 
  ClipboardList, 
  Link as LinkIcon, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  Map,
  Search,
  FileCode,
  ArrowLeft,
  ShoppingBag,
  FileText,
  ShieldCheck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// import { ClientSwitcher } from "@/components/client-switcher"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Clientes",
    href: "/dashboard/clients",
    icon: Users,
  },
  {
    title: "Rank Tracker",
    href: "/dashboard/rank-tracker",
    icon: LineChart,
  },
  {
    title: "Marketplace",
    href: "/dashboard/marketplace",
    icon: ShoppingBag,
  },
  {
    title: "Tarefas & Prazos",
    href: "/dashboard/tasks",
    icon: ClipboardList,
  },
  {
    title: "Backlinks",
    href: "/dashboard/backlinks",
    icon: LinkIcon,
  },
  {
    title: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar({ isCollapsed = false, onCollapse, clients = [] }: { isCollapsed?: boolean; onCollapse?: () => void; clients?: { id: string; name: string; logo?: string }[] }) {
  const pathname = usePathname()
  const router = useRouter()

  // Detect if we are in a client context
  // Regex matches /dashboard/clients/[clientId] where clientId is NOT 'new'
  const clientMatch = pathname.match(/^\/dashboard\/clients\/([^/]+)/)
  const isClientContext = clientMatch && clientMatch[1] !== 'new'
  const currentClientId = isClientContext ? clientMatch[1] : null
  const currentClient = currentClientId ? clients.find(c => c.id === currentClientId) : null

  const clientNavItems = currentClientId ? [
    {
      title: "Visão Geral",
      href: `/dashboard/clients/${currentClientId}`,
      icon: LayoutDashboard,
      exact: true
    },
    {
      title: "Roadmap SEO",
      href: `/dashboard/clients/${currentClientId}/roadmap`,
      icon: Map,
    },
    {
      title: "Palavras-chave",
      href: `/dashboard/clients/${currentClientId}/keywords`,
      icon: Search,
    },
    {
      title: "Backlinks",
      href: `/dashboard/clients/${currentClientId}/backlinks`,
      icon: LinkIcon,
    },
    {
      title: "SEO Técnico",
      href: `/dashboard/clients/${currentClientId}/technical`,
      icon: FileCode,
    },
    {
      title: "Conteúdo",
      href: `/dashboard/clients/${currentClientId}/content`,
      icon: FileText,
    },
    {
      title: "Configurações",
      href: `/dashboard/clients/${currentClientId}/settings`,
      icon: Settings,
    },
  ] : []

  const navItems = isClientContext ? clientNavItems : mainNavItems

  return (
    <div className={cn(
      "relative flex h-full flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
      isCollapsed ? "w-20 items-center" : "w-72"
    )}>
      {onCollapse && (
        <Button
          onClick={onCollapse}
          className="absolute -right-4 top-6 z-50 h-8 w-8 rounded-full border-2 border-sidebar p-0 shadow-md hidden md:flex items-center justify-center"
          variant="default"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      )}
      <div className={cn("flex h-16 items-center", isCollapsed ? "justify-center px-0" : "px-6")}>
        <Link href="/dashboard" className="flex items-center gap-3 font-bold text-2xl tracking-tight">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-primary-foreground shadow-lg shadow-primary/20">
            <LineChart className="h-6 w-6" />
          </div>
          {!isCollapsed && (
            <span className="text-sidebar-foreground font-bold text-xl animate-in fade-in duration-300">
              RankFlow
            </span>
          )}
        </Link>
      </div>
      
      <div className={cn("px-4 pb-2 mt-6", isCollapsed ? "px-2" : "")}>
        {isClientContext && currentClient && (
           isCollapsed ? (
             <div className="flex justify-center" title={currentClient.name}>
                <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 text-xs">
                  {currentClient.name.substring(0, 2).toUpperCase()}
                </div>
             </div>
           ) : (
             <div className="flex flex-col gap-1 animate-in fade-in duration-300">
                <span className="px-1 text-xs text-muted-foreground uppercase font-bold">Cliente Atual</span>
                <Select 
                  value={currentClientId || ""} 
                  onValueChange={(value) => router.push(`/dashboard/clients/${value}`)}
                >
                  <SelectTrigger className="w-full bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground h-9 font-medium">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
           )
        )}
      </div>

      <div className="flex-1 overflow-auto py-6 px-4 w-full">
        {!isCollapsed && (
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40 animate-in fade-in duration-300 flex justify-between items-center">
              <span>{isClientContext ? "Menu do Cliente" : "Menu Principal"}</span>
          </div>
        )}
        <nav className="grid items-start gap-2">
          {navItems.map((item, index) => {
            const isActive = 'exact' in item && item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href)

            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl py-3 text-sm font-medium transition-all duration-200",
                  isCollapsed 
                    ? "justify-center px-0" 
                    : "px-3",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:pl-4",
                  isCollapsed && !isActive && "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary-foreground" : "text-sidebar-foreground/40 group-hover:text-sidebar-accent-foreground")} />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            )
          })}
        </nav>
        
        {isClientContext && !isCollapsed && (
           <div className="mt-6 pt-6 border-t border-sidebar-border">
           </div>
        )}


      </div>
      <div className="p-4 w-full">
        {!isCollapsed ? (
          <div className="rounded-xl bg-sidebar-accent/50 p-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-xs font-medium text-sidebar-foreground/80">Sistema Operacional</p>
              </div>
              <p className="mt-1 text-xs text-sidebar-foreground/40">v1.0.0 (Beta)</p>
          </div>
        ) : (
          <div className="flex justify-center py-4">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Sistema Operacional" />
          </div>
        )}
        <Button 
          variant="ghost" 
          className={cn(
            "mt-4 w-full text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed ? "justify-center px-0" : "justify-start gap-2"
          )}
          title={isCollapsed ? "Sair da Conta" : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && "Sair da Conta"}
        </Button>
      </div>
    </div>
  )
}
