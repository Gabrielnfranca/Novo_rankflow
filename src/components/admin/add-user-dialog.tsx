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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { createUser } from "@/app/actions/users"
import { toast } from "sonner"

export function AddUserDialog() {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const result = await createUser(formData)
    if (result?.success) {
      setOpen(false)
      toast.success("Usuário criado com sucesso!")
    } else {
      toast.error(result?.error || "Erro ao criar usuário")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>
            Crie um novo usuário para acessar o sistema.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" placeholder="Nome completo" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="email@exemplo.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Função</Label>
            <Select name="role" defaultValue="USER">
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="USER">Usuário (User)</SelectItem>
                    <SelectItem value="ADMIN">Administrador (Admin)</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Criar Usuário</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
