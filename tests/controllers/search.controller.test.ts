import { v4 } from 'uuid';
import { Request, NextFunction, Response } from 'express';
import { search, results } from '../../src/controllers/search.controller';
import { AuthorisedTestingFacility } from '../../src/models/authorisedTestingFacility.model';
import { geolocationService } from '../../src/services/geolocation.service';

let apiRequestId: string;
let awsRequestId: string;
let correlationId: string;
let postcode: string;
let reqMock: Request;
let resMock: Response;
let nextMock: NextFunction;

describe('Test search.controller', () => {
  beforeEach(() => {
    apiRequestId = v4();
    awsRequestId = v4();
    correlationId = awsRequestId;
    postcode = 'BT12 6FE';
    reqMock = <Request> <unknown> {
      apiGateway: { event: { requestContext: { requestId: apiRequestId } } },
      app: { locals: { correlationId } },
      body: { postcode },
    };
    resMock = <Response> <unknown> { redirect: jest.fn(), render: jest.fn(), status: jest.fn().mockReturnThis() };
    nextMock = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('search method', () => {
    it('should call res.redirect() with proper params', () => {
      const renderMock = jest.spyOn(resMock, 'render');

      search(reqMock, resMock, nextMock);

      expect(renderMock).toHaveBeenCalledWith('search/show');
    });
  });

  describe('results method', () => {
    it('should call res.render() with proper params', async () => {
      const geolcationServiceMock = jest.spyOn(geolocationService, 'nearest');
      geolcationServiceMock.mockReturnValue(Promise.resolve(<AuthorisedTestingFacility[]> []));
      const renderMock = jest.spyOn(resMock, 'render');

      await results(reqMock, resMock, nextMock);

      expect(geolcationServiceMock).toHaveBeenCalledWith(reqMock, postcode);
      expect(renderMock).toHaveBeenCalledWith('search/results', { data: [], search: postcode });
    });
  });
});
