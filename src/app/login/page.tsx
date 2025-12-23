"use client"

import { useActionState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { loginAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ShieldCheck } from "lucide-react"

function LoginForm() {
  const searchParams = useSearchParams()
  const isAdmin = searchParams.get("admin") === "true"
  const [state, action, isPending] = useActionState(loginAction, null)

  return (
    <Card className="w-full max-w-sm border-2 shadow-lg transition-all duration-300">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            {isAdmin ? (
               <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                  <ShieldCheck className="h-7 w-7" />
               </div>
            ) : (
               <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Loader2 className="h-7 w-7 animate-spin-slow" /> 
               </div>
            )}
          </div>
          <CardTitle className="text-2xl text-center">
            {isAdmin ? "Área Administrativa" : "Bem-vindo de volta"}
          </CardTitle>
          <CardDescription className="text-center">
            {isAdmin 
              ? "Insira suas credenciais de administrador." 
              : "Entre com seu email e senha para acessar."}
          </CardDescription>
        </CardHeader>
        <form action={action}>
          <input type="hidden" name="redirectTo" value={isAdmin ? "/admin" : "/dashboard"} />
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {state?.error && (
              <p className="text-sm text-red-500 text-center font-medium bg-red-50 p-2 rounded-md border border-red-100">
                {state.error}
              </p>
            )}
          </CardContent>
          <CardFooter className="pt-4">
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Autenticando...
                </>
              ) : (
                isAdmin ? "Acessar Painel Admin" : "Entrar na Plataforma"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Suspense fallback={<div className="w-full max-w-sm h-[400px] bg-card rounded-xl animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
