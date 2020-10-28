import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger.util';
import { postcodeUtils, FormError } from '../utils/postcode.util';
import { geolocationService } from '../services/geolocation.service';
import { AuthorisedTestingFacility } from '../models/authorisedTestingFacility.model';
import { PagedResponse } from '../models/pagedResponse.model';
import { pagination } from '../utils/pagination.util';
import { PaginationOptions } from '../models/paginationOptions.model';

const PAGINATION_ITEMS_PER_PAGE = 5;
const PAGINATION_MAX_NUMBER_OF_PAGES = 10;

export const search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.query.postcode === undefined) {
      return res.render('search/show');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const postcode: string = (<string> req.query.postcode || '').toUpperCase().replace(/\s+/g, '');
    logger.info(req, `Search for postcode ${postcode}`);
    const errors: Array<FormError> = postcodeUtils.validate(postcode);

    if (errors.length !== 0) {
      return res.render('search/show', {
        hasError: true,
        formErrors: errors[0],
      });
    }

    const currentPage = pagination.getCurrentPageFromRequest(req, PAGINATION_MAX_NUMBER_OF_PAGES);
    const paginationOptions: PaginationOptions = { page: currentPage, limit: PAGINATION_ITEMS_PER_PAGE };

    // eslint-disable-next-line max-len
    const pagedResponse: PagedResponse<AuthorisedTestingFacility> = pagination.isInMaxNumberOfPagesRange(currentPage, PAGINATION_MAX_NUMBER_OF_PAGES)
      ? (await geolocationService.nearest(req, postcode, paginationOptions))
      : <PagedResponse<AuthorisedTestingFacility>> {};

    return res.render('search/results', {
      search: postcode,
      searchNormalised: postcodeUtils.toNormalised(postcode),
      data: pagedResponse.Items,
      paginationSettings: {
        currentPage,
        perPage: PAGINATION_ITEMS_PER_PAGE,
        itemsCount: pagedResponse.Count,
        scannedItemsCount: pagination.calculateMaxScannedItemsCount(
          pagedResponse.ScannedCount,
          PAGINATION_ITEMS_PER_PAGE,
          PAGINATION_MAX_NUMBER_OF_PAGES,
        ),
      },
    });
  } catch (error) {
    logger.warn(req, 'Error while rendering search page');
    return next(error);
  }
};

export const privacy = (req: Request, res: Response) => res.render('index/privacy');

export const accessibility = (req: Request, res: Response) => res.render('index/accessibility');
