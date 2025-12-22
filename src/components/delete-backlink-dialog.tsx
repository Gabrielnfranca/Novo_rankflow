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
import { Loader2, Trash2 } from "lucide-react"
import { deleteBacklink } from "@/app/actions"

export function DeleteBacklinkDialog({ backlinkId, clientId }: { backlinkId: number, clientId?: string }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function onDelete() {
    setIsLoading(true)
    const result = await deleteBacklink(backlinkId, clientId)
    if (result.success) {
      setOpen(false)
    } else {
      alert(result.error)
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" title="Excluir">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Backlink</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir este backlink? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
