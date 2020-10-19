import { isValid, toNormalised } from 'postcode';

interface FieldError {
  field: string,
  message: string,
}
export interface FormError {
  heading: string,
  errors: FieldError[]
}

const isValidPostcode = (data: string): boolean => (data.length === 0 ? false : isValid(data));

const validate = (data: string): Array<FormError> => {
  const postcodeError: FormError = {
    heading: 'This isn\'t a valid postcode.',
    errors: [
      {
        field: 'postcode',
        message: 'Check it and enter again',
      },
    ],
  };
  return isValidPostcode(data.toString().trim()) ? [] : [postcodeError];
};

export const postcodeUtils = {
  validate,
  toNormalised,
};
