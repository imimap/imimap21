import { IAddress } from "./address";
import { Schema } from "mongoose";
import axios from "axios";

export interface ICoordinates {
  latitude: number;
  longitude: number;
}

export const CoordinatesSchema = new Schema(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

export const getCoordinates = async function (document: IAddress): Promise<ICoordinates> {
  const key = process.env.GOOGLE_API_KEY;

  const addressString = Object.values(document).join(" ");
  const url = encodeURI(
    "https://maps.googleapis.com/maps/api/geocode/json?address=" + addressString + "&key=" + key
  );

  const res = await axios.get(url);
  const data = res.data;
  let coordinates;

  if (data.status !== "OK") throw data.status + ". Could not get coordinates for " + addressString;
  else coordinates = data.results[0].geometry.location;

  return {
    latitude: coordinates.lat,
    longitude: coordinates.lng,
  };
};
