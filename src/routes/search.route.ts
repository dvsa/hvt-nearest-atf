import express, { Router } from 'express';
import { search, show, results } from '../controllers/search.controller';

const searchRoute: Router = express.Router();

searchRoute.get('/', search);
searchRoute.post('/', show);
searchRoute.get('^[/]search/results(?=$|[/])', results);
export default searchRoute;
