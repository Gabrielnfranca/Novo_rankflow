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
import { updateMarketplaceItem } from "@/app/actions/marketplace"
import { toast } from "sonner"
import { Pencil } from "lucide-react"

interface EditMarketplaceItemDialogProps {
  item: {
    id: string
    domain: string
    dr: number | null
    price: number
    niche: string | null
    description: string | null
    traffic: string | null
    status: string
  }
}

export function EditMarketplaceItemDialog({ item }: EditMarketplaceItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const result = await updateMarketplaceItem(item.id, formData)

    if (result.success) {
      toast.success("Item atualizado com sucesso!")
      setOpen(false)
    } else {
      toast.error("Erro ao atualizar item.")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Item</DialogTitle>
          <DialogDescription>
            Atualize as informações do item no marketplace.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="domain" className="text-right">
                Domínio
              </Label>
              <Input
                id="domain"
                name="domain"
                defaultValue={item.domain}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dr" className="text-right">
                DR
              </Label>
              <Input
                id="dr"
                name="dr"
                type="number"
                defaultValue={item.dr || 0}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Preço (R$)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={item.price}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="niche" className="text-right">
                Nicho
              </Label>
              <Input
                id="niche"
                name="niche"
                defaultValue={item.niche || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="traffic" className="text-right">
                Tráfego
              </Label>
              <Input
                id="traffic"
                name="traffic"
                defaultValue={item.traffic || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select name="status" defaultValue={item.status}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Disponível</SelectItem>
                  <SelectItem value="Sold">Vendido</SelectItem>
                  <SelectItem value="Inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={item.description || ""}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
