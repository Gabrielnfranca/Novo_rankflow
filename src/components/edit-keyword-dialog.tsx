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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import { updateKeyword } from "@/app/actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface EditKeywordDialogProps {
  keyword: {
    id: number
    term: string
    url: string | null
    difficulty: string
    volume: string
    clientId?: string | null
  }
}

export function EditKeywordDialog({ keyword }: EditKeywordDialogProps) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const result = await updateKeyword(formData)
    if (result?.success) {
      setOpen(false)
      toast.success("Palavra-chave atualizada com sucesso!")
    } else {
      toast.error("Erro ao atualizar palavra-chave")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Palavra-Chave</DialogTitle>
          <DialogDescription>
            Edite as informações da palavra-chave.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 py-4">
          <input type="hidden" name="id" value={keyword.id} />
          <input type="hidden" name="clientId" value={keyword.clientId || ""} />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="term" className="text-right">
              Termo
            </Label>
            <Input id="term" name="term" defaultValue={keyword.term} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL Alvo
            </Label>
            <Input id="url" name="url" defaultValue={keyword.url || ""} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="volume" className="text-right">
              Volume
            </Label>
            <Input id="volume" name="volume" defaultValue={keyword.volume} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="difficulty" className="text-right">
              Dificuldade
            </Label>
            <div className="col-span-3">
                <Select name="difficulty" defaultValue={keyword.difficulty}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Easy">Fácil (Easy)</SelectItem>
                    <SelectItem value="Medium">Médio (Medium)</SelectItem>
                    <SelectItem value="Hard">Difícil (Hard)</SelectItem>
                </SelectContent>
                </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
