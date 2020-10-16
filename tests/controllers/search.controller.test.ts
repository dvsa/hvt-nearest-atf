import { v4 } from 'uuid';
import { Request, NextFunction, Response } from 'express';
import { search } from '../../src/controllers/search.controller';
import { geolocationService } from '../../src/services/geolocation.service';
import { getAtfs } from '../data-providers/atf.dataProvider';
import { AuthorisedTestingFacility } from '../../src/models/authorisedTestingFacility.model';
import { FormError, postcodeUtils } from '../../src/utils/postcode.util';

let apiRequestId: string;
let awsRequestId: string;
let correlationId: string;
let reqMock: Request;
let resMock: Response;
let nextMock: NextFunction;

const atfs: AuthorisedTestingFacility[] = getAtfs(2);

geolocationService.nearest = jest.fn();

describe('Test search.controller', () => {
  beforeEach(() => {
    apiRequestId = v4();
    awsRequestId = v4();
    correlationId = awsRequestId;
    reqMock = <Request> <unknown> {
      apiGateway: { event: { requestContext: { requestId: apiRequestId } } },
      app: { locals: { correlationId } },
      query: {},
    };
    resMock = <Response> <unknown> { redirect: jest.fn(), render: jest.fn(), status: jest.fn().mockReturnThis() };
    nextMock = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('search method', () => {
    let renderSpy: jest.SpyInstance;

    beforeEach(() => {
      renderSpy = jest.spyOn(resMock, 'render');
    });

    it('should render search/show page when no postcode provided', async () => {
      await search(reqMock, resMock, nextMock);

      expect(renderSpy).toHaveBeenCalledWith('search/show');
    });

    it('should render search/results page with proper params when valid postcode provided', async () => {
      const postcode = 'po167gz';
      const postcodeUpperCase = postcode.toUpperCase();
      const postcodeNormalised = 'PO16 7GZ';
      reqMock.query = { postcode };
      const validateSpy = jest.spyOn(postcodeUtils, 'validate');
      const toNormalisedSpy = jest.spyOn(postcodeUtils, 'toNormalised');
      (geolocationService.nearest as jest.Mock).mockReturnValue(atfs);

      await search(reqMock, resMock, nextMock);

      expect(renderSpy).toHaveBeenCalledWith(
        'search/results',
        { search: postcodeNormalised, data: atfs },
      );
      expect(validateSpy).toHaveBeenCalledWith(postcodeUpperCase);
      expect(validateSpy).toReturnWith([]);
      expect(toNormalisedSpy).toHaveBeenCalledWith(postcodeUpperCase);
      expect(toNormalisedSpy).toReturnWith(postcodeNormalised);
    });

    it('should render search/show page with proper params when invalid postcode provided', async () => {
      const postcode = 'i am an invalid postcode';
      reqMock.query = { postcode };
      const validateSpy = jest.spyOn(postcodeUtils, 'validate');
      const expectedFormErrors: FormError[] = [{
        errors: [
          { field: 'postcode', message: 'Enter a postcode, like SW1A 2AA' },
        ],
        heading: 'There is a problem',
        errorMessage: 'Enter a postcode in the correct format',
      }];

      await search(reqMock, resMock, nextMock);

      expect(renderSpy).toHaveBeenCalledWith(
        'search/show',
        { hasError: true, formErrors: expectedFormErrors[0] },
      );
      expect(validateSpy).toHaveBeenCalledWith(postcode.toUpperCase());
      expect(validateSpy).toReturnWith(expectedFormErrors);
    });
  });
});
