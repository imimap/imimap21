import { Schema } from "mongoose";
import {normalizeEmail} from "../helpers/emailAddressHelper";

const key = process.env.GoogleAPIkey; // todo: get key

export interface IAddress {
  street: string,
  streetNumber: string,
  additionalLines: string, // for compatibility with world wide addresses, see https://stackoverflow.com/a/929691
  zip: string,
  city: string,
  country: string,
  coordinates: {
    altitude: number,
    longitude: number,
  },
}

export const AddressSchema = new Schema({
  street: {
    required: false,
    type: String,
  },
  streetNumber: {
    required: false,
    type: String,
  },
  additionalLines: {
    required: false,
    type: String,
  },
  zip: {
    required: true,
    type: String,
  },
  city: {
    required: true,
    type: String,
  },
  country: {
    required: true,
    type: String,
  },
  coordinates: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    default: getCoordinates, // upon creation, the default coordinates value is calculated.
  },
});

AddressSchema.pre("save", function () {
  if (!this.modifiedPaths().includes("coordinates")) {
    this.set("coordinates", getCoordinates); // if address has been changed, update coordinates
  }
});

async function getCoordinates(document: IAddress) {
  const addressString =
    (document.streetNumber + " " || "") +
    " " +
    (document.street + " " || "") +
    " " +
    +(document.additionalLines + " " || "") +
    document.zip +
    " " +
    document.country;
  const url =
    "https://maps.googleapis.com/maps/api/geocode/json?address=" + addressString + "&key=" + key;

  const res = await fetch(url);
  const data = await res.json();
  let coordinates;

  if (data.status !== "OK") throw data.status + ". Could not get coordinates for " + addressString;
  else coordinates = data.results.geometry.location;

  return {
    latitude: coordinates.lat,
    longitude: coordinates.lng,
  };
}


