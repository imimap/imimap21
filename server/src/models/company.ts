import { Document, model, Model, Schema } from "mongoose";
import { IAddress, AddressSchema } from "./address";

enum Size {
  BIG = "big", //alles andere groß
  MEDIUM = "medium", // <250 mittel
  SMALL = "small", // <50 klein
};

export interface ICompany extends Document {
  companyName: string,
  branchName: string,
  address: IAddress,
  emailAddress: string,
  industry: string,
  website: string,
  mainLanguage: string,
  size: Size,
  comment: string,
  excludedFromSearch: boolean,
}

const CompanySchema = new Schema({

});

export const Company: Model<ICompany> = model("Company", CompanySchema);
