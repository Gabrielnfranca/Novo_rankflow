"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Client = {
  id: string
  name: string
  logo?: string
}

interface ClientSwitcherProps {
  clients: Client[]
  isCollapsed: boolean
}

export function ClientSwitcher({ clients, isCollapsed }: ClientSwitcherProps) {
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(
    clients[0] || null
  )

  if (isCollapsed) {
    return (
      <div className="flex justify-center py-2">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={selectedClient?.logo} alt={selectedClient?.name} />
                        <AvatarFallback>{selectedClient?.name?.substring(0, 2).toUpperCase() || "CL"}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Clientes
                </DropdownMenuLabel>
                {clients.map((client) => (
                    <DropdownMenuItem
                        key={client.id}
                        onClick={() => setSelectedClient(client)}
                        className="gap-2 p-2"
                    >
                        <Avatar className="h-6 w-6 border">
                            <AvatarImage src={client.logo} alt={client.name} />
                            <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {client.name}
                        {selectedClient?.id === client.id && (
                            <Check className="ml-auto h-4 w-4" />
                        )}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md border bg-background">
                        <PlusCircle className="h-4 w-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">Adicionar Cliente</div>
                </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Selecionar cliente"
          className="w-full justify-between border-dashed border-sidebar-border bg-sidebar-accent/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <div className="flex items-center gap-2 truncate">
            <Avatar className="h-5 w-5">
                <AvatarImage src={selectedClient?.logo} alt={selectedClient?.name} />
                <AvatarFallback className="text-[10px]">{selectedClient?.name?.substring(0, 2).toUpperCase() || "CL"}</AvatarFallback>
            </Avatar>
            <span className="truncate text-xs">{selectedClient?.name || "Selecionar Cliente"}</span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] p-0" align="start">
        <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Meus Clientes
        </DropdownMenuLabel>
        <DropdownMenuGroup className="p-1">
            {clients.map((client) => (
            <DropdownMenuItem
                key={client.id}
                onSelect={() => setSelectedClient(client)}
                className="gap-2 text-xs"
            >
                <Avatar className="h-5 w-5 border">
                    <AvatarImage src={client.logo} alt={client.name} />
                    <AvatarFallback className="text-[10px]">{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {client.name}
                {selectedClient?.id === client.id && (
                <Check className="ml-auto h-3 w-3" />
                )}
            </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 p-2 text-xs">
          <PlusCircle className="h-4 w-4" />
          Adicionar novo cliente
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
