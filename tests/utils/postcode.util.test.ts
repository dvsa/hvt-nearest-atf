<<<<<<< HEAD
import { postcodeUtils } from '../../src/utils/postcode.util';

describe('Test postcode utility', () => {
=======
import { FormError, postcodeUtils } from '../../src/utils/postcode.util';

const expectedFormErrors: FormError[] = [{
  errors: [
    { field: 'postcode', message: 'Enter a postcode, like SW1A 2AA' },
  ],
  heading: 'There is a problem',
  errorMessage: 'Enter a postcode in the correct format',
}];

describe('Test postcode.util', () => {
>>>>>>> feature/RTA-35-search-screen
  test('valid postcode returns no errors ', () => {
    expect(postcodeUtils.validate('NG1 6LP')).toEqual([]);
  });

  test('valid postcode no spaces returns no errors ', () => {
    expect(postcodeUtils.validate('NG16LP')).toEqual([]);
  });

  test('invalid postcode returns errors ', () => {
    postcodeUtils.validate('NG1LP');
<<<<<<< HEAD
    expect(postcodeUtils.validate('NG1LP')).toEqual(
      [{
        errors: [
          { field: 'postcode', message: 'Check it and enter again' }],
        heading: "This isn't a valid postcode.",
      },
      ],
    );
  });

  test('empty postcode returns errors ', () => {
    expect(postcodeUtils.validate('')).toEqual(
      [{
        errors: [
          { field: 'postcode', message: 'Check it and enter again' }],
        heading: "This isn't a valid postcode.",
      },
      ],
    );
  });

  test('incorrect entry returns errors', () => {
    expect(postcodeUtils.validate('~ZZZ##')).toEqual(
      [{
        errors: [
          { field: 'postcode', message: 'Check it and enter again' }],
        heading: "This isn't a valid postcode.",
      },
      ],
    );
=======
    expect(postcodeUtils.validate('NG1LP')).toEqual(expectedFormErrors);
  });

  test('empty postcode returns errors ', () => {
    expect(postcodeUtils.validate('')).toEqual(expectedFormErrors);
  });

  test('incorrect entry returns errors', () => {
    expect(postcodeUtils.validate('~ZZZ##')).toEqual(expectedFormErrors);
>>>>>>> feature/RTA-35-search-screen
  });
  test('isNormalised reformats missing space', () => {
    expect(postcodeUtils.toNormalised('ln11tt')).toEqual('LN1 1TT');
  });
  test('isNormalised reformats case', () => {
    expect(postcodeUtils.toNormalised('ln1 1tt')).toEqual('LN1 1TT');
  });
});
