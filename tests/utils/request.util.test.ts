import axios from 'axios';
import { v4 } from 'uuid';
import { Request } from 'express';
import { request } from '../../src/utils/request.util';

let url: string;
let apiRequestId: string;
let awsRequestId: string;
let requestMock: Request;

describe('Test request.util', () => {
  beforeAll(() => {
    url = 'http://test-url.com';
    apiRequestId = v4();
    awsRequestId = v4();
    requestMock = <Request> <unknown> {
      apiGateway: { event: { requestContext: { requestId: apiRequestId } } },
      app: { locals: { correlationId: awsRequestId } },
    };
  });

  test('get() sends http request to correct url with expected headers', async () => {
    const axiosMock = jest.spyOn(axios, 'get');
    axiosMock.mockReturnValue(Promise.resolve({}));
    const expectedHeaders = { headers: { 'X-Correlation-Id': awsRequestId } };

    await request.get(requestMock, url);

    expect(axiosMock).toHaveBeenCalledWith(url, expectedHeaders);
  });
});
