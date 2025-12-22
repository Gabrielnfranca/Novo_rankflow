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
import { deleteContent } from "@/app/actions/content"
import { toast } from "sonner"
import { ContentItem } from "@prisma/client"

interface DeleteContentDialogProps {
  item: ContentItem
}

export function DeleteContentDialog({ item }: DeleteContentDialogProps) {
  const [open, setOpen] = useState(false)

  async function handleDelete() {
    const result = await deleteContent(item.id, item.clientId)
    if (result?.success) {
      setOpen(false)
      toast.success("Conteúdo excluído com sucesso!")
    } else {
      toast.error("Erro ao excluir conteúdo")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50">
          <Trash2 className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Excluir Conteúdo</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir "{item.title}"? Esta ação não pode ser desfeita.
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
