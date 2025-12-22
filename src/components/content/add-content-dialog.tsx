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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar as CalendarIcon } from "lucide-react"
import { addContent } from "@/app/actions/content"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function AddContentDialog({ clientId }: { clientId: string }) {
  const [open, setOpen] = useState(false)
  const [deadline, setDeadline] = useState<Date>()
  const [pubDate, setPubDate] = useState<Date>()

  async function handleSubmit(formData: FormData) {
    if (deadline) formData.set("deadline", deadline.toISOString())
    if (pubDate) formData.set("publicationDate", pubDate.toISOString())
    
    const result = await addContent(formData)
    if (result?.success) {
      setOpen(false)
      toast.success("Conteúdo planejado com sucesso!")
      setDeadline(undefined)
      setPubDate(undefined)
    } else {
      toast.error("Erro ao planejar conteúdo")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Conteúdo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Planejar Novo Conteúdo</DialogTitle>
          <DialogDescription>
            Defina os detalhes do conteúdo para o redator.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 py-4">
          <input type="hidden" name="clientId" value={clientId} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="title">Título Interno *</Label>
                <Input id="title" name="title" placeholder="ex: Guia de SEO 2025" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="keyword">Palavra-Chave Principal</Label>
                <Input id="keyword" name="keyword" placeholder="ex: seo 2025" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="status">Status Inicial</Label>
                <Select name="status" defaultValue="IDEA">
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="IDEA">Ideia</SelectItem>
                        <SelectItem value="BRIEFING">Briefing</SelectItem>
                        <SelectItem value="WRITING">Redação</SelectItem>
                        <SelectItem value="REVIEW">Revisão</SelectItem>
                        <SelectItem value="SCHEDULED">Agendado</SelectItem>
                        <SelectItem value="PUBLISHED">Publicado</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="author">Responsável</Label>
                <Input id="author" name="author" placeholder="ex: Redator A" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="h1">H1 Sugerido</Label>
            <Input id="h1" name="h1" placeholder="ex: O Guia Definitivo de SEO para 2025" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label>Prazo de Entrega</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !deadline && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {deadline ? format(deadline, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={deadline}
                            onSelect={setDeadline}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="grid gap-2">
                <Label>Data de Publicação</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !pubDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {pubDate ? format(pubDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={pubDate}
                            onSelect={setPubDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input id="metaTitle" name="metaTitle" placeholder="Title tag para o Google (max 60 chars)" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea id="metaDescription" name="metaDescription" placeholder="Descrição para o Google (max 160 chars)" />
          </div>

          <DialogFooter>
            <Button type="submit">Salvar Planejamento</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
