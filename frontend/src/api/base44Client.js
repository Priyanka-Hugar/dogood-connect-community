import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;
const isDev = import.meta.env.DEV;

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: isDev ? 'http://localhost:4400' : '',
  requiresAuth: false,
  appBaseUrl
});