import { Schema } from "mongoose";
import { CoordinatesSchema, getCoordinates, ICoordinates } from "./coordinates";

export interface IAddress {
  street?: string;
  streetNumber?: string;
  additionalLines?: string; // for compatibility with world wide addresses, see https://stackoverflow.com/a/929691
  zip: string;
  city: string;
  country: string;
  coordinates?: ICoordinates;
}

export const AddressSchema = new Schema(
  {
    street: {
      type: String,
    },
    streetNumber: {
      type: String,
    },
    additionalLines: {
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
    },
  },
  { _id: false }
);

AddressSchema.pre("save", async function () {
  if (!this.modifiedPaths().includes("coordinates")) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const object: IAddress = this.toObject();

    this.set("coordinates", await getCoordinates(object));
  }
});
