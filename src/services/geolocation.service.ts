import { Request } from 'express';
import { AxiosResponse } from 'axios';
import { request } from '../utils/request.util';
import { AuthorisedTestingFacility } from '../models/authorisedTestingFacility.model';
import { logger } from '../utils/logger.util';
import { PagedResponse } from '../models/pagedResponse.model';
import { PaginationOptions } from '../models/paginationOptions.model';
import { ResultsFilters } from '../models/resultsFilters.model';

const nearest = async (
  req: Request,
  postcode: string,
  pagination: PaginationOptions = { page: 1, limit: 5 },
  filters: ResultsFilters = {},
): Promise<PagedResponse<AuthorisedTestingFacility>> => {
  logger.info(req, `Retrieving ATFs nearest to postcode [${postcode}], 
    pagination [${JSON.stringify(pagination)}], filters [${JSON.stringify(filters)}]`);

  return request.get(
    req, buildGeolocationUrl(postcode, pagination, filters),
  )
    .then((response: AxiosResponse<PagedResponse<AuthorisedTestingFacility>>) => response.data)
    .catch((error) => {
      const errorString: string = JSON.stringify(error, Object.getOwnPropertyNames(error));
      logger.warn(req, `Could not retrieve ATFs nearest to postcode [${postcode}] details, error: ${errorString}`);

      return <PagedResponse<AuthorisedTestingFacility>> {};
    });
};

const buildGeolocationUrl = (postcode: string, pagination: PaginationOptions, filters: ResultsFilters): string => {
  const queryParams: Record<string, string> = {
    page: pagination.page.toString(),
    limit: pagination.limit.toString(),
  };
  if (filters.removeAtfsWithNoAvailability) {
    queryParams.removeAtfsWithNoAvailability = filters.removeAtfsWithNoAvailability;
  }
  const urlSearchParams = new URLSearchParams(queryParams).toString();
  return `${process.env.GEOLOCATION_URL}/${postcode}?${urlSearchParams}`;
};

export const geolocationService = {
  nearest,
};
