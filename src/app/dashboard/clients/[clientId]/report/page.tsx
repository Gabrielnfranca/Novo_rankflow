import { getClientReportData } from "@/app/actions/report";
import { ReportView } from "@/components/report-view";
import { format, subDays } from "date-fns";

export default async function ReportPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ clientId: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { clientId } = await params;
  const resolvedSearchParams = await searchParams;
  
  const fromParam = typeof resolvedSearchParams.from === 'string' ? resolvedSearchParams.from : undefined;
  const toParam = typeof resolvedSearchParams.to === 'string' ? resolvedSearchParams.to : undefined;

  const endDate = toParam || format(new Date(), 'yyyy-MM-dd');
  const startDate = fromParam || format(subDays(new Date(), 28), 'yyyy-MM-dd');

  const data = await getClientReportData(clientId, startDate, endDate);

  return <ReportView data={data} />;
}
