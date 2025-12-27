'use server';

import { prisma } from '@/lib/prisma';
import { getGoogleDashboardData } from './google-integration';
import { subDays, differenceInDays, parseISO, format } from 'date-fns';

export async function getClientReportData(clientId: string, startDate: string, endDate: string) {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const daysDiff = differenceInDays(end, start) + 1;

  // Calculate previous period
  const prevEndDate = subDays(start, 1);
  const prevStartDate = subDays(prevEndDate, daysDiff - 1);
  
  const prevStartDateStr = format(prevStartDate, 'yyyy-MM-dd');
  const prevEndDateStr = format(prevEndDate, 'yyyy-MM-dd');

  // Fetch Data in Parallel
  const [
    client,
    currentGoogle,
    prevGoogle,
    completedTasks,
    createdBacklinks
  ] = await Promise.all([
    prisma.client.findUnique({
      where: { id: clientId },
      select: { name: true, url: true, logo: true } // Assuming logo might exist or we use name
    }),
    getGoogleDashboardData(clientId, startDate, endDate),
    getGoogleDashboardData(clientId, prevStartDateStr, prevEndDateStr),
    prisma.contentTask.findMany({
      where: {
        clientId,
        column: 'Done',
        updatedAt: {
          gte: start,
          lte: end
        }
      },
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.backlink.findMany({
      where: {
        clientId,
        createdAt: {
          gte: start,
          lte: end
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  // Calculate Growth Metrics
  const calculateGrowth = (current: number, previous: number) => {
    if (!previous) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // Extract Metrics
  const currentSessions = currentGoogle.ga4?.traffic?.rows?.reduce((acc: number, row: any) => acc + parseInt(row.metricValues[1].value), 0) || 0;
  const prevSessions = prevGoogle.ga4?.traffic?.rows?.reduce((acc: number, row: any) => acc + parseInt(row.metricValues[1].value), 0) || 0;

  const currentClicks = currentGoogle.gsc?.performance?.reduce((acc: number, row: any) => acc + row.clicks, 0) || 0;
  const prevClicks = prevGoogle.gsc?.performance?.reduce((acc: number, row: any) => acc + row.clicks, 0) || 0;

  const currentImpressions = currentGoogle.gsc?.performance?.reduce((acc: number, row: any) => acc + row.impressions, 0) || 0;
  const prevImpressions = prevGoogle.gsc?.performance?.reduce((acc: number, row: any) => acc + row.impressions, 0) || 0;

  return {
    client,
    period: {
      start: startDate,
      end: endDate,
      prevStart: prevStartDateStr,
      prevEnd: prevEndDateStr
    },
    metrics: {
      sessions: { value: currentSessions, growth: calculateGrowth(currentSessions, prevSessions) },
      clicks: { value: currentClicks, growth: calculateGrowth(currentClicks, prevClicks) },
      impressions: { value: currentImpressions, growth: calculateGrowth(currentImpressions, prevImpressions) },
    },
    charts: {
      gsc: currentGoogle.gsc?.performance || [],
      ga4: currentGoogle.ga4?.traffic?.rows || []
    },
    topKeywords: currentGoogle.gsc?.topQueries || [],
    topPages: currentGoogle.ga4?.topPages?.rows || [],
    workLog: {
      tasks: completedTasks,
      backlinks: createdBacklinks
    }
  };
}
