import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger.util';
import { postcodeUtils, FormError } from '../utils/postcode.util';
import { geolocationService } from '../services/geolocation.service';

export const search = (req: Request, res: Response, next: NextFunction): void => {
  try {
    return res.render('search/show');
  } catch (error) {
    logger.warn(req, 'error returning search page');
    return next(error);
  }
};

export const results = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // eslint-disable-next-line
    const postcode: string = req.body.postcode.toString().toUpperCase() || '';
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
      data: await geolocationService.nearest(req, postcode),
    };
    return res.render('search/results', viewModel);
  } catch (error) {
    logger.warn(req, 'error returning results page');
    return next(error);
  }
};
