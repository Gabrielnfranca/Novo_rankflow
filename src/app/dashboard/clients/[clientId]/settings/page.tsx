import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
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
            <Input id="name" placeholder="Nome da empresa" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url">URL do Site</Label>
            <Input id="url" placeholder="https://exemplo.com.br" />
          </div>
          <Button>Salvar Alterações</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrações</CardTitle>
          <CardDescription>Conecte ferramentas externas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <p className="font-medium">Google Search Console</p>
              <p className="text-sm text-muted-foreground">Importe dados de performance orgânica.</p>
            </div>
            <Button variant="outline">Conectar</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <p className="font-medium">Google Analytics 4</p>
              <p className="text-sm text-muted-foreground">Acompanhe tráfego e conversões.</p>
            </div>
            <Button variant="outline">Conectar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
