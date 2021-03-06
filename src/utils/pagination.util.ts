import { Request } from 'express';

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
  calculateMaxScannedItemsCount,
};
