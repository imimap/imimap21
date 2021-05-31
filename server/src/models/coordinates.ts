import {IAddress} from "./address";
import {Schema} from "mongoose";

export interface ICoordinates {
  latitude: number,
  longitude: number,
}

export const CoordinatesSchema = new Schema(
  {
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
  },
  { _id: false }
);

export const getCoordinates = async function (document: IAddress) {
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
};
