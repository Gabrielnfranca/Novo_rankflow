import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { prisma } from "@/lib/prisma"
import { GoogleSettings } from "@/components/google-integration/google-settings"

export default async function SettingsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: {
      id: true,
      name: true,
      url: true,
      googleRefreshToken: true,
      gscUrl: true,
      ga4PropertyId: true
    }
  });

  if (!client) {
    return <div>Cliente não encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações do Cliente</h2>
        <p className="text-muted-foreground">
          Gerencie as informações e integrações deste projeto.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
          <CardDescription>Dados básicos do cliente e do projeto.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Cliente</Label>
            <Input id="name" defaultValue={client.name} placeholder="Nome da empresa" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url">URL do Site</Label>
            <Input id="url" defaultValue={client.url || ''} placeholder="https://exemplo.com.br" />
          </div>
          <Button>Salvar Alterações</Button>
        </CardContent>
      </Card>

      <GoogleSettings 
        clientId={client.id}
        isConnected={!!client.googleRefreshToken}
        savedGscUrl={client.gscUrl}
        savedGa4PropertyId={client.ga4PropertyId}
      />
    </div>
  )
}
