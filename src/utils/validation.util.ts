interface FieldError {
  field: string,
  message: string,
}
export interface FormError {
  heading: string,
  errors: FieldError[]
}

const isValidPostcode = (data: string): boolean => {
  const RegEx = new RegExp(
    // eslint-disable-next-line max-len
    /^([A-Z]){1}([0-9][0-9]|[0-9]|[A-Z][0-9][A-Z]|[A-Z][0-9][0-9]|[A-Z][0-9]|[0-9][A-Z]){1}([ ])?([0-9][A-z][A-z]){1}$/i,
  );
  return data.length === 0 ? false : RegEx.test(data);
};

const postcode = (data: string): Array<FormError> => {
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

export const validate = {
  postcode,
};
