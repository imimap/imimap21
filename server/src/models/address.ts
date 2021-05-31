import { Schema } from "mongoose";
import { normalizeEmail } from "../helpers/emailAddressHelper";
import { CoordinatesSchema, getCoordinates, ICoordinates} from "./coordinates";

const key = process.env.GoogleAPIkey; // todo: get key

export interface IAddress {
  street: string,
  streetNumber: string,
  additionalLines: string, // for compatibility with world wide addresses, see https://stackoverflow.com/a/929691
  zip: string,
  city: string,
  country: string,
  coordinates: ICoordinates,
}

export const AddressSchema = new Schema(
  {
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
      type: CoordinatesSchema,
      default: getCoordinates, // upon creation, the default coordinates value is calculated.
    },
  },
  { _id: false }
);

AddressSchema.pre("save", function () {
  if (!this.modifiedPaths().includes("coordinates")) {
    this.set("coordinates", getCoordinates); // if address has been changed, update coordinates
  }
});


