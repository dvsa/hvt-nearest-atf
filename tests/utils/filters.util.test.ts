import { Request } from 'express';
import { getFiltersFromRequest } from '../../src/utils/filters.util';
import { ResultsFilters } from '../../src/models/resultsFilters.model';

describe('Filters utility tests', () => {
  describe('getFiltersFromRequest tests', () => {
    let requestMock: Request;
    const resultsFiltersWithNoAvailability: ResultsFilters = {
      removeAtfsWithNoAvailability: 'true',
    };
    beforeEach(() => {
      requestMock = <Request> <unknown> {
        query: {},
        body: {},
      };
    });
    test('returns a results filter object with removeAtfsWithNoAvailability if query param is true', () => {
      requestMock.query = {
        removeAtfsWithNoAvailability: 'true',
      };
      const result = getFiltersFromRequest(requestMock);
      expect(result).toEqual(resultsFiltersWithNoAvailability);
    });

    test('returns a results filter object without removeAtfsWithNoAvailability if query param is false', () => {
      requestMock.query = {
        removeAtfsWithNoAvailability: 'false',
      };
      const result = getFiltersFromRequest(requestMock);
      expect(result).toEqual({});
    });

    test('returns a results filter object without removeAtfsWithNoAvailability if query param is undefined', () => {
      const result = getFiltersFromRequest(requestMock);
      expect(result).toEqual({});
    });

    test('returns a results filter object without removeAtfsWithNoAvailability if request body is empty', () => {
      const result = getFiltersFromRequest(requestMock);
      expect(result).toEqual({});
    });

    test('should add removeAtfsWithNoAvailability if request body filters has the correct string', () => {
      requestMock.body = {
        filters: 'removeNoAvailability',
      };
      const result = getFiltersFromRequest(requestMock);
      expect(result).toEqual(resultsFiltersWithNoAvailability);
    });

    test('should not add removeAtfsWithNoAvailability if request body filters has an incorrect string', () => {
      requestMock.body = {
        filters: 'someFilter',
      };
      const result = getFiltersFromRequest(requestMock);
      expect(result).toEqual({});
    });

    // eslint-disable-next-line max-len
    test('should add removeAtfsWithNoAvailability if req body filters is an array and includes removeNoAvailability', () => {
      requestMock.body = {
        filters: ['otherFilter', 'removeNoAvailability'],
      };
      const result = getFiltersFromRequest(requestMock);
      expect(result).toEqual(resultsFiltersWithNoAvailability);
    });

    // eslint-disable-next-line max-len
    test('should not add removeAtfsWithNoAvailability if req body filters is an array and does not include removeNoAvailability', () => {
      requestMock.body = {
        filters: ['otherFilter', 'anotherFilter'],
      };
      const result = getFiltersFromRequest(requestMock);
      expect(result).toEqual({});
    });

    test('if req body and query are both empty', () => {
      const result = getFiltersFromRequest(requestMock);
      expect(result).toEqual({});
    });

    test('should return an empty object if clearFilters is included in filters list', () => {
      requestMock.body = {
        filters: ['removeNoAvailability', 'clearFilters', 'otherFilter', 'anotherFilter'],
      };
      const result = getFiltersFromRequest(requestMock);
      expect(result).toEqual({});
    });

    test('should return an empty object if clearFilters is the only filter present', () => {
      requestMock.body = {
        filters: 'clearFilters',
      };
      const result = getFiltersFromRequest(requestMock);
      expect(result).toEqual({});
    });
  });
});
