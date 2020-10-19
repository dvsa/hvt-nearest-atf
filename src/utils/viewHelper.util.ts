import nunjucks, { Environment } from 'nunjucks';
import { Express } from 'express';
import { format, utcToZonedTime } from 'date-fns-tz';

export const setUpNunjucks = (app: Express): Environment => {
<<<<<<< HEAD
  const env = nunjucks.configure(['views', 'govuk-frontend'], {
=======
  const env = nunjucks.configure(['views'], {
>>>>>>> feature/RTA-35-search-screen
    autoescape: true,
    express: app,
  }).addGlobal('NODE_ENV', process.env.NODE_ENV)
    .addGlobal('getAsset', (name: string) => (process.env.CDN_URL || '/assets/') + name)
    // eslint-disable-next-line max-len
    .addFilter('formatDate', (date: string) => format(utcToZonedTime(new Date(date), process.env.TIMEZONE), 'd MMMM yyyy'))
    // eslint-disable-next-line max-len
<<<<<<< HEAD
    .addFilter('formatDateTime', (date: string) => format(utcToZonedTime(new Date(date), process.env.TIMEZONE), 'EEEE d MMMM yyyy \'at\' h:mmaaaaa\'m\''));
=======
    .addFilter('formatDateTime', (date: string) => format(utcToZonedTime(new Date(date), process.env.TIMEZONE), 'EEEE d MMMM yyyy \'at\' h:mmaaaaa\'m\''))
    .addFilter('to1DP', (numeral: number): string => numeral.toFixed(1));
>>>>>>> feature/RTA-35-search-screen
  // ... any other globals or custom filters here

  return env;
};
