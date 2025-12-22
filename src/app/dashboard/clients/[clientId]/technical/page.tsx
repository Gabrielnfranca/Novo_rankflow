import { getTechnicalAudit } from "@/app/actions/technical"
import { TechnicalAuditBoard } from "@/components/technical-audit-board"

export default async function TechnicalPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const auditData = await getTechnicalAudit(clientId)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">SEO Técnico & Auditoria</h2>
        <p className="text-muted-foreground">
          Checklist completo de auditoria técnica, performance e indexação.
        </p>
      </div>
      
      <TechnicalAuditBoard initialData={auditData} clientId={clientId} />
    </div>
  )
}
