"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "./profile-form"
import { SecurityForm } from "./security-form"
import { AppearanceForm } from "./appearance-form"
import { User, Lock, Palette } from "lucide-react"

interface SettingsViewProps {
  user: {
    name: string
    email: string
  }
}

export function SettingsView({ user }: SettingsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie as configurações da sua conta e preferências do sistema.
        </p>
      </div>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Aparência
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <ProfileForm user={user} />
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <SecurityForm />
        </TabsContent>
        <TabsContent value="appearance" className="space-y-4">
          <AppearanceForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
