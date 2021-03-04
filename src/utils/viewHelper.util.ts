import nunjucks, { Environment } from 'nunjucks';
import { Express } from 'express';
import { format, utcToZonedTime } from 'date-fns-tz';
import { isValid, parseISO } from 'date-fns';

export const setUpNunjucks = (app: Express): Environment => {
  const env = nunjucks.configure(['views'], {
    autoescape: true,
    express: app,
  }).addGlobal('NODE_ENV', process.env.NODE_ENV)
    .addGlobal('getAsset', (name: string) => (process.env.CDN_URL || '/assets/') + name)
    // eslint-disable-next-line max-len
    .addFilter('formatDate', (date: string) => format(utcToZonedTime(new Date(date), process.env.TIMEZONE), 'd MMMM yyyy'))
    // eslint-disable-next-line max-len
    .addFilter('formatDateTime', (date: string) => format(utcToZonedTime(new Date(date), process.env.TIMEZONE), 'EEEE d MMMM yyyy \'at\' h:mmaaaaa\'m\''))
    // eslint-disable-next-line max-len
    .addFilter('isDateUndefinedOrBeforeToday', (date: number | undefined) => ((date && isValid(parseISO(date.toString()))) ? utcToZonedTime(new Date(date), process.env.TIMEZONE) < utcToZonedTime(new Date(), process.env.TIMEZONE) : true))
    .addFilter('to1DP', (numeral: number): string => numeral.toFixed(1))
    .addFilter('wrapPhraseIntoLink', (text: string, phrases: string[], link: string, cssClass: string): string => {
      let modifiedText = text;

      phrases.forEach((phrase) => {
        if (modifiedText.includes(phrase)) {
          modifiedText = modifiedText.replace(
            phrase,
            `<a href="${link}" class="${cssClass}" target="_blank">${phrase}</a>`,
          );
        }
      });

      return modifiedText;
    });
  // ... any other globals or custom filters here

  return env;
};
