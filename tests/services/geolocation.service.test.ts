// TODO: RTA-
import { Request } from 'express';
import { v4 } from 'uuid';
import { AuthorisedTestingFacility } from '../../src/models/authorisedTestingFacility.model';
import { geolocationService } from '../../src/services/geolocation.service';

let apiRequestId: string;
let awsRequestId: string;
let correlationId: string;
let reqMock: Request;

describe('test the geolocation service', () => {
  beforeEach(() => {
    apiRequestId = v4();
    awsRequestId = v4();
    correlationId = awsRequestId;
    reqMock = <Request> <unknown> {
      apiGateway: { event: { requestContext: { requestId: apiRequestId } } },
      app: { locals: { correlationId } },
    };
  });

  test('nearest service returns data', async () => {
    const response: AuthorisedTestingFacility[] = await geolocationService.nearest(reqMock, '__TEST__');
    expect(response).toEqual([]);
  });
});
