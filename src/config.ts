import dotenv from 'dotenv';
import { PowerBIConfig } from './types';

dotenv.config();

const config: PowerBIConfig = {
  authorityUrl: process.env.AUTHORITY_URL || 'https://login.microsoftonline.com/',
  tenantId: process.env.TENANT_ID || '',
  clientId: process.env.CLIENT_ID || '',
  clientSecret: process.env.CLIENT_SECRET || '',
  scopeBase: 'https://analysis.windows.net/powerbi/api/.default'
};

export default config;
