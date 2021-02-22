import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger.util';
import { postcodeUtils } from '../utils/postcode.util';
import { geolocationService } from '../services/geolocation.service';
import { AuthorisedTestingFacility } from '../models/authorisedTestingFacility.model';
import { PagedResponse } from '../models/pagedResponse.model';
import { pagination } from '../utils/pagination.util';
import { PaginationOptions } from '../models/paginationOptions.model';
import { getDefaultPostcodeFormError } from '../errors/postcode.error';
import { ResultsFilters } from '../models/resultsFilters.model';
import { getFiltersFromRequest } from '../utils/filters.util';

const PAGINATION_ITEMS_PER_PAGE = 5;
const PAGINATION_MAX_NUMBER_OF_PAGES = 10;

export const search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.query.postcode === undefined) {
      return res.render('search/show');
    }

    const postcode: string = (<string> req.query.postcode || '').toUpperCase().replace(/\s+/g, '');
    logger.info(req, `Search for postcode ${postcode}`);

    if (!postcodeUtils.isValidPostcode(postcode)) {
      return res.render('search/show', {
        hasError: true,
        formErrors: getDefaultPostcodeFormError(),
      });
    }
    const currentPage = pagination.getCurrentPageFromRequest(req, PAGINATION_MAX_NUMBER_OF_PAGES);
    const paginationOptions: PaginationOptions = { page: currentPage, limit: PAGINATION_ITEMS_PER_PAGE };
    const filters: ResultsFilters = getFiltersFromRequest(req);
    console.log(`Dee filters:  ${JSON.stringify(filters)}`);
    // eslint-disable-next-line max-len
    const pagedResponse: PagedResponse<AuthorisedTestingFacility> = await geolocationService.nearest(req, postcode, paginationOptions, filters);

    if (pagedResponse.Items === undefined) {
      return res.render('search/show', {
        hasError: true,
        formErrors: getDefaultPostcodeFormError(),
      });
    }

    return res.render('search/results', {
      search: postcode,
      searchNormalised: postcodeUtils.toNormalised(postcode),
      data: pagedResponse.Items,
      filters: {
        removeAtfsWithNoAvailability: filters.removeAtfsWithNoAvailability === 'true',
      },
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
