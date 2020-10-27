import express, { Router } from 'express';
import { privacy, accessibility } from '../controllers/index.controller';

const indexRoute: Router = express.Router();

indexRoute.get('/privacy', privacy);
indexRoute.get('/accessibility', accessibility);

export default indexRoute;
