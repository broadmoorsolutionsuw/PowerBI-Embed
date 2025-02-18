import express from 'express';
import path from 'path';
import * as PowerBI from './PowerBI';
import { validateEmbedTokenRequest } from './Verify';

import swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';

const PowerBIRouter = express();

const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));
PowerBIRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

PowerBIRouter.use(express.json());
PowerBIRouter.use(express.urlencoded({ extended: true }));

PowerBIRouter.post('/embedToken', validateEmbedTokenRequest, PowerBI.generateEmbedToken);
PowerBIRouter.get('/embedToken/test', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/test.html'));
});

PowerBIRouter.get('*', (req, res) => {
  res.redirect('/api/powerbi/docs');
});

export default PowerBIRouter;
