import { getMarketplaceItems } from "@/app/actions/marketplace"
import { getSidebarClients } from "@/app/actions"
import { AddMarketplaceItemDialog } from "@/components/add-marketplace-item-dialog"
import { MarketplaceView } from "@/components/marketplace-view"

export default async function MarketplacePage() {
  const [items, clients] = await Promise.all([
    getMarketplaceItems(),
    getSidebarClients()
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Marketplace de Backlinks</h2>
          <p className="text-muted-foreground">
            Gerencie seu inventário de sites parceiros e venda backlinks para seus clientes.
          </p>
        </div>
        <AddMarketplaceItemDialog />
      </div>

      <MarketplaceView items={items} clients={clients} />
    </div>
  )
}
