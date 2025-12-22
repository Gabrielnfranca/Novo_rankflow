"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface BuyViaWhatsappProps {
  item: {
    domain: string
    price: number
  }
  variant?: "default" | "icon"
}

export function BuyViaWhatsapp({ item, variant = "default" }: BuyViaWhatsappProps) {
  // TODO: Configurar o número de telefone correto aqui
  const phoneNumber = "5511988605459" 
  const message = encodeURIComponent(`Olá, tenho interesse em comprar o backlink do domínio: ${item.domain} (R$ ${item.price.toFixed(2)})`)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  if (variant === "icon") {
    return (
      <Button 
        asChild 
        size="icon" 
        variant="ghost"
        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
        title="Comprar via WhatsApp"
      >
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-4 w-4" />
          <span className="sr-only">Comprar via WhatsApp</span>
        </a>
      </Button>
    )
  }

  return (
    <Button 
      asChild 
      className="w-full bg-green-600 hover:bg-green-700 text-white"
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="mr-2 h-4 w-4" />
        Comprar
      </a>
    </Button>
  )
}
