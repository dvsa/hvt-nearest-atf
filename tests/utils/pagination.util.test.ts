import { Request } from 'express';
import { pagination } from '../../src/utils/pagination.util';

const perPage = 5;
const maxNumberOfPages = 10;

describe('Test pagination.util', () => {
  describe('getCurrentPageFromRequest method', () => {
    it('should return specified page number when in range page number given', () => {
      const req: Request = <Request> <unknown> { query: { page: '5' } };

      expect(pagination.getCurrentPageFromRequest(req, maxNumberOfPages)).toBe(5);
    });

    it('should return 1 page number if invalid page number given', () => {
      const req: Request = <Request> <unknown> { query: { page: '!@#$' } };

      expect(pagination.getCurrentPageFromRequest(req, maxNumberOfPages)).toBe(1);
    });

    it('should return 1 page number when less than 1 page number given', () => {
      const req: Request = <Request> <unknown> { query: { page: '-1' } };

      expect(pagination.getCurrentPageFromRequest(req, maxNumberOfPages)).toBe(1);
    });

    it('should return "maxNumberOfPages" number when greater than "maxNumberOfPages" number given', () => {
      const req: Request = <Request> <unknown> { query: { page: '20' } };

      expect(pagination.getCurrentPageFromRequest(req, maxNumberOfPages)).toBe(maxNumberOfPages);
    });
  });

  describe('isInMaxNumberOfPagesRange method', () => {
    it('should return true if number is in range', () => {
      expect(pagination.isInMaxNumberOfPagesRange(5, maxNumberOfPages)).toBe(true);
    });

    it('should return false if number is out of range', () => {
      expect(pagination.isInMaxNumberOfPagesRange(-1, maxNumberOfPages)).toBe(false);
      expect(pagination.isInMaxNumberOfPagesRange(20, maxNumberOfPages)).toBe(false);
    });
  });

  describe('calculateMaxScannedItemsCount method', () => {
    it('should return "scannedItemsCount" if "scannedItemsCount" < "maxScannedItemsCount"', () => {
      const scannedItemsCount = 5;

      const result: number = pagination.calculateMaxScannedItemsCount(scannedItemsCount, perPage, maxNumberOfPages);

      expect(result).toBe(scannedItemsCount);
    });

    it('should return "maxScannedItemsCount" if "scannedItemsCount" >= "maxScannedItemsCount"', () => {
      const scannedItemsCount = 100;

      const result: number = pagination.calculateMaxScannedItemsCount(scannedItemsCount, perPage, maxNumberOfPages);

      expect(result).toBe(maxNumberOfPages * perPage);
    });
  });
});
