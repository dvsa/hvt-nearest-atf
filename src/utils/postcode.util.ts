import { isValid, toNormalised } from 'postcode';

interface FieldError {
  field: string,
  message: string,
}
export interface FormError {
  heading: string,
<<<<<<< HEAD
  errors: FieldError[]
=======
  errors: FieldError[],
  errorMessage: string,
>>>>>>> feature/RTA-35-search-screen
}

const isValidPostcode = (data: string): boolean => (data.length === 0 ? false : isValid(data));

const validate = (data: string): Array<FormError> => {
  const postcodeError: FormError = {
<<<<<<< HEAD
    heading: 'This isn\'t a valid postcode.',
    errors: [
      {
        field: 'postcode',
        message: 'Check it and enter again',
      },
    ],
=======
    heading: 'There is a problem',
    errors: [
      {
        field: 'postcode',
        message: 'Enter a postcode, like SW1A 2AA',
      },
    ],
    errorMessage: 'Enter a postcode in the correct format',
>>>>>>> feature/RTA-35-search-screen
  };
  return isValidPostcode(data.toString().trim()) ? [] : [postcodeError];
};

export const postcodeUtils = {
  validate,
  toNormalised,
};
