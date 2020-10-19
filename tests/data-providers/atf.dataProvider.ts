import { v4 } from 'uuid';
import { AuthorisedTestingFacility } from '../../src/models/authorisedTestingFacility.model';

export const getAtfs = (quantity: number): AuthorisedTestingFacility[] => Array<AuthorisedTestingFacility>(quantity)
  .fill({} as AuthorisedTestingFacility)
  .map(() => getAtf(v4()));

export const getAtf = (id: string): AuthorisedTestingFacility => (<AuthorisedTestingFacility> {
  id,
  name: 'Beier, Jacobi and Kautzer',
  phone: '01332 825303',
  email: 'foo@bar.com',
  address: { line1: '1 somewhere street', line2: 'somewhere town', postcode: 'AB12 3CD' },
  geoLocation: { lat: 1, long: 2 },
  restrictions: ['door height 4.3 metres', 'maximum vehicle length 12.5 metres'],
  exclusions: ['LEZ phase 3', 'petrol emissions'],
  inclusions: ['goods vehicles (HGV)', 'public service vehicles (PSV)'],
  availability: {
    startDate: '2020-09-21T08:00:00Z',
    endDate: '2020-10-11T17:00:00Z',
    isAvailable: true,
    lastUpdated: '2020-09-18T17:42:34Z',
  },
});
