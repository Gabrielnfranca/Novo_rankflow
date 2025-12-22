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
import { Pencil, Calendar as CalendarIcon } from "lucide-react"
import { updateContent } from "@/app/actions/content"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ContentItem } from "@prisma/client"

interface EditContentDialogProps {
  item: ContentItem
}

export function EditContentDialog({ item }: EditContentDialogProps) {
  const [open, setOpen] = useState(false)
  const [deadline, setDeadline] = useState<Date | undefined>(item.deadline ? new Date(item.deadline) : undefined)
  const [pubDate, setPubDate] = useState<Date | undefined>(item.publicationDate ? new Date(item.publicationDate) : undefined)

  async function handleSubmit(formData: FormData) {
    if (deadline) formData.set("deadline", deadline.toISOString())
    if (pubDate) formData.set("publicationDate", pubDate.toISOString())
    
    const result = await updateContent(formData)
    if (result?.success) {
      setOpen(false)
      toast.success("Conteúdo atualizado com sucesso!")
    } else {
      toast.error("Erro ao atualizar conteúdo")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Conteúdo</DialogTitle>
          <DialogDescription>
            Edite os detalhes do conteúdo.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 py-4">
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="clientId" value={item.clientId} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="title">Título Interno *</Label>
                <Input id="title" name="title" defaultValue={item.title} required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="keyword">Palavra-Chave Principal</Label>
                <Input id="keyword" name="keyword" defaultValue={item.keyword || ""} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={item.status}>
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
                <Input id="author" name="author" defaultValue={item.author || ""} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="h1">H1 Sugerido</Label>
            <Input id="h1" name="h1" defaultValue={item.h1 || ""} />
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
            <Input id="metaTitle" name="metaTitle" defaultValue={item.metaTitle || ""} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea id="metaDescription" name="metaDescription" defaultValue={item.metaDescription || ""} />
          </div>

          <DialogFooter>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
