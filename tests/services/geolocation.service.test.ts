import { Request } from 'express';
import { AuthorisedTestingFacility } from '../../src/models/authorisedTestingFacility.model';
import { geolocationService } from '../../src/services/geolocation.service';
import { logger } from '../../src/utils/logger.util';
import { request } from '../../src/utils/request.util';
import { getAtfs } from '../data-providers/atf.dataProvider';

request.get = jest.fn();
logger.info = jest.fn();
logger.warn = jest.fn();

process.env.GEOLOCATION_URL = 'geolocation-url';
const atfs: AuthorisedTestingFacility[] = getAtfs(2);
const postcode = 'PO16 7GZ';
const req: Request = {} as Request;

describe('Test geolocation.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('nearest method', () => {
    it('should call request.get() with proper params and return nearest ATFs array', async () => {
      (request.get as jest.Mock).mockReturnValue(Promise.resolve({ data: { Items: atfs } }));

      const results: AuthorisedTestingFacility[] = await geolocationService.nearest(req, postcode);

      expect(results).toStrictEqual(atfs);
      expect(request.get).toHaveBeenCalledWith(
        req,
        `${process.env.GEOLOCATION_URL}${postcode}`,
      );
    });

    it('should return empty ATFs array and log an error when something went wrong', async () => {
      const expectedError: Error = new Error('Ooops!');
      const expectedErrorString: string = JSON.stringify(expectedError, Object.getOwnPropertyNames(expectedError));
      (request.get as jest.Mock).mockReturnValue(Promise.reject(expectedError));

      const results: AuthorisedTestingFacility[] = await geolocationService.nearest(req, postcode);

      expect(results).toStrictEqual([]);
      expect(logger.warn).toHaveBeenCalledWith(
        req,
        `Could not retrieve ATFs nearest to postcode [${postcode}] details, error: ${expectedErrorString}`,
      );
    });
  });
});
