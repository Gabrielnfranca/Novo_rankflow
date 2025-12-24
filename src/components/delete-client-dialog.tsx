"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
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
import { deleteClient } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"

interface DeleteClientDialogProps {
  clientId: string
  clientName: string
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DeleteClientDialog({ clientId, clientName, trigger, open, onOpenChange }: DeleteClientDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const { toast } = useToast()

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  const handleDelete = async () => {
    setIsPending(true)
    try {
      const result = await deleteClient(clientId)
      if (result.success) {
        toast({
          title: "Cliente excluído",
          description: "O cliente foi removido com sucesso.",
        })
        handleOpenChange(false)
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao excluir cliente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open !== undefined ? open : isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Cliente</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o cliente <strong>{clientName}</strong>? 
            Esta ação não pode ser desfeita e removerá todos os dados associados (keywords, backlinks, etc).
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
