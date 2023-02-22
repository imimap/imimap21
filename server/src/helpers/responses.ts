import { IInternship } from "../models/internship";
import { LeanDocument } from "mongoose";
import { IInternshipModule } from "../models/internshipModule";

type Internship = LeanDocument<IInternship> | IInternship;

function fromInternship(entity: Internship, createAdminResponse = false): Partial<IInternship> {
  const response = ("toObject" in entity ? entity?.toObject() : entity) as Partial<IInternship>;

  if (!createAdminResponse) {
    delete response.comments;
  }
  delete response.__v;
  delete response.company.__v;

  return response;
}

type InternshipModule = LeanDocument<IInternshipModule> | IInternshipModule;

function fromInternshipModule(
  entity: InternshipModule,
  createAdminResponse = false
): Partial<IInternshipModule> {
  const response = (
    "toObject" in entity ? entity?.toObject() : entity
  ) as Partial<IInternshipModule>;

  if (response.internships) {
    for (let i = 0; i < response.internships.length; i++) {
      if (!createAdminResponse) {
        delete response.internships[i].comments;
      }
      delete response.internships[i].__v;
      delete response.internships[i].company.__v;
    }
  }

  delete response.__v;

  return response;
}

export default {
  fromInternship,
  fromInternshipModule,
};
