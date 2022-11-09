import Coordinates from '@/models/Coordinates';

export default class Address {
  street: string;

  streetNumber: string;

  zip: string;

  city: string;

  country: string;

  additionalLines: string;

  coordinates: Coordinates;

  constructor(
    street: string,
    streetNumber: string,
    zip: string,
    city: string,
    country: string,
    additionalLines: string,
    coordinates: Coordinates,
  ) {
    this.street = street;
    this.streetNumber = streetNumber;
    this.zip = zip;
    this.city = city;
    this.country = country;
    this.additionalLines = additionalLines;
    this.coordinates = coordinates;
  }
}
