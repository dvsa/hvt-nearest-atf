import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger.util';
import { postcodeUtils, FormError } from '../utils/postcode.util';
import { geolocationService } from '../services/geolocation.service';

export const search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.query.postcode === undefined) {
      return res.render('search/show');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const postcode: string = (<string> req.query.postcode || '').toUpperCase();
    logger.info(req, `Search for postcode ${postcode}`);
    const errors: Array<FormError> = postcodeUtils.validate(postcode);

    if (errors.length !== 0) {
      return res.render('search/show', {
        hasError: true,
        formErrors: errors[0],
      });
    }

    return res.render('search/results', {
      search: postcodeUtils.toNormalised(postcode),
      data: await geolocationService.nearest(req, postcode),
    });
  } catch (error) {
    logger.warn(req, 'Error while rendering search page');
    return next(error);
  }
};
