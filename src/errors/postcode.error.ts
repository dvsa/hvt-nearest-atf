interface FieldError {
  field: string,
  message: string,
}

export interface FormError {
  heading: string,
  errors: FieldError[],
  errorMessage: string,
}

export const getDefaultPostcodeFormError = (): FormError => ({
  heading: 'There is a problem',
  errors: [
    {
      field: 'postcode',
      message: 'Enter a postcode, like SW1A 2AA',
    },
  ],
  errorMessage: 'Enter a real postcode',
});
