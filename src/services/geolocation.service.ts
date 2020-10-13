import { Request } from 'express';
import { AxiosResponse } from 'axios';
import { request } from '../utils/request.util';
import { AuthorisedTestingFacility } from '../models/authorisedTestingFacility.model';
import { logger } from '../utils/logger.util';

const nearest = async (req: Request, postcode: string): Promise<AuthorisedTestingFacility[]> => {
  logger.info(req, `Retrieving ATFs nearest to postcode [${postcode}]`);

  return request.get(req, `${process.env.GEOLOCATION_URL}?postcode=${postcode}`)
    .then((response: AxiosResponse<AuthorisedTestingFacility[]>) => response.data)
    .catch((error) => {
      const errorString: string = JSON.stringify(error, Object.getOwnPropertyNames(error));
      logger.warn(req, `Could not retrieve ATFs nearest to postcode [${postcode}] details, error: ${errorString}`);

      return <AuthorisedTestingFacility[]> [];
    });
};

export const geolocationService = {
  nearest,
};
