import { geolocatonService } from '../../src/services/geolocation.service';

describe('test the geolocation service', () => {
  test('nearest service returns data', () => {
    expect(geolocatonService.nearest('__TEST__')).toEqual('__TEST__');
  });
});
