"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { deleteNotification } from "@/app/actions/notifications"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

interface DeleteNotificationDialogProps {
  notificationId: string
  title: string
}

export function DeleteNotificationDialog({ notificationId, title }: DeleteNotificationDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onDelete() {
    setLoading(true)
    const result = await deleteNotification(notificationId)

    if (result.success) {
      toast.success("Notificação removida com sucesso!")
      setOpen(false)
    } else {
      toast.error("Erro ao remover notificação.")
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Excluir Notificação</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a notificação <strong>{title}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={loading}>
            {loading ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
