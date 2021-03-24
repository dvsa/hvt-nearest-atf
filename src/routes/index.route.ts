import express, { Router } from 'express';
import { privacy, accessibility, search, cookiePreferences, cookies } from '../controllers/index.controller';

const indexRoute: Router = express.Router();

indexRoute.get('/', search);
indexRoute.post('/', search);
indexRoute.get('/privacy', privacy);
indexRoute.get('/accessibility', accessibility);
indexRoute.get('/cookie-preferences', cookiePreferences);
indexRoute.get('/cookies', cookies);

export default indexRoute;
