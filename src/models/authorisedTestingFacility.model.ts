export interface Availability {
  startDate: string;
  endDate: string;
  isAvailable?: boolean;
  lastUpdated?: string;
}

export interface AuthorisedTestingFacility {
  id: string;
  name: string;
  url: string;
  distance: number;
  postcode: string;
  address1: string;
  address2: string;
  town: string;
  availability: Availability;
  phone: string;
  email: string;
  inclusions: string[];
  exclusions: string[];
  restrictions: string[];
}
