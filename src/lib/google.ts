import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
  console.error('Missing Google OAuth credentials. Please check environment variables.');
}

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

const SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/analytics.readonly',
];

export function getAuthUrl(clientId: string) {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state: clientId, // Pass clientId as state to know which client to update on callback
    prompt: 'consent', // Force consent to ensure we get a refresh token
  });
}

export async function getTokensFromCode(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function getAuthenticatedClient(clientId: string) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: {
      googleRefreshToken: true,
      googleAccessToken: true,
      googleTokenExpiry: true,
    },
  });

  if (!client || !client.googleRefreshToken) {
    throw new Error('Client not connected to Google');
  }

  oauth2Client.setCredentials({
    refresh_token: client.googleRefreshToken,
    access_token: client.googleAccessToken,
    expiry_date: client.googleTokenExpiry ? new Date(client.googleTokenExpiry).getTime() : undefined,
  });

  // Check if token needs refresh
  const now = Date.now();
  if (client.googleTokenExpiry && new Date(client.googleTokenExpiry).getTime() < now) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      
      // Update in DB
      await prisma.client.update({
        where: { id: clientId },
        data: {
          googleAccessToken: credentials.access_token,
          googleTokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : undefined,
          // If a new refresh token is returned, update it (sometimes it rotates)
          ...(credentials.refresh_token && { googleRefreshToken: credentials.refresh_token }),
        },
      });
      
      oauth2Client.setCredentials(credentials);
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Failed to refresh Google token');
    }
  }

  return oauth2Client;
}

export async function getSearchConsoleSites(auth: any) {
  const searchconsole = google.searchconsole({ version: 'v1', auth });
  const res = await searchconsole.sites.list();
  return res.data.siteEntry || [];
}

export async function getGA4Properties(auth: any) {
  const analyticsAdmin = google.analyticsadmin({ version: 'v1beta', auth });
  // List accounts first
  const accounts = await analyticsAdmin.accountSummaries.list();
  // This is a simplified view, in reality you might need to traverse accounts -> properties
  // But accountSummaries usually gives a good list
  return accounts.data.accountSummaries || [];
}

export async function getSearchConsoleData(auth: any, siteUrl: string, startDate: string, endDate: string) {
  const searchconsole = google.searchconsole({ version: 'v1', auth });
  const res = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['date'],
      rowLimit: 1000,
    },
  });
  return res.data.rows || [];
}

export async function getGA4Data(auth: any, propertyId: string, startDate: string, endDate: string) {
  const analyticsData = google.analyticsdata({ version: 'v1beta', auth });
  const res = await analyticsData.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }],
      dimensions: [{ name: 'date' }],
    },
  });
  return res.data;
}
