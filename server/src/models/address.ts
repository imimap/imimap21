import { Schema } from "mongoose";

export interface IAddress {
  street: string,
  streetNumber: string,
  zip: string,
  city: string,
  country: string,
  altitude: number,
  longitude: number,
}

export const AddressSchema = new Schema({
  street: {
    required: true,
    type: String,
  },
  streetNumber: {
    required: true,
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
  altitude: {
    default: 0, //getLatitude
    type: Number,
  },
  longitude: {
    default: 0, //getLongitude
    type: Number,
  },
});
