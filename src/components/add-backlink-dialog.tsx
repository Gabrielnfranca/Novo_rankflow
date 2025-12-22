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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from "lucide-react"
import { addBacklink } from "@/app/actions"

export function AddBacklinkDialog({ clientId }: { clientId?: string }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // const { toast } = useToast() // Assuming toast hook exists or I'll skip it for now

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    if (clientId) {
      formData.append("clientId", clientId)
    }

    const result = await addBacklink(formData)

    if (result.success) {
      setOpen(false)
      // toast({ title: "Backlink adicionado com sucesso" })
    } else {
      alert(result.error) // Fallback
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Backlink
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Backlink</DialogTitle>
          <DialogDescription>
            Preencha os detalhes da prospecção ou link building.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="domain">Domínio (Site Parceiro)</Label>
              <Input id="domain" name="domain" placeholder="ex: siteparceiro.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue="Prospecting">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Prospecting">Prospecção</SelectItem>
                  <SelectItem value="Negotiating">Negociação</SelectItem>
                  <SelectItem value="Content Sent">Conteúdo Enviado</SelectItem>
                  <SelectItem value="Published">Publicado</SelectItem>
                  <SelectItem value="Rejected">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="owner">Responsável</Label>
              <Input id="owner" name="owner" placeholder="Nome do responsável" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="followUpDate">Data para Cobrar</Label>
              <Input id="followUpDate" name="followUpDate" type="date" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="keyword">Palavra-chave</Label>
              <Input id="keyword" name="keyword" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="volume">Volume</Label>
              <Input id="volume" name="volume" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="intent">Intenção</Label>
              <Input id="intent" name="intent" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="targetUrl">URL Alvo (Seu Site)</Label>
            <Input id="targetUrl" name="targetUrl" placeholder="https://seusite.com/pagina-alvo" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="anchorText">Texto Âncora</Label>
            <Input id="anchorText" name="anchorText" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label htmlFor="h1">H1</Label>
                <Input id="h1" name="h1" />
             </div>
             <div className="grid gap-2">
                <Label htmlFor="title">Title Tag</Label>
                <Input id="title" name="title" />
             </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea id="metaDescription" name="metaDescription" rows={2} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="driveUrl">URL do Drive (Conteúdo)</Label>
            <Input id="driveUrl" name="driveUrl" placeholder="https://docs.google.com/..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dateSent">Data Envio Conteúdo</Label>
              <Input id="dateSent" name="dateSent" type="date" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="postUrl">URL Publicada</Label>
              <Input id="postUrl" name="postUrl" placeholder="https://siteparceiro.com/post-publicado" />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Backlink
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
