import { Request } from 'express';
import { AxiosResponse } from 'axios';
import { request } from '../utils/request.util';
import { AuthorisedTestingFacility } from '../models/authorisedTestingFacility.model';
import { logger } from '../utils/logger.util';
import { PagedResponse } from '../models/pagedResponse.model';
import { PaginationOptions } from '../models/paginationOptions.model';

const nearest = async (
  req: Request,
  postcode: string,
  pagination: PaginationOptions = { page: 1, limit: 5 },
): Promise<PagedResponse<AuthorisedTestingFacility>> => {
  logger.info(req, `Retrieving ATFs nearest to postcode [${postcode}], pagination [${JSON.stringify(pagination)}]`);

  return request.get(
    req, `${process.env.GEOLOCATION_URL}/${postcode}?page=${pagination.page}&limit=${pagination.limit}`,
  )
    .then((response: AxiosResponse<PagedResponse<AuthorisedTestingFacility>>) => response.data)
    .catch((error) => {
      const errorString: string = JSON.stringify(error, Object.getOwnPropertyNames(error));
      logger.warn(req, `Could not retrieve ATFs nearest to postcode [${postcode}] details, error: ${errorString}`);

      return <PagedResponse<AuthorisedTestingFacility>> {};
    });
};

export const geolocationService = {
  nearest,
};
