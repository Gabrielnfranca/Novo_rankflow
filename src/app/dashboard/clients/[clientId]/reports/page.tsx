import { ReportView } from "@/components/google-integration/report-view";

export default async function ReportsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;

  return (
    <div className="space-y-6">
      <ReportView clientId={clientId} />
    </div>
  );
}
