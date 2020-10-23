import { Request } from 'express';
import { PagedResponse } from '../models/pagedResponse.model';

const getCurrentPageFromRequest = (req: Request, maxNumberOfPages: number): number => {
  const currentPage = parseInt(<string> req.query.page, 10) || 1;

  if (currentPage < 1) {
    return 1;
  }

  if (currentPage > maxNumberOfPages) {
    return maxNumberOfPages;
  }

  return currentPage;
};

// eslint-disable-next-line max-len
const isInMaxNumberOfPagesRange = (page: number, maxNumberOfPages: number): boolean => page >= 1 && page <= maxNumberOfPages;

const calculateMaxScannedItemsCount = (
  scannedItemsCount: number,
  itemsPerPage: number,
  maxNumberOfPages: number,
): number => {
  const maxScannedItemsCount = itemsPerPage * maxNumberOfPages;

  return scannedItemsCount < maxScannedItemsCount
    ? scannedItemsCount
    : maxScannedItemsCount;
};

export const pagination = {
  getCurrentPageFromRequest,
  isInMaxNumberOfPagesRange,
  calculateMaxScannedItemsCount,
};
