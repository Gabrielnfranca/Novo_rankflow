'use server';

import { prisma } from '@/lib/prisma';
import { 
  getAuthUrl, 
  getTokensFromCode, 
  getAuthenticatedClient, 
  getSearchConsoleSites, 
  getGA4Properties,
  getSearchConsoleData,
  getGA4Data,
  getSearchConsoleTopQueries,
  getSearchConsoleTopPages,
  getGA4TopPages
} from '@/lib/google';
import { revalidatePath } from 'next/cache';

export async function initiateGoogleConnection(clientId: string) {
  const url = getAuthUrl(clientId);
  return url;
}

export async function handleGoogleCallback(code: string, clientId: string) {
  try {
    const tokens = await getTokensFromCode(code);
    
    if (!tokens.refresh_token) {
      // If we don't get a refresh token, it might be because the user has already approved the app
      // and we didn't force consent. But getAuthUrl sets prompt: 'consent', so we should get it.
      // However, if we are re-connecting, we might just update the access token.
      console.warn('No refresh token received');
    }

    await prisma.client.update({
      where: { id: clientId },
      data: {
        googleRefreshToken: tokens.refresh_token, // Only updates if present
        googleAccessToken: tokens.access_token,
        googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      },
    });

    revalidatePath(`/dashboard/clients/${clientId}/settings`);
    return { success: true };
  } catch (error) {
    console.error('Error handling Google callback:', error);
    return { success: false, error: 'Failed to connect Google account' };
  }
}

export async function fetchGoogleProperties(clientId: string) {
  try {
    const auth = await getAuthenticatedClient(clientId);
    
    let gscSites: any[] = [];
    let ga4Accounts: any[] = [];

    // Busca Search Console de forma independente
    try {
      gscSites = await getSearchConsoleSites(auth);
    } catch (error) {
      console.error('Erro ao buscar sites do Search Console:', error);
    }

    // Busca Analytics de forma independente
    try {
      ga4Accounts = await getGA4Properties(auth);
    } catch (error) {
      console.error('Erro ao buscar contas do Analytics:', error);
    }

    // Flatten GA4 properties
    const ga4Properties = ga4Accounts.flatMap((account: any) => 
      account.propertySummaries?.map((prop: any) => ({
        id: prop.property, // properties/123456
        name: `${account.displayName} - ${prop.displayName}`,
        propertyId: prop.property?.split('/')[1] // Just the ID
      })) || []
    );

    return { gscSites, ga4Properties };
  } catch (error: any) {
    console.error('Error fetching Google properties:', error);
    return { error: `Erro ao buscar propriedades: ${error.message}` };
  }
}

export async function getGoogleDashboardData(clientId: string, startDate: string, endDate: string) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { gscUrl: true, ga4PropertyId: true }
    });

    if (!client) return { error: 'Client not found' };
    
    // If not connected, just return nulls without error to avoid breaking the UI
    if (!client.gscUrl && !client.ga4PropertyId) {
      return { gsc: null, ga4: null };
    }

    const auth = await getAuthenticatedClient(clientId);
    
    const results: any = {
      gsc: null,
      ga4: null
    };

    if (client.gscUrl) {
      try {
        const [performance, topQueries, topPages] = await Promise.all([
          getSearchConsoleData(auth, client.gscUrl, startDate, endDate),
          getSearchConsoleTopQueries(auth, client.gscUrl, startDate, endDate),
          getSearchConsoleTopPages(auth, client.gscUrl, startDate, endDate)
        ]);
        results.gsc = { performance, topQueries, topPages };
      } catch (e) {
        console.error('Error fetching GSC data', e);
      }
    }

    if (client.ga4PropertyId) {
      try {
        const [traffic, topPages] = await Promise.all([
          getGA4Data(auth, client.ga4PropertyId, startDate, endDate),
          getGA4TopPages(auth, client.ga4PropertyId, startDate, endDate)
        ]);
        results.ga4 = { traffic, topPages };
      } catch (e) {
        console.error('Error fetching GA4 data', e);
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return nulls instead of throwing to allow the page to render other parts
    return { gsc: null, ga4: null, error: 'Failed to fetch dashboard data' };
  }
}

export async function saveGoogleSettings(clientId: string, gscUrl: string, ga4PropertyId: string) {
  try {
    await prisma.client.update({
      where: { id: clientId },
      data: {
        gscUrl,
        ga4PropertyId,
      },
    });
    revalidatePath(`/dashboard/clients/${clientId}`);
    return { success: true };
  } catch (error) {
    console.error('Error saving Google settings:', error);
    return { success: false, error: 'Failed to save settings' };
  }
}

export async function fetchGoogleReport(clientId: string, startDate: string, endDate: string) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { gscUrl: true, ga4PropertyId: true }
    });

    if (!client?.gscUrl && !client?.ga4PropertyId) {
      return { error: 'No properties configured' };
    }

    const auth = await getAuthenticatedClient(clientId);
    
    let gscData: any[] = [];
    let ga4Data: any = null;

    if (client.gscUrl) {
      gscData = await getSearchConsoleData(auth, client.gscUrl, startDate, endDate);
    }

    if (client.ga4PropertyId) {
      ga4Data = await getGA4Data(auth, client.ga4PropertyId, startDate, endDate);
    }

    return { gscData, ga4Data };
  } catch (error) {
    console.error('Error fetching Google report:', error);
    return { error: 'Failed to fetch report data' };
  }
}
