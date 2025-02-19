import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import PowerBIRouter from './PowerBI';

const app = express();

app.use('/js', express.static('./node_modules/bootstrap/dist/js/')); // Redirect bootstrap JS
app.use('/js', express.static('./node_modules/jquery/dist/')); // Redirect JS jQuery
app.use('/js', express.static('./node_modules/powerbi-client/dist/')) // Redirect JS PowerBI
app.use('/css', express.static('./node_modules/bootstrap/dist/css/')); // Redirect CSS bootstrap
app.use('/public', express.static('./public/')); // Use custom JS and CSS files

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());


app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, '/../../views/test.html'));
});

// Routes
app.use('/api/powerbi', PowerBIRouter);

const port = process.env.PORT || 5300;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Test page available at: http://localhost:${port}/api/powerbi/test`);
});


// Internal Error Route
app.use(function (
  error: any,
  req: any,
  res: any,
  next: any
) {

  // Display in error logs
  console.error(error);

  return res.sendStatus(500);
});


// function notFound(req: any, res: any) {
//   res.status(404).json({ message: "Not Found" });
// }

function requestLogger(
  req: any,
  res: any,
  next: any
) {
  console.info({
    "Request IP": req.ip,
    "Request headers": req.header,
    "Request URL": req.baseUrl,
    "Request QUERY": req.query,
    "Request BODY": req.body,
  });
  next();
}