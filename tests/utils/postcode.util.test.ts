import { postcodeUtils } from '../../src/utils/postcode.util';

describe('Test postcode.util', () => {
  describe('isValidPostcode method', () => {
    it('returns false for invalid postcode formats', () => {
      const invalidPostcodes: string[] = ['', '~ZZZ##', 'NG1LP'];

      invalidPostcodes.forEach((postcode) => {
        expect(postcodeUtils.isValidPostcode(postcode)).toEqual(false);
      });
    });

    it('returns true for valid postcode formats', () => {
      const validPostcodes: string[] = ['NG1 6LP', 'NG16LP', ' NG16LP', 'NG16LP '];

      validPostcodes.forEach((postcode) => {
        expect(postcodeUtils.isValidPostcode(postcode)).toEqual(true);
      });
    });
  });

  describe('isNormalised method', () => {
    it('returns missing space', () => {
      expect(postcodeUtils.toNormalised('ln11tt')).toEqual('LN1 1TT');
    });

    it('reformats case', () => {
      expect(postcodeUtils.toNormalised('ln1 1tt')).toEqual('LN1 1TT');
    });
  });
});
