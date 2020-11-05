import { Request } from 'express';
import { AuthorisedTestingFacility } from '../../src/models/authorisedTestingFacility.model';
import { PagedResponse } from '../../src/models/pagedResponse.model';
import { PaginationOptions } from '../../src/models/paginationOptions.model';
import { geolocationService } from '../../src/services/geolocation.service';
import { logger } from '../../src/utils/logger.util';
import { request } from '../../src/utils/request.util';
import { getAtfs } from '../data-providers/atf.dataProvider';

request.get = jest.fn();
logger.info = jest.fn();
logger.warn = jest.fn();

process.env.GEOLOCATION_URL = 'geolocation-url';

const atfsNumber = 2;
const atfs: AuthorisedTestingFacility[] = getAtfs(atfsNumber);
const defaultPagination: PaginationOptions = { page: 1, limit: 5 };
const postcode = 'PO16 7GZ';
const req: Request = {} as Request;

describe('Test geolocation.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('nearest method', () => {
    describe('when no pagination options provided', () => {
      it('should call request.get() with proper params and return PagedResponse', async () => {
        (request.get as jest.Mock).mockReturnValue(Promise.resolve({
          data: { Count: atfsNumber, ScannedCount: atfsNumber, Items: atfs },
        }));

        const results: PagedResponse<AuthorisedTestingFacility> = await geolocationService.nearest(req, postcode);

        expect(results).toStrictEqual({ Items: atfs, Count: atfsNumber, ScannedCount: atfsNumber });
        expect(request.get).toHaveBeenCalledWith(
          req,
          `${process.env.GEOLOCATION_URL}/${postcode}?page=${defaultPagination.page}&limit=${defaultPagination.limit}`,
        );
      });

      describe('when pagination options provided', () => {
        it('should call request.get() with proper params and return PagedResponse', async () => {
          (request.get as jest.Mock).mockReturnValue(Promise.resolve({
            data: { Count: atfsNumber, ScannedCount: atfsNumber, Items: atfs },
          }));
          const pagination: PaginationOptions = { page: 2, limit: 10 };

          const results: PagedResponse<AuthorisedTestingFacility> = await geolocationService.nearest(
            req,
            postcode,
            pagination,
          );

          expect(results).toStrictEqual({ Items: atfs, Count: atfsNumber, ScannedCount: atfsNumber });
          expect(request.get).toHaveBeenCalledWith(
            req,
            `${process.env.GEOLOCATION_URL}/${postcode}?page=${pagination.page}&limit=${pagination.limit}`,
          );
        });
      });
    });

    it('should return empty PagedResponse and log an error when something went wrong', async () => {
      const expectedError: Error = new Error('Ooops!');
      const expectedErrorString: string = JSON.stringify(expectedError, Object.getOwnPropertyNames(expectedError));
      (request.get as jest.Mock).mockReturnValue(Promise.reject(expectedError));

      const results: PagedResponse<AuthorisedTestingFacility> = await geolocationService.nearest(req, postcode);

      expect(results).toStrictEqual({});
      expect(logger.warn).toHaveBeenCalledWith(
        req,
        `Could not retrieve ATFs nearest to postcode [${postcode}] details, error: ${expectedErrorString}`,
      );
    });
  });
});
