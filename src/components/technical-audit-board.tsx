"use client"

import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, AlertCircle, XCircle, HelpCircle, Save, Loader2 } from "lucide-react"
import { saveTechnicalAudit } from "@/app/actions/technical"
import { toast } from "sonner"

type AuditStatus = "pending" | "pass" | "fail" | "warning"

interface AuditItem {
  id: string
  category: string
  label: string
  description: string
  status: AuditStatus
  notes: string
}

const AUDIT_STRUCTURE = [
  {
    category: "Rastreamento & Indexação",
    items: [
      {
        id: "robots_txt",
        label: "Robots.txt",
        description: "Validar a existência e se aponta para o sitemap.xml. Verificar meta robots e atributo NOINDEX."
      },
      {
        id: "sitemap_xml",
        label: "Sitemap.XML",
        description: "Verificar existência e configuração no GSC. Criar caso não exista."
      },
      {
        id: "error_404",
        label: "Página de Erro 404",
        description: "Validar status code correto (404) usando websniffer.cc. Verificar usabilidade da página."
      },
      {
        id: "canonical_tags",
        label: "Tag Canonical",
        description: "Validar canonical em Home, Categorias, Produtos e Blog. Testar WWW/sem-WWW e HTTPS/HTTP."
      },
      {
        id: "gsc_bing",
        label: "GSC e Bing Webmaster",
        description: "Verificar Sitemaps, Robots, Ações Manuais, Cloaking e Erros de Rastreamento."
      }
    ]
  },
  {
    category: "Performance (WPO)",
    items: [
      {
        id: "pagespeed_mobile",
        label: "PageSpeed Insights (Mobile)",
        description: "Analisar nota de velocidade e usabilidade mobile."
      },
      {
        id: "pagespeed_desktop",
        label: "PageSpeed Insights (Desktop)",
        description: "Analisar nota de velocidade desktop."
      },
      {
        id: "webpagetest_metrics",
        label: "Métricas WebPagetest",
        description: "Validar: First byte time, Keep-alive, GZIP, Compressão de imagens, Cache estático."
      }
    ]
  },
  {
    category: "On-Page SEO",
    items: [
      {
        id: "heading_tags",
        label: "Heading Tags (H1-H6)",
        description: "Avaliar estrutura de headings na Home, Categorias e Produtos."
      },
      {
        id: "titles_descriptions",
        label: "Títulos e Descrições",
        description: "Verificar erros no GSC. Corrigir duplicidade ou ausência em páginas críticas."
      },
      {
        id: "rich_snippets",
        label: "Rich Snippets e Meta Dados",
        description: "Verificar oportunidades de dados estruturados (Schema.org)."
      },
      {
        id: "internal_search",
        label: "Busca Interna",
        description: "Configurar rastreamento no Analytics. Validar indexação de resultados de busca."
      }
    ]
  },
  {
    category: "Off-Page & Competidores",
    items: [
      {
        id: "indexed_pages",
        label: "Páginas Indexadas",
        description: "Comparar total de páginas indexadas com 3 principais concorrentes."
      },
      {
        id: "backlinks_analysis",
        label: "Análise de Backlinks",
        description: "Comparar total de links/domínios, histórico, nuvem de âncoras e principais canais com concorrentes."
      }
    ]
  },
  {
    category: "Analytics & UX",
    items: [
      {
        id: "google_analytics",
        label: "Google Analytics",
        description: "Validar acessos orgânicos (30 dias) e configuração de Metas/E-commerce."
      },
      {
        id: "usability_conversion",
        label: "Usabilidade e Conversão",
        description: "Testar fluxo de conversão. Criar conta Hotjar e solicitar instalação."
      },
      {
        id: "google_my_business",
        label: "Google Meu Negócio",
        description: "Cadastrar ou verificar propriedade. O mesmo para redes sociais relevantes."
      }
    ]
  }
]

export function TechnicalAuditBoard({ initialData, clientId }: { initialData: any, clientId: string }) {
  const [data, setData] = useState<Record<string, { status: AuditStatus, notes: string }>>(initialData || {})
  const [isSaving, setIsSaving] = useState(false)

  const updateItem = (id: string, field: 'status' | 'notes', value: string) => {
    setData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    const result = await saveTechnicalAudit(clientId, data)
    setIsSaving(false)
    if (result.success) {
      // toast.success("Auditoria salva com sucesso!")
      alert("Salvo com sucesso!")
    } else {
      alert("Erro ao salvar.")
    }
  }

  const getStatusColor = (status?: AuditStatus) => {
    switch (status) {
      case 'pass': return "text-green-600 bg-green-50 border-green-200"
      case 'fail': return "text-red-600 bg-red-50 border-red-200"
      case 'warning': return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default: return "text-muted-foreground bg-muted border-transparent"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Checklist de Auditoria</h2>
          <p className="text-sm text-muted-foreground">
            Acompanhe o progresso da auditoria técnica.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Salvar Progresso
        </Button>
      </div>

      <Accordion type="multiple" className="w-full space-y-4" defaultValue={AUDIT_STRUCTURE.map(c => c.category)}>
        {AUDIT_STRUCTURE.map((section, index) => (
          <AccordionItem key={index} value={section.category} className="border rounded-lg px-4 bg-card">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-lg">{section.category}</span>
                <Badge variant="secondary" className="ml-2">
                  {section.items.length} itens
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 space-y-4">
              {section.items.map((item) => {
                const itemData = data[item.id] || { status: 'pending', notes: '' }
                
                return (
                  <div key={item.id} className="grid gap-4 p-4 rounded-lg border bg-background/50">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-base">{item.label}</h4>
                          <div className="group relative">
                            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            <div className="absolute left-0 bottom-6 hidden group-hover:block w-64 p-2 bg-popover text-popover-foreground text-xs rounded border shadow-lg z-50">
                              {item.description}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      
                      <div className="w-full md:w-[200px]">
                        <Select 
                          value={itemData.status} 
                          onValueChange={(val) => updateItem(item.id, 'status', val)}
                        >
                          <SelectTrigger className={getStatusColor(itemData.status)}>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="pass">Aprovado</SelectItem>
                            <SelectItem value="fail">Reprovado</SelectItem>
                            <SelectItem value="warning">Atenção</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Notas / Evidências (Prints, Links)</label>
                      <Textarea 
                        placeholder="Cole aqui os links dos prints ou observações..."
                        className="min-h-[80px] text-sm resize-y"
                        value={itemData.notes}
                        onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                      />
                    </div>
                  </div>
                )
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
