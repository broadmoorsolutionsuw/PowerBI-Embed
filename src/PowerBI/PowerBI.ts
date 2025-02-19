import axios from 'axios';
import { getAccessToken } from './Auth';
import { EmbedTokenRequest, GenerateTokenRequest, PowerBIReportInfo } from '../types';
import config from '../config';

export const createTokenRequestData = (request: EmbedTokenRequest) => {
  const formData = {
    datasets: request.datasetIds.map(id => ({ id })),
    identities: [{
      username: request.username,
      roles: request.roles || ['MDG_ORG_CD'],
      datasets: request.datasetIds
    }]
  };

  console.log('Generated request data:', JSON.stringify(formData, null, 2));
  return formData;
};

async function findReportsByDatasetId(token: string, datasetId: string): Promise<{
  reports: PowerBIReportInfo[];
  workspaceId: string;
} | null> {
  try {
    // First, get all workspaces
    const workspacesResponse = await axios.get(
      'https://api.powerbi.com/v1.0/myorg/groups',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log({ workspacesResponse: workspacesResponse.data.value })

    // For each workspace, look for reports
    for (const workspace of workspacesResponse.data.value) {
      try {
        const reportsResponse = await axios.get(
          `https://api.powerbi.com/v1.0/myorg/groups/${workspace.id}/reports`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        console.log({ reportsResponse: reportsResponse.data.value })

        // Find the report that uses our datasetId
        const reports = reportsResponse.data.value.filter(
          (r: PowerBIReportInfo) => r.datasetId === datasetId
        );

        if (reports) {
          return {
            reports,
            workspaceId: workspace.id
          };
        }
      } catch (error) {
        console.warn(`Unable to access reports in workspace ${workspace.id}`, error);
        continue; // Try next workspace
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding report:', error);
    return null;
  }
}

export const generateEmbedToken = async (req: any, res: any) => {
  try {
    const { username, datasetIds, roles } = req.body;

    if (!datasetIds || datasetIds.length === 0) {
      return res.status(400).json({
        error: 'At least one datasetId is required',
        status: 400
      });
    }

    const token = await getAccessToken(config);

    // Find the report using the first datasetId
    const reportInfo = await findReportsByDatasetId(token, datasetIds[0]);

    if (!reportInfo) {
      return res.status(400).json({
        error: 'No accessible report found for the provided datasetId',
        status: 400
      });
    }

    const { reports, workspaceId } = reportInfo;

    // Construct the token request payload
    const formData: GenerateTokenRequest = {
      reports: reports.map((r: PowerBIReportInfo) => {
        return { id: r.id }
      }),
      datasets: datasetIds.map((id: string) => ({ id })),
      targetWorkspaces: [{ id: workspaceId }]
    };

    // Add RLS if roles are provided
    if (roles) {
      formData.identities = [{
        username,
        roles,
        datasets: datasetIds
      }];
    }

    const tokenResponse = await axios.post(
      'https://api.powerbi.com/v1.0/myorg/GenerateToken',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );


    console.log({ reports, tokenResponse })
    // Structure the response
    const response = {
      accessToken: tokenResponse.data.token,
      embedUrl: reports.map((report: PowerBIReportInfo) => {
        return {
          reportId: report.id,
          reportName: report.name,
          embedUrl: report.embedUrl
        }
      }),
      expiry: tokenResponse.data.expiration,
      status: 200
    };

    console.log(JSON.stringify(reports, null, 2))

    res.json(response);
  } catch (error: any) {
    console.error('Error generating embed token:', error);

    const errorMessage = error.response?.data?.error?.message || error.message;
    const status = error.response?.status || 500;

    res.status(status).json({
      error: `Error while retrieving report embed details\r\nStatus: ${status}\r\nResponse: ${errorMessage}`,
      status: status
    });
  }
};
