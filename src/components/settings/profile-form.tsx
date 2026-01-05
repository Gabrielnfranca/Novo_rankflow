"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { updateProfile } from "@/app/actions/user"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface ProfileFormProps {
  user: {
    name: string
    email: string
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    const res = await updateProfile(formData)
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
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Perfil</CardTitle>
        <CardDescription>
          Atualize suas informações pessoais de identificação.
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input 
              id="name" 
              name="name" 
              defaultValue={user.name} 
              placeholder="Seu nome" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              defaultValue={user.email} 
              placeholder="seu@email.com" 
              required 
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
