import "@/app/globals.css"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"
import { ShieldCheck, ArrowLeft } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
        <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                    <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Área Administrativa</h1>
                    <p className="text-xs text-muted-foreground">Gestão de Acesso e Usuários</p>
                </div>
            </div>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Dashboard
            </Link>
        </header>
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
            {children}
        </main>
        <Toaster />
    </div>
  )
}
