import { isValid, toNormalised } from 'postcode';

interface FieldError {
  field: string,
  message: string,
}
export interface FormError {
  heading: string,
  errors: FieldError[],
  errorMessage: string,
}

const isValidPostcode = (data: string): boolean => (data.length === 0 ? false : isValid(data));

const validate = (data: string): Array<FormError> => {
  const postcodeError: FormError = {
    heading: 'There is a problem',
    errors: [
      {
        field: 'postcode',
        message: 'Enter a postcode, like SW1A 2AA',
      },
    ],
    errorMessage: 'Enter a postcode in the correct format',
  };
  return isValidPostcode(data.toString().trim()) ? [] : [postcodeError];
};

export const postcodeUtils = {
  validate,
  toNormalised,
};
