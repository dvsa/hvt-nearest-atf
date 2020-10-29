import express, { Express } from 'express';
import { Environment } from 'nunjucks';
import { setUpNunjucks } from '../../src/utils/viewHelper.util';

type DateFunctionType = (date: string) => string;
type To1DPFunctionType = (numeral: number) => string;
type IsDateBeforeTodayFunctionType = (date: string) => boolean;
type WrapPhraseIntoLinkFunctionType = (text: string, phrases: string[], link: string, cssClass: string) => string;

const app: Express = express();
const nunjucks: Environment = setUpNunjucks(app);
const timezone = 'timezone';
process.env.TIMEZONE = timezone;

describe('Test viewHelper.util', () => {
  describe('formatDate filter function', () => {
    it('should return date in correct format', () => {
      const formatDate: DateFunctionType = <DateFunctionType> nunjucks.getFilter('formatDate');

      const dateString: string = new Date(Date.UTC(2020, 9, 22, 14, 18, 33)).toISOString();

      expect(formatDate(dateString)).toEqual('22 October 2020');
    });
  });

  describe('formatDateTime filter function', () => {
    it('should return dateTime in correct format', () => {
      const formatDateTime: DateFunctionType = <DateFunctionType> nunjucks.getFilter('formatDateTime');

      const dateTimeString: string = new Date(Date.UTC(2020, 9, 22, 14, 18, 33)).toISOString();

      expect(formatDateTime(dateTimeString)).toEqual('Thursday 22 October 2020 at 2:18pm');
    });
  });

  describe('to1DP filter function', () => {
    it('should format numeral to 1 DP', () => {
      const givenNumerals: number[] = [1, 2.0, 3.14, 4.6123, 4.99999];
      const expectedNumerals: string[] = ['1.0', '2.0', '3.1', '4.6', '5.0'];
      const to1DP: To1DPFunctionType = <To1DPFunctionType> nunjucks.getFilter('to1DP');

      givenNumerals.forEach((numeral, index) => {
        expect(to1DP(numeral)).toBe(expectedNumerals[index]);
      });
    });
  });

  describe('isDateBeforeToday filter function', () => {
    // eslint-disable-next-line max-len
    const isDateBeforeToday: IsDateBeforeTodayFunctionType = <IsDateBeforeTodayFunctionType> nunjucks.getFilter('isDateBeforeToday');

    it('should return true for a date that occurs before today\'s date', () => {
      const today: Date = new Date();
      today.setDate(today.getDate() - 1);
      const yesterday: string = today.toISOString();

      expect(isDateBeforeToday(yesterday)).toBe(true);
    });

    it('should return false for a date that occurs on today\'s date', () => {
      const today: string = new Date().toISOString();

      expect(isDateBeforeToday(today)).toBe(false);
    });

    it('should return false for a date that occurs aftet today\'s date', () => {
      const today: Date = new Date();
      today.setDate(today.getDate() + 1);
      const tomorrow: string = today.toISOString();

      expect(isDateBeforeToday(tomorrow)).toBe(false);
    });
  });

  describe('wrapPhraseIntoLink filter function', () => {
    // eslint-disable-next-line max-len
    const wrapPhraseIntoLink: WrapPhraseIntoLinkFunctionType = <WrapPhraseIntoLinkFunctionType> nunjucks.getFilter('wrapPhraseIntoLink');

    const phrases: string[] = ['foo', 'bar', 'baz'];
    const link = 'https://www.google.com';
    const cssClasses = 'some-fancy-css-class and-another-one';

    it('should properly wrap given phrase into <a> tag when all parameters passed and one phrase was found', () => {
      const text = 'lorem ipsum foo lorem ipsum';

      const result: string = wrapPhraseIntoLink(text, phrases, link, cssClasses);

      expect(result).toBe(`lorem ipsum <a href="${link}" class="${cssClasses}" target="_blank">foo</a> lorem ipsum`);
    });

    it('should properly wrap given phrases into <a> tag when all parameters passed and two phrases were found', () => {
      const text = 'lorem ipsum foo bar';

      const result: string = wrapPhraseIntoLink(text, phrases, link, cssClasses);

      // eslint-disable-next-line max-len
      expect(result).toBe(`lorem ipsum <a href="${link}" class="${cssClasses}" target="_blank">foo</a> <a href="${link}" class="${cssClasses}" target="_blank">bar</a>`);
    });

    it('should return original text when a single phrase was not found', () => {
      const text = 'lorem ipsum';

      const result: string = wrapPhraseIntoLink(text, phrases, link, cssClasses);

      expect(result).toBe(text);
    });
  });
});
