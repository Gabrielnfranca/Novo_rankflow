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
import { KeyRound } from "lucide-react"
import { resetPassword } from "@/app/actions/users"
import { toast } from "sonner"

interface ResetPasswordDialogProps {
  userId: string
  userName: string
}

export function ResetPasswordDialog({ userId, userName }: ResetPasswordDialogProps) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const result = await resetPassword(formData)
    if (result?.success) {
      setOpen(false)
      toast.success("Senha resetada com sucesso!")
    } else {
      toast.error(result?.error || "Erro ao resetar senha")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Resetar Senha">
          <KeyRound className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Resetar Senha</DialogTitle>
          <DialogDescription>
            Defina uma nova senha para o usuário <strong>{userName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 py-4">
          <input type="hidden" name="id" value={userId} />
          <div className="grid gap-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input id="newPassword" name="newPassword" type="password" required />
          </div>
          <DialogFooter>
            <Button type="submit">Salvar Nova Senha</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
