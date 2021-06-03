import { AddressSchema, IAddress } from "./address";
import { Document, LeanDocument, Schema } from "mongoose";
import axios from "axios";

export interface ICoordinates {
  latitude: number,
  longitude: number,
}

export const CoordinatesSchema = new Schema(
  {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  { _id: false }
);

export const getCoordinates = async function (document: IAddress) {
  const key = process.env.GoogleAPIkey; // todo: get key

  const addressString = Object.values(document).join(" ");
  const url = encodeURI(
    "https://maps.googleapis.com/maps/api/geocode/json?address=" + addressString + "&key=" + key
  );

  const res = await axios.get(url);
  const data = res.data;
  let coordinates;

  if (data.status !== "OK") throw data.status + ". Could not get coordinates for " + addressString;
  else coordinates = data.results.geometry.location;

  return {
    latitude: coordinates.lat,
    longitude: coordinates.lng,
  };
};
