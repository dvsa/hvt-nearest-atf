import path from 'path';
import express, {
  Express, Router, Request, Response, NextFunction,
} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import dotenv from 'dotenv';
import { setUpNunjucks } from './utils/viewHelper.util';
import assetRoute from './routes/asset.route';
import indexRoute from './routes/index.route';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();

const app: Express = express();
const routes: Router[] = [
  assetRoute,
  indexRoute,
];

// View engine
app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));
const env = setUpNunjucks(app);

// Middleware
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(awsServerlessExpressMiddleware.eventContext());
app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
  const { awsRequestId } = req.apiGateway.context;
  const correlationId: string = req.apiGateway.event.headers['X-Correlation-Id'] || awsRequestId;
  env.addGlobal('analytics', 'cm-user-preferences' in req.cookies ? JSON.parse(req.cookies['cm-user-preferences']).analytics == "on" || false : false);
  req.app.locals.correlationId = correlationId;
  next();
});

app.use(routes);

// Error handling
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).render('error/not-found');
  next();
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  const errorString: string = JSON.stringify(error, Object.getOwnPropertyNames(error));
  const context = { error: process.env.NODE_ENV === 'development' ? errorString : '' };
  res.status(500).render('error/service-unavailable', context);
  next();
});

export default app;
