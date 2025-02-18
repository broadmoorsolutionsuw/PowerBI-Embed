import { ConfidentialClientApplication } from '@azure/msal-node';
import { PowerBIConfig } from '../types';

const createMsalConfig = (config: PowerBIConfig) => ({
  auth: {
    clientId: config.clientId,
    authority: `${config.authorityUrl}${config.tenantId}`,
    clientSecret: config.clientSecret,
  }
});

export const getAccessToken = async (config: PowerBIConfig): Promise<string> => {
  try {
    const msalConfig = createMsalConfig(config);
    const clientApplication = new ConfidentialClientApplication(msalConfig);

    const response = await clientApplication.acquireTokenByClientCredential({
      scopes: [config.scopeBase],
    });

    if (!response?.accessToken) {
      throw new Error('Failed to acquire access token');
    }

    return response.accessToken;
  } catch (error) {
    console.error('Error acquiring access token:', error);
    throw error;
  }
};
