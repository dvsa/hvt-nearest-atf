<<<<<<< HEAD
const nearest = (data:string) : string => data;
export const geolocatonService = {
=======
import { Request } from 'express';
import { AxiosResponse } from 'axios';
import { request } from '../utils/request.util';
import { AuthorisedTestingFacility } from '../models/authorisedTestingFacility.model';
import { logger } from '../utils/logger.util';
import { PagedResponse } from '../models/pagedResponse';

const nearest = async (req: Request, postcode: string): Promise<AuthorisedTestingFacility[]> => {
  logger.info(req, `Retrieving ATFs nearest to postcode [${postcode}]`);

  return request.get(req, `${process.env.GEOLOCATION_URL}${postcode}`)
    .then((response: AxiosResponse<PagedResponse<AuthorisedTestingFacility>>) => response.data.Items)
    .catch((error) => {
      const errorString: string = JSON.stringify(error, Object.getOwnPropertyNames(error));
      logger.warn(req, `Could not retrieve ATFs nearest to postcode [${postcode}] details, error: ${errorString}`);

      return <AuthorisedTestingFacility[]> [];
    });
};

export const geolocationService = {
>>>>>>> feature/RTA-35-search-screen
  nearest,
};
