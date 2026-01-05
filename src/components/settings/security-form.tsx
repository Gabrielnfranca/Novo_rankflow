"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { updatePassword } from "@/app/actions/user"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function SecurityForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    const res = await updatePassword(formData)
    setIsLoading(false)

    if (res.error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: res.error,
      })
    } else {
      toast({
        title: "Sucesso",
        description: res.success,
      })
      // Optional: Reset form
      const form = document.getElementById("security-form") as HTMLFormElement
      form?.reset()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segurança da Conta</CardTitle>
        <CardDescription>
          Atualize sua senha para manter sua conta segura.
        </CardDescription>
      </CardHeader>
      <form id="security-form" action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <Input 
              id="currentPassword" 
              name="currentPassword" 
              type="password" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input 
              id="newPassword" 
              name="newPassword" 
              type="password" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input 
              id="confirmPassword" 
              name="confirmPassword" 
              type="password" 
              required 
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Atualizar Senha
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
