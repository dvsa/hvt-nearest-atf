import { postcodeUtils } from '../../src/utils/postcode.util';

describe('Test validation', () => {
  test('valid postcode returns no errors ', () => {
    expect(postcodeUtils.validate('NG1 6LP')).toEqual([]);
  });

  test('valid postcode no spaces returns no errors ', () => {
    expect(postcodeUtils.validate('NG16LP')).toEqual([]);
  });

  test('invalid postcode returns errors ', () => {
    postcodeUtils.validate('NG1LP');
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
  });
  test('isNormalised reformats missing space', () => {
    expect(postcodeUtils.toNormalised('ln11tt')).toEqual('LN1 1TT');
  });
  test('isNormalised reformats case', () => {
    expect(postcodeUtils.toNormalised('ln1 1tt')).toEqual('LN1 1TT');
  });
});
