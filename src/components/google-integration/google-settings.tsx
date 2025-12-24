'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { initiateGoogleConnection, fetchGoogleProperties, saveGoogleSettings } from '@/app/actions/google-integration';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from "sonner";

interface GoogleSettingsProps {
  clientId: string;
  isConnected: boolean;
  savedGscUrl?: string | null;
  savedGa4PropertyId?: string | null;
}

export function GoogleSettings({ clientId, isConnected, savedGscUrl, savedGa4PropertyId }: GoogleSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [gscSites, setGscSites] = useState<any[]>([]);
  const [ga4Properties, setGa4Properties] = useState<any[]>([]);
  
  const [selectedGsc, setSelectedGsc] = useState<string>(savedGscUrl || '');
  const [selectedGa4, setSelectedGa4] = useState<string>(savedGa4PropertyId || '');

  useEffect(() => {
    if (isConnected) {
      loadProperties();
    }
  }, [isConnected]);

  const loadProperties = async () => {
    setPropertiesLoading(true);
    const res = await fetchGoogleProperties(clientId);
    if (res.error) {
      toast.error(res.error);
    } else {
      setGscSites(res.gscSites || []);
      setGa4Properties(res.ga4Properties || []);
    }
    setPropertiesLoading(false);
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      const url = await initiateGoogleConnection(clientId);
      window.location.href = url;
    } catch (error) {
      toast.error("Erro ao iniciar conexão");
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const res = await saveGoogleSettings(clientId, selectedGsc, selectedGa4);
    if (res.success) {
      toast.success("Configurações salvas com sucesso!");
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integração Google</CardTitle>
        <CardDescription>Conecte sua conta Google para acessar dados do Search Console e Analytics.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg space-y-4">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">Conecte sua conta para importar dados automaticamente.</p>
            </div>
            <Button onClick={handleConnect} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Conectar com Google
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Conta Google Conectada</span>
              <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={handleConnect}>
                Reconectar
              </Button>
            </div>

            {propertiesLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Propriedade do Search Console</Label>
                  <Select value={selectedGsc} onValueChange={setSelectedGsc}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o site" />
                    </SelectTrigger>
                    <SelectContent>
                      {gscSites.map((site) => (
                        <SelectItem key={site.siteUrl} value={site.siteUrl}>
                          {site.siteUrl}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Propriedade do Google Analytics 4</Label>
                  <Select value={selectedGa4} onValueChange={setSelectedGa4}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a propriedade" />
                    </SelectTrigger>
                    <SelectContent>
                      {ga4Properties.map((prop) => (
                        <SelectItem key={prop.propertyId} value={prop.propertyId}>
                          {prop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSave} disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Configurações
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
