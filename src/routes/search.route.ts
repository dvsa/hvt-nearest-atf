import express, { Router } from 'express';
import { search } from '../controllers/search.controller';

const searchRoute: Router = express.Router();

searchRoute.get('/', search);
export default searchRoute;
