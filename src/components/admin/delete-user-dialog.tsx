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
import { Trash2 } from "lucide-react"
import { deleteUser } from "@/app/actions/users"
import { toast } from "sonner"

interface DeleteUserDialogProps {
  userId: string
  userName: string
}

export function DeleteUserDialog({ userId, userName }: DeleteUserDialogProps) {
  const [open, setOpen] = useState(false)

  async function handleDelete() {
    const result = await deleteUser(userId)
    if (result?.success) {
      setOpen(false)
      toast.success("Usuário excluído com sucesso!")
    } else {
      toast.error("Erro ao excluir usuário")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" title="Excluir Usuário">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Excluir Usuário</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o usuário <strong>{userName}</strong>? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
