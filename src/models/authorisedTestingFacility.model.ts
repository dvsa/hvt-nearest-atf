<<<<<<< HEAD
interface Location {
  postcode: string;
  latitude: number;
  longitude: number;
}

export interface Availability {
  startDate: string;
  endDate: string;
  isAvailable: boolean;
  lastUpdated: string;
=======
export interface Availability {
  startDate: string;
  endDate: string;
  isAvailable?: boolean;
  lastUpdated?: string;
>>>>>>> feature/RTA-35-search-screen
}

export interface AuthorisedTestingFacility {
  id: string;
  name: string;
<<<<<<< HEAD
  location: Location;
  availability: Availability;
=======
  url: string;
  distance: number;
  postcode: string;
  address1: string;
  address2: string;
  town: string;
  availability: Availability;
  phone: string;
  email: string;
>>>>>>> feature/RTA-35-search-screen
  inclusions: string[];
  exclusions: string[];
  restrictions: string[];
}
