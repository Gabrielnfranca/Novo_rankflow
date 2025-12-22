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
import { Plus } from "lucide-react"
import { addKeyword } from "@/app/actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AddKeywordDialog({ clientId }: { clientId?: string }) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const result = await addKeyword(formData)
    if (result?.success) {
      setOpen(false)
    } else {
      alert("Erro ao adicionar")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Adicionar Palavra
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Palavra-Chave</DialogTitle>
          <DialogDescription>
            Adicione uma palavra-chave para monitorar o ranqueamento.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 py-4">
          <input type="hidden" name="clientId" value={clientId || ""} />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="term" className="text-right">
              Termo
            </Label>
            <Input id="term" name="term" placeholder="ex: agência seo" className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL Alvo
            </Label>
            <Input id="url" name="url" placeholder="https://..." className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="volume" className="text-right">
              Volume
            </Label>
            <Input id="volume" name="volume" placeholder="ex: 1.2k" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="difficulty" className="text-right">
              Dificuldade
            </Label>
            <div className="col-span-3">
                <Select name="difficulty" defaultValue="Medium">
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
