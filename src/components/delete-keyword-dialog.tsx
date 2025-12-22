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
import { deleteKeyword } from "@/app/actions"
import { toast } from "sonner"

interface DeleteKeywordDialogProps {
  keyword: {
    id: number
    term: string
    clientId?: string | null
  }
}

export function DeleteKeywordDialog({ keyword }: DeleteKeywordDialogProps) {
  const [open, setOpen] = useState(false)

  async function handleDelete() {
    const result = await deleteKeyword(keyword.id, keyword.clientId || undefined)
    if (result?.success) {
      setOpen(false)
      toast.success("Palavra-chave excluída com sucesso!")
    } else {
      toast.error("Erro ao excluir palavra-chave")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Excluir Palavra-Chave</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a palavra-chave &quot;{keyword.term}&quot;? Esta ação não pode ser desfeita.
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
