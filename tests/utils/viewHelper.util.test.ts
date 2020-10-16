import { format, utcToZonedTime } from 'date-fns-tz';
import express, { Express } from 'express';
import { Environment } from 'nunjucks';
import { setUpNunjucks } from '../../src/utils/viewHelper.util';

type DateFunctionType = (date: string) => string;
type to1DPFunctionType = (numeral: number) => string;

const app: Express = express();
const nunjucks: Environment = setUpNunjucks(app);
const someDateIsoString = new Date().toISOString();
const timezone = 'timezone';
process.env.TIMEZONE = timezone;

jest.mock('date-fns-tz', () => ({
  format: jest.fn(),
  utcToZonedTime: jest.fn(),
}));

describe('Test viewHelper.util', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('formatDate filter function', () => {
    it('should call format() and utcToZonedTime() with proper params', () => {
      (utcToZonedTime as jest.Mock).mockImplementation(() => new Date(someDateIsoString));
      const formatDate: DateFunctionType = <DateFunctionType> nunjucks.getFilter('formatDate');

      formatDate(someDateIsoString);

      expect(utcToZonedTime).toHaveBeenCalledWith(new Date(someDateIsoString), timezone);
      expect(format).toHaveBeenCalledWith(new Date(someDateIsoString), 'd MMMM yyyy');
    });
  });

  describe('formatDateTime filter function', () => {
    it('should call format() and utcToZonedTime() with proper params', () => {
      (utcToZonedTime as jest.Mock).mockImplementation(() => new Date(someDateIsoString));
      const formatDateTime: DateFunctionType = <DateFunctionType> nunjucks.getFilter('formatDateTime');

      formatDateTime(someDateIsoString);

      expect(utcToZonedTime).toHaveBeenCalledWith(new Date(someDateIsoString), timezone);
      expect(format).toHaveBeenCalledWith(new Date(someDateIsoString), 'EEEE d MMMM yyyy \'at\' h:mmaaaaa\'m\'');
    });
  });

  describe('to1DP filter function', () => {
    it('should format numeral to 1 DP', () => {
      const givenNumerals: number[] = [1, 2.0, 3.14, 4.6123, 4.99999];
      const expectedNumerals: string[] = ['1.0', '2.0', '3.1', '4.6', '5.0'];
      const to1DP: to1DPFunctionType = <to1DPFunctionType> nunjucks.getFilter('to1DP');

      givenNumerals.forEach((numeral, index) => {
        expect(to1DP(numeral)).toBe(expectedNumerals[index]);
      });
    });
  });
});
