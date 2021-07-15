import { Coordinates } from '@/store/types/Coordinates';

export interface Address {
  street: string;
  streetNumber: string;
  additionalLines: string;
  zip: string;
  city: string;
  country: string;
  coordinates: Coordinates;
}
