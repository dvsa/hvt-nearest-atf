import { Request, Response } from 'express';
import { logger } from '../utils/logger.util';
import { PageSettings } from '../models/pageSettings.model';
import { postcodeUtils, FormError } from '../utils/postcode.util';
import { geolocatonService } from '../services/geolocation.service';

const pageSettings: PageSettings = {
  serviceName: 'Find a test centre for an HGV, bus or trailer MOT',
  hideNewServiceBanner: false,
  hideBackLink: false,
};

export const search = (req: Request, res: Response): void => {
  try {
    return res.render('search/show', {
      pageSettings,
    });
  } catch (error) {
    logger.info(req, 'error returning search page');
    throw error;
  }
};

export const show = (req: Request, res: Response): void => {
  try {
    // eslint-disable-next-line
    const postcode:string = req.body.postcode.toString().toUpperCase() || '';
    logger.info(req, `search for postcode ${postcode}`);
    const errors: Array<FormError> = postcodeUtils.validate(postcode);
    if (errors.length !== 0) {
      const viewModel = Object.assign(pageSettings, {
        hasError: true,
        formErrors: errors[0],
      });
      return res.render('search/show', viewModel);
    }
    return res.redirect(302, `search/results/?q=${encodeURI(postcode)}`);
  } catch (error) {
    logger.info(req, 'error returning search page with error');
    throw error;
  }
};

export const results = (req: Request, res: Response): void => {
  try {
    let postcode = '';
    if (req.query.q !== undefined && req.query.q !== '') {
      postcode = decodeURI(req.query.q.toString());
      logger.info(req, `results for postcode ${postcode}`);
      const viewModel = Object.assign(pageSettings, {
        search: postcodeUtils.toNormalised(postcode),
        data: geolocatonService.nearest(postcode),
      });
      return res.render('search/results', viewModel);
    }
    return res.redirect(302, '/');
  } catch (error) {
    logger.info(req, 'error returning search page with error');
    throw error;
  }
};
