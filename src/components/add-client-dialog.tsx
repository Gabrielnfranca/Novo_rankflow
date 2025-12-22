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
import { Plus, Search, Loader2 } from "lucide-react"
import { addClient } from "@/app/actions"

export function AddClientDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cnpj, setCnpj] = useState("")
  
  // Form states for auto-fill
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [annualRevenue, setAnnualRevenue] = useState("")

  async function handleSearchCNPJ() {
    if (!cnpj) return
    
    const cleanCNPJ = cnpj.replace(/\D/g, "")
    if (cleanCNPJ.length !== 14) {
      alert("CNPJ inválido. Digite 14 números.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCNPJ}`)
      if (!response.ok) throw new Error("CNPJ não encontrado")
      
      const data = await response.json()
      
      setName(data.nome_fantasia || data.razao_social || "")
      setPhone(data.ddd_telefone_1 || "")
      setEmail(data.email || "")
      
      const fullAddress = `${data.logradouro}, ${data.numero} - ${data.bairro}, ${data.municipio} - ${data.uf}`
      setAddress(fullAddress)
      
      // BrasilAPI returns capital_social, which we can use as a proxy or initial value for annual revenue estimation
      if (data.capital_social) {
         setAnnualRevenue(data.capital_social.toString())
      }

    } catch (error) {
      console.error(error)
      alert("Erro ao buscar CNPJ. Verifique o número e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(formData: FormData) {
    const result = await addClient(formData)
    if (result?.success) {
      setOpen(false)
      // Reset form
      setCnpj("")
      setName("")
      setPhone("")
      setEmail("")
      setAddress("")
      setAnnualRevenue("")
    } else {
      alert("Erro ao adicionar cliente")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
          <DialogDescription>
            Cadastre um novo cliente. Use o CNPJ para preencher automaticamente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
            {/* CNPJ Search */}
            <div className="flex items-end gap-2">
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="cnpj">Buscar por CNPJ</Label>
                    <Input 
                        id="cnpj" 
                        name="cnpj" 
                        placeholder="00.000.000/0000-00" 
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                    />
                </div>
                <Button type="button" onClick={handleSearchCNPJ} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Ou preencha manualmente
                    </span>
                </div>
            </div>

            <form action={handleSubmit} className="grid gap-4">
                {/* Hidden CNPJ field to send to server */}
                <input type="hidden" name="cnpj" value={cnpj} />

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="name">Nome da Empresa *</Label>
                        <Input 
                            id="name" 
                            name="name" 
                            required 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="url">Site (URL)</Label>
                        <Input id="url" name="url" placeholder="https://..." />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="email">Email de Contato</Label>
                        <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input 
                            id="phone" 
                            name="phone" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                        />
                    </div>
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input 
                        id="address" 
                        name="address" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="monthlyValue">Valor Mensal (R$)</Label>
                        <Input id="monthlyValue" name="monthlyValue" type="number" step="0.01" placeholder="0.00" />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="annualRevenue">Faturamento Anual (Estimado)</Label>
                        <Input 
                            id="annualRevenue" 
                            name="annualRevenue" 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            value={annualRevenue}
                            onChange={(e) => setAnnualRevenue(e.target.value)}
                        />
                        <p className="text-[10px] text-muted-foreground">Preenchido com Capital Social se disponível</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="contractDuration">Duração do Contrato</Label>
                        <Input id="contractDuration" name="contractDuration" placeholder="Ex: 12 meses" />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="startDate">Data de Início</Label>
                        <Input id="startDate" name="startDate" type="date" />
                    </div>
                </div>

                <div className="grid gap-1.5">
                    <Label htmlFor="notes">Notas / Observações</Label>
                    <Input id="notes" name="notes" placeholder="Informações adicionais..." />
                </div>
                
                <div className="grid gap-1.5">
                    <Label htmlFor="color">Cor de Identificação</Label>
                    <Input id="color" name="color" type="color" className="h-10 w-full" defaultValue="#000000" />
                </div>

                <DialogFooter className="mt-4">
                    <Button type="submit" className="w-full">Salvar Cliente</Button>
                </DialogFooter>
            </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
