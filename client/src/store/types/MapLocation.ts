import { Coordinates } from '@/store/types/Coordinates';

export interface MapLocation {
  city: string;
  country: string;
  coordinates: Coordinates;
}
