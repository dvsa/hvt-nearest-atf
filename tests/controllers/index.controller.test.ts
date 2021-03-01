import { v4 } from 'uuid';
import { Request, NextFunction, Response } from 'express';
import { accessibility, privacy, search } from '../../src/controllers/index.controller';
import { geolocationService } from '../../src/services/geolocation.service';
import { getAtfs } from '../data-providers/atf.dataProvider';
import { AuthorisedTestingFacility } from '../../src/models/authorisedTestingFacility.model';
import { postcodeUtils } from '../../src/utils/postcode.util';
import { FormError } from '../../src/errors/postcode.error';
import { PagedResponse } from '../../src/models/pagedResponse.model';

let apiRequestId: string;
let awsRequestId: string;
let correlationId: string;
let reqMock: Request;
let resMock: Response;
let nextMock: NextFunction;

const atfsNumber = 6;
const atfs: AuthorisedTestingFacility[] = getAtfs(atfsNumber);
const defaultExpectedFormError: FormError = {
  errors: [
    { field: 'postcode', message: 'Enter a postcode, like SW1A 2AA' },
  ],
  heading: 'There is a problem',
  errorMessage: 'Enter a real postcode',
};

geolocationService.nearest = jest.fn();

describe('Test search.controller', () => {
  let renderSpy: jest.SpyInstance;

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
    renderSpy = jest.spyOn(resMock, 'render');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('search method', () => {
    it('should render search/show page when no postcode provided', async () => {
      await search(reqMock, resMock, nextMock);

      expect(renderSpy).toHaveBeenCalledWith('search/show');
    });

    describe('search/results page', () => {
      const perPage = 5;
      const maxPageNumber = 10;

      let postcode: string;
      let postcodeNormalised: string;
      let postcodeNormalisedStripped: string;
      let isValidPostcodeSpy: jest.SpyInstance;
      let toNormalisedSpy: jest.SpyInstance;

      beforeEach(() => {
        postcode = 'po16 7gz';
        postcodeNormalised = 'PO16 7GZ';
        postcodeNormalisedStripped = 'PO167GZ';
        isValidPostcodeSpy = jest.spyOn(postcodeUtils, 'isValidPostcode');
        toNormalisedSpy = jest.spyOn(postcodeUtils, 'toNormalised');
        (geolocationService.nearest as jest.Mock).mockReturnValue(Promise.resolve({
          Count: perPage,
          ScannedCount: atfsNumber,
          Items: atfs,
        }));
      });

      afterEach(() => {
        expect(toNormalisedSpy).toHaveBeenCalledWith(postcodeNormalisedStripped);
        expect(toNormalisedSpy).toReturnWith(postcodeNormalised);
      });

      describe('when valid postcode provied and no page given', () => {
        it('should render 1 page and call geolocationService.nearest() to get first 5 ATFs', async () => {
          reqMock.query = { postcode };

          await search(reqMock, resMock, nextMock);

          expect(renderSpy).toHaveBeenCalledWith(
            'search/results',
            {
              search: postcodeNormalisedStripped,
              searchNormalised: postcodeNormalised,
              data: atfs,
              paginationSettings: {
                currentPage: 1,
                perPage,
                itemsCount: perPage,
                scannedItemsCount: atfsNumber,
              },
              filters: {
                removeAtfsWithNoAvailability: false,
              },
            },
          );
          expect(geolocationService.nearest).toHaveBeenCalledWith(
            reqMock,
            postcodeNormalisedStripped,
            { page: 1, limit: perPage },
            {},
          );
          expect(isValidPostcodeSpy).toHaveBeenCalledWith(postcodeNormalisedStripped);
          expect(isValidPostcodeSpy).toReturnWith(true);
        });
      });

      describe('when valid postcode provided and invalid page given', () => {
        it('should render 1 page and call geolocationService.nearest() to get first 5 ATFs', async () => {
          reqMock.query = { postcode, page: '!@#$%' };

          await search(reqMock, resMock, nextMock);

          expect(renderSpy).toHaveBeenCalledWith(
            'search/results',
            {
              search: postcodeNormalisedStripped,
              searchNormalised: postcodeNormalised,
              data: atfs,
              paginationSettings: {
                currentPage: 1,
                perPage,
                itemsCount: perPage,
                scannedItemsCount: atfsNumber,
              },
              filters: {
                removeAtfsWithNoAvailability: false,
              },
            },
          );
          expect(geolocationService.nearest).toHaveBeenCalledWith(
            reqMock,
            postcodeNormalisedStripped,
            { page: 1, limit: perPage },
            {},
          );
          expect(isValidPostcodeSpy).toHaveBeenCalledWith(postcodeNormalisedStripped);
          expect(isValidPostcodeSpy).toReturnWith(true);
        });
      });

      describe('when valid postcode and 3 page provided', () => {
        it('should render 3 page and call geolocationService.nearest() to get 11-15 ATFs', async () => {
          reqMock.query = { postcode, page: '3' };

          await search(reqMock, resMock, nextMock);

          expect(renderSpy).toHaveBeenCalledWith(
            'search/results',
            {
              search: postcodeNormalisedStripped,
              searchNormalised: postcodeNormalised,
              data: atfs,
              paginationSettings: {
                currentPage: 3,
                perPage,
                itemsCount: perPage,
                scannedItemsCount: atfsNumber,
              },
              filters: {
                removeAtfsWithNoAvailability: false,
              },
            },
          );
          expect(geolocationService.nearest).toHaveBeenCalledWith(
            reqMock,
            postcodeNormalisedStripped,
            { page: 3, limit: perPage },
            {},
          );
          expect(isValidPostcodeSpy).toHaveBeenCalledWith(postcodeNormalisedStripped);
          expect(isValidPostcodeSpy).toReturnWith(true);
        });
      });

      describe('when valid postcode provided and out of max range page given', () => {
        it('should render max page and call geolocationService.nearest() to get last 5 ATFs', async () => {
          reqMock.query = { postcode, page: '20' };

          await search(reqMock, resMock, nextMock);

          expect(renderSpy).toHaveBeenCalledWith(
            'search/results',
            {
              search: postcodeNormalisedStripped,
              searchNormalised: postcodeNormalised,
              data: atfs,
              paginationSettings: {
                currentPage: maxPageNumber,
                perPage,
                itemsCount: perPage,
                scannedItemsCount: atfsNumber,
              },
              filters: {
                removeAtfsWithNoAvailability: false,
              },
            },
          );
          expect(geolocationService.nearest).toHaveBeenCalledWith(
            reqMock,
            postcodeNormalisedStripped,
            { page: maxPageNumber, limit: perPage },
            {},
          );
        });
      });

      describe('when valid postcode provided and out of min range page given', () => {
        it('should render 1 page and call geolocationService.nearest() to get first 5 ATFs', async () => {
          reqMock.query = { postcode, page: '-1' };

          await search(reqMock, resMock, nextMock);

          expect(renderSpy).toHaveBeenCalledWith(
            'search/results',
            {
              search: postcodeNormalisedStripped,
              searchNormalised: postcodeNormalised,
              data: atfs,
              paginationSettings: {
                currentPage: 1,
                perPage,
                itemsCount: perPage,
                scannedItemsCount: atfsNumber,
              },
              filters: {
                removeAtfsWithNoAvailability: false,
              },
            },
          );
          expect(geolocationService.nearest).toHaveBeenCalledWith(
            reqMock,
            postcodeNormalisedStripped,
            { page: 1, limit: perPage },
            {},
          );
        });
      });
    });

    describe('when various valid postocde formats provided and no page given', () => {
      it('should render 1 search/results page and call geolocationService.nearest() to get first 5 ATFs', () => {
        const isValidPostcodeSpy = jest.spyOn(postcodeUtils, 'isValidPostcode');
        const toNormalisedSpy = jest.spyOn(postcodeUtils, 'toNormalised');
        const perPage = 5;
        const postcodes = [
          { input: 'NG16LP', normalised: 'NG1 6LP', normalisedStripped: 'NG16LP' },
          { input: 'ng16lp', normalised: 'NG1 6LP', normalisedStripped: 'NG16LP' },
          { input: 'ng16lp   ', normalised: 'NG1 6LP', normalisedStripped: 'NG16LP' },
          { input: '   ng16lp', normalised: 'NG1 6LP', normalisedStripped: 'NG16LP' },
          { input: 'n g 1 6 l p', normalised: 'NG1 6LP', normalisedStripped: 'NG16LP' },
        ];

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        postcodes.forEach(async (postcode) => {
          reqMock.query = { postcode: postcode.input };

          await search(reqMock, resMock, nextMock);

          expect(renderSpy).toHaveBeenCalledWith(
            'search/results',
            {
              search: postcode.normalisedStripped,
              searchNormalised: postcode.normalised,
              data: atfs,
              paginationSettings: {
                currentPage: 1,
                perPage,
                itemsCount: perPage,
                scannedItemsCount: atfsNumber,
              },
              filters: {
                removeAtfsWithNoAvailability: false,
              },
            },
          );
          expect(geolocationService.nearest).toHaveBeenCalledWith(
            reqMock,
            postcode.normalisedStripped,
            { page: 1, limit: perPage },
            {},
          );
          expect(isValidPostcodeSpy).toHaveBeenCalledWith(postcode.normalisedStripped);
          expect(isValidPostcodeSpy).toReturnWith(true);
          expect(toNormalisedSpy).toHaveBeenCalledWith(postcode.normalisedStripped);
          expect(toNormalisedSpy).toReturnWith(postcode.normalised);
        });
      });
    });

    it('should render search/show page with form error when postcode with invalid format provided', async () => {
      const postcode = 'i am an invalid postcode';
      const postcodeUpperCaseStripped = 'IAMANINVALIDPOSTCODE';
      reqMock.query = { postcode };
      const isValidPostcodeSpy = jest.spyOn(postcodeUtils, 'isValidPostcode');

      await search(reqMock, resMock, nextMock);

      expect(renderSpy).toHaveBeenCalledWith(
        'search/show',
        { hasError: true, formErrors: defaultExpectedFormError },
      );
      expect(isValidPostcodeSpy).toHaveBeenCalledWith(postcodeUpperCaseStripped);
      expect(isValidPostcodeSpy).toReturnWith(false);
    });

    it('should render search/show page with form error when unexisting postcode provided', async () => {
      const postcode = 'bt51 3jk';
      const postcodeNormalisedStripped = 'BT513JK';
      const perPage = 5;
      reqMock.query = { postcode };
      const isValidPostcodeSpy = jest.spyOn(postcodeUtils, 'isValidPostcode');
      (geolocationService.nearest as jest.Mock).mockResolvedValue(<PagedResponse<AuthorisedTestingFacility>>{});

      await search(reqMock, resMock, nextMock);

      expect(renderSpy).toHaveBeenCalledWith(
        'search/show',
        { hasError: true, formErrors: defaultExpectedFormError },
      );
      expect(isValidPostcodeSpy).toHaveBeenCalledWith(postcodeNormalisedStripped);
      expect(isValidPostcodeSpy).toReturnWith(true);
      expect(geolocationService.nearest).toHaveBeenLastCalledWith(
        reqMock,
        postcodeNormalisedStripped,
        { page: 1, limit: perPage },
        {},
      );
    });
  });

  describe('privacy method', () => {
    it('should render index/privacy page', () => {
      privacy(reqMock, resMock);

      expect(renderSpy).toHaveBeenCalledWith('index/privacy');
    });
  });

  describe('accessibility method', () => {
    it('should render index/accessibility page', () => {
      accessibility(reqMock, resMock);

      expect(renderSpy).toHaveBeenCalledWith('index/accessibility');
    });
  });
});
