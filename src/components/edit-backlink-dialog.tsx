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
import { Loader2, Pencil } from "lucide-react"
import { updateBacklink } from "@/app/actions"
import { format } from "date-fns"

// Define a type for the backlink prop to avoid 'any'
interface Backlink {
  id: number
  domain: string
  status: string
  owner: string | null
  keyword: string | null
  volume: string | null
  intent: string | null
  h1: string | null
  title: string | null
  metaDescription: string | null
  anchorText: string | null
  driveUrl: string | null
  postUrl: string | null
  targetUrl: string | null
  dateSent: Date | null
  followUpDate: Date | null
  clientId: string | null
}

export function EditBacklinkDialog({ backlink, clientId }: { backlink: Backlink, clientId?: string }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    formData.append("id", backlink.id.toString())
    if (clientId) {
      formData.append("clientId", clientId)
    }

    const result = await updateBacklink(formData)

    if (result.success) {
      setOpen(false)
    } else {
      alert(result.error)
    }

    setIsLoading(false)
  }

  // Helper to format date for input type="date" (YYYY-MM-DD)
  const formatDateForInput = (date: Date | null) => {
    if (!date) return ""
    return format(new Date(date), "yyyy-MM-dd")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Editar">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Backlink</DialogTitle>
          <DialogDescription>
            Atualize o status, insira a URL publicada ou modifique outros detalhes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="domain">Domínio (Site Parceiro)</Label>
              <Input id="domain" name="domain" defaultValue={backlink.domain} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={backlink.status}>
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
              <Input id="owner" name="owner" defaultValue={backlink.owner || ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="followUpDate">Data para Cobrar</Label>
              <Input id="followUpDate" name="followUpDate" type="date" defaultValue={formatDateForInput(backlink.followUpDate)} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="keyword">Palavra-chave</Label>
              <Input id="keyword" name="keyword" defaultValue={backlink.keyword || ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="volume">Volume</Label>
              <Input id="volume" name="volume" defaultValue={backlink.volume || ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="intent">Intenção</Label>
              <Input id="intent" name="intent" defaultValue={backlink.intent || ""} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="targetUrl">URL Alvo (Seu Site)</Label>
            <Input id="targetUrl" name="targetUrl" defaultValue={backlink.targetUrl || ""} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="anchorText">Texto Âncora</Label>
            <Input id="anchorText" name="anchorText" defaultValue={backlink.anchorText || ""} />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label htmlFor="h1">H1</Label>
                <Input id="h1" name="h1" defaultValue={backlink.h1 || ""} />
             </div>
             <div className="grid gap-2">
                <Label htmlFor="title">Title Tag</Label>
                <Input id="title" name="title" defaultValue={backlink.title || ""} />
             </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea id="metaDescription" name="metaDescription" rows={2} defaultValue={backlink.metaDescription || ""} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="driveUrl">URL do Drive (Conteúdo)</Label>
            <Input id="driveUrl" name="driveUrl" defaultValue={backlink.driveUrl || ""} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dateSent">Data Envio Conteúdo</Label>
              <Input id="dateSent" name="dateSent" type="date" defaultValue={formatDateForInput(backlink.dateSent)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="postUrl">URL Publicada</Label>
              <Input id="postUrl" name="postUrl" placeholder="https://siteparceiro.com/post-publicado" defaultValue={backlink.postUrl || ""} />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
