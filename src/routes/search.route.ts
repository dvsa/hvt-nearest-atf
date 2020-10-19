import express, { Router } from 'express';
<<<<<<< HEAD
import { search, show, results } from '../controllers/search.controller';
=======
import { search } from '../controllers/search.controller';
>>>>>>> feature/RTA-35-search-screen

const searchRoute: Router = express.Router();

searchRoute.get('/', search);
<<<<<<< HEAD
searchRoute.post('/', show);
searchRoute.get('^[/]search/results(?=$|[/])', results);
=======

>>>>>>> feature/RTA-35-search-screen
export default searchRoute;
