import { Request, Response } from 'express';
import { logger } from '../utils/logger.util';
import { postcodeUtils, FormError } from '../utils/postcode.util';
import { geolocatonService } from '../services/geolocation.service';

export const search = (req: Request, res: Response): void => {
  try {
    return res.render('search/show');
  } catch (error) {
    logger.info(req, 'error returning search page');
    throw error;
  }
};

export const results = (req: Request, res: Response): void => {
  try {
    // eslint-disable-next-line
    const postcode:string = req.body.postcode.toString().toUpperCase() || '';
    logger.info(req, `search for postcode ${postcode}`);
    const errors: Array<FormError> = postcodeUtils.validate(postcode);
    let viewModel = { };
    if (errors.length !== 0) {
      viewModel = {
        hasError: true,
        formErrors: errors[0],
      };
      return res.render('search/show', viewModel);
    }
    viewModel = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      search: postcodeUtils.toNormalised(postcode),
      data: geolocatonService.nearest(postcode),
    };
    return res.render('search/results', viewModel);
  } catch (error) {
    logger.info(req, 'error returning results page');
    throw error;
  }
};
