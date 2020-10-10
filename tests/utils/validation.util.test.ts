import { validate } from '../../src/utils/validation.util';

describe('Test validation', () => {
  test('valid postcode returns no errors ', () => {
    expect(validate.postcode('NG1 6LP')).toEqual([]);
  });

  test('valid postcode no spaces returns no errors ', () => {
    expect(validate.postcode('NG16LP')).toEqual([]);
  });

  test('invalid postcode returns errors ', () => {
    validate.postcode('NG1LP');
    expect(validate.postcode('NG1LP')).toEqual(
      [{
        errors: [
          { field: 'postcode', message: 'Check it and enter again' }],
        heading: "This isn't a valid postcode.",
      },
      ],
    );
  });

  test('empty postcode returns errors ', () => {
    expect(validate.postcode('')).toEqual(
      [{
        errors: [
          { field: 'postcode', message: 'Check it and enter again' }],
        heading: "This isn't a valid postcode.",
      },
      ],
    );
  });

  test('incorrect entry returns errors', () => {
    expect(validate.postcode('~ZZZ##')).toEqual(
      [{
        errors: [
          { field: 'postcode', message: 'Check it and enter again' }],
        heading: "This isn't a valid postcode.",
      },
      ],
    );
  });
});
