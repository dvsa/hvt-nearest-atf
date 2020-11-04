import { isValid, toNormalised } from 'postcode';

const isValidPostcode = (data: string): boolean => {
  if (data.length === 0) {
    return false;
  }

  return isValid(data.toString().trim());
};

export const postcodeUtils = {
  isValidPostcode,
  toNormalised,
};
