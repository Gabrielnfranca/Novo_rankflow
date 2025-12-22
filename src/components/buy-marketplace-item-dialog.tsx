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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { buyMarketplaceItem } from "@/app/actions/marketplace"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner" // Assuming sonner is installed or we can use simple alert for now if not

interface BuyDialogProps {
  item: {
    id: string
    domain: string
    price: number
  }
  clients: { id: string; name: string }[]
}

export function BuyMarketplaceItemDialog({ item, clients }: BuyDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedClient, setSelectedClient] = useState<string>("")
  const router = useRouter()

  async function onBuy() {
    if (!selectedClient) return
    setLoading(true)
    
    try {
      await buyMarketplaceItem(item.id, selectedClient)
      setOpen(false)
      router.refresh()
      // Optional: Show success message
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Comprar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Comprar Backlink: {item.domain}</DialogTitle>
          <DialogDescription>
            Selecione o cliente para o qual você está adquirindo este backlink.
            O valor de R$ {item.price.toFixed(2)} será registrado.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
           <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o Cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
           </Select>
        </div>
        <DialogFooter>
          <Button onClick={onBuy} disabled={loading || !selectedClient}>
            {loading ? "Processando..." : "Confirmar Compra"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
