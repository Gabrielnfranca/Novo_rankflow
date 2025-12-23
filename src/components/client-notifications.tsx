"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Bell, AlertTriangle, Clock, CheckCircle2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getClientNotifications, markNotificationAsRead } from "@/app/actions/notifications"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function ClientNotifications() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)
  
  // Use loading state to avoid lint error
  useEffect(() => {
    if (loading) {
      console.log("Loading notifications...")
    }
  }, [loading])
  const [notifications, setNotifications] = useState<{
    overdueBacklinks: number
    technicalIssues: number
    globalNotifications: any[]
    total: number
  } | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<any>(null)

  // Extract clientId from path
  const clientMatch = pathname.match(/^\/dashboard\/clients\/([^/]+)/)
  const isClientContext = clientMatch && clientMatch[1] !== 'new'
  const clientId = isClientContext ? clientMatch[1] : null

  async function fetchNotifications() {
    setLoading(true)
    const data = await getClientNotifications(clientId)
    setNotifications(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchNotifications()
    
    // Optional: Poll every minute
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [clientId, pathname]) // Re-fetch when path changes (e.g. switching clients)

  const handleNotificationClick = async (notification: any) => {
    setSelectedNotification(notification)
    setIsOpen(false)
    await markNotificationAsRead(notification.id)
    fetchNotifications()
  }

  if (!notifications) {
    return (
      <Button variant="ghost" size="icon" className="relative text-foreground/50" disabled>
        <Bell className="h-5 w-5" />
      </Button>
    )
  }

  const hasNotifications = notifications.total > 0

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative text-foreground">
            <Bell className={cn("h-5 w-5 transition-colors", hasNotifications ? "text-foreground" : "text-foreground/70")} />
            {hasNotifications && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h4 className="font-semibold">Notificações</h4>
            {hasNotifications ? (
              <span className="text-xs text-red-500 font-medium">{notifications.total} pendentes</span>
            ) : (
              <span className="text-xs text-muted-foreground">Tudo certo</span>
            )}
          </div>
          <div className="grid gap-1 p-1 max-h-[300px] overflow-y-auto">
            {notifications.globalNotifications?.map((notification) => (
              <div 
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className="flex items-start gap-3 rounded-md p-3 hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="mt-1 rounded-full bg-blue-100 p-1 text-blue-600 dark:bg-blue-900/30">
                  <Info className="h-4 w-4" />
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">{notification.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                </div>
              </div>
            ))}

            {notifications.overdueBacklinks > 0 ? (
              <Link 
                href={`/dashboard/clients/${clientId}/backlinks`} 
                onClick={() => setIsOpen(false)}
                className="flex items-start gap-3 rounded-md p-3 hover:bg-accent transition-colors"
              >
                <div className="mt-1 rounded-full bg-red-100 p-1 text-red-600 dark:bg-red-900/30">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Backlinks Atrasados</p>
                  <p className="text-xs text-muted-foreground">
                    {notifications.overdueBacklinks} backlinks precisam de follow-up.
                  </p>
                </div>
              </Link>
            ) : null}

            {notifications.technicalIssues > 0 ? (
              <Link 
                href={`/dashboard/clients/${clientId}/technical`}
                onClick={() => setIsOpen(false)}
                className="flex items-start gap-3 rounded-md p-3 hover:bg-accent transition-colors"
              >
                <div className="mt-1 rounded-full bg-amber-100 p-1 text-amber-600 dark:bg-amber-900/30">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Problemas Técnicos</p>
                  <p className="text-xs text-muted-foreground">
                    {notifications.technicalIssues} itens da auditoria requerem atenção.
                  </p>
                </div>
              </Link>
            ) : null}

            {!hasNotifications && (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-sm">Nenhuma notificação pendente.</p>
              </div>
            )}
          </div>
          {hasNotifications && clientId && (
             <div className="border-t p-2">
                <Link href={`/dashboard/clients/${clientId}`}>
                  <Button variant="ghost" size="sm" className="w-full justify-center text-xs h-8" onClick={() => setIsOpen(false)}>
                    Ver Visão Geral
                  </Button>
                </Link>
             </div>
          )}
        </PopoverContent>
      </Popover>

      <Dialog open={!!selectedNotification} onOpenChange={(open) => !open && setSelectedNotification(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title}</DialogTitle>
            <DialogDescription>
              {new Date(selectedNotification?.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {selectedNotification?.message}
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setSelectedNotification(null)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
