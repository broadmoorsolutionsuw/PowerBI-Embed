import { NextFunction } from 'express';

export const validateEmbedTokenRequest = (
  req: any,
  res: any,
  next: NextFunction
) => {
  const { username, datasetIds, roles } = req.body;

  if (!username || !datasetIds) {
    return res.status(400).json({
      error: 'Invalid request. Required: username and datasetIds array'
    });
  }

  if (!Array.isArray(datasetIds)) {
    return res.status(400).json({
      error: 'datasetIds must be an array'
    });
  }

  if (!datasetIds.every(id => typeof id === 'string' && id.length > 0)) {
    return res.status(400).json({
      error: 'All datasetIds must be non-empty strings'
    });
  }

  // Role-specific username validation
  if (roles?.includes('MDG_Number')) {
    // For MDG_Number role, 6-10 digits
    const numericRegex = /^\d{6,10}$/;
    if (!numericRegex.test(username)) {
      return res.status(400).json({
        error: 'For MDG_Number role, username must be a number between 6 and 10 digits'
      });
    }
  } else if (roles?.includes('MDG_ORG_CD')) {
    // For MDG role, "994US30"
    const mdgRegex = /^\d+US\d{2}$/;
    if (!mdgRegex.test(username)) {
      return res.status(400).json({
        error: 'Invalid username format. Expected: MDG number + sales org (e.g., "994US30")'
      });
    }
  } else if (typeof username !== 'string' || username.length === 0) {
    // For other roles, just ensure username is a non-empty string
    return res.status(400).json({
      error: 'Username must be a non-empty string'
    });
  }

  // Validate roles if provided
  if (roles !== undefined) {
    if (!Array.isArray(roles)) {
      return res.status(400).json({
        error: 'Roles must be an array of strings'
      });
    }

    if (!roles.every(role => typeof role === 'string' && role.length > 0)) {
      return res.status(400).json({
        error: 'All roles must be non-empty strings'
      });
    }
  }

  next();
};
