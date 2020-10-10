import express, { Router } from 'express';
import { search, results } from '../controllers/search.controller';

const searchRoute: Router = express.Router();

searchRoute.get('/', search);
searchRoute.post('/', results);
export default searchRoute;
