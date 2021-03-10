import { Request } from 'express';
import { ResultsFilters } from '../models/resultsFilters.model';

export const getFiltersFromRequest = (req: Request): ResultsFilters => {
  const resultsFilters: ResultsFilters = {};
  const { removeAtfsWithNoAvailability } = req.query;
  if (removeAtfsWithNoAvailability === 'true') {
    resultsFilters.removeAtfsWithNoAvailability = removeAtfsWithNoAvailability;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
  const postParamFilters: string[] | string | undefined = req.body?.filters;
  if (postParamFilters && postParamFilters.includes('removeNoAvailability')) {
    resultsFilters.removeAtfsWithNoAvailability = 'true';
  }
  if (postParamFilters && postParamFilters.includes('clearFilters')) {
    return {};
  }

  return resultsFilters;
};
