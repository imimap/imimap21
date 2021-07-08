import { NextFunction, Request, Response } from "express";
import { FilterQuery } from "mongoose";
import { User } from "../models/user";
import { Forbidden, NotFound } from "http-errors";
import { Internship } from "../models/internship";

const FIELDS_VISIBLE_FOR_USER =
  "company tasks operationalArea programminLanguages livingCosts salary paymentTypes";
const FIELDS_ADDITIONALLY_VISIBLE_FOR_ADMIN =
  "startDate endDate workingHoursPerWeek supervisor status";

export async function getInternshipsById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email })
    .select("isAdmin studentProfile")
    .populate({
      path: "studentProfile.internship",
      lean: true,
    });

  if (!user) return next(new NotFound("User not found"));

  if (user.isAdmin || user.studentProfile?.internship.internships.includes(req.params.id)) {
    let fields = FIELDS_VISIBLE_FOR_USER;
    if (user.isAdmin) fields += FIELDS_ADDITIONALLY_VISIBLE_FOR_ADMIN; //todo: do we need more fields?
    const internship = await Internship.findById(req.params.id).lean().select(fields);
    if (!internship) return next(new Forbidden("Internship not found"));
    res.json(internship);
  } else if (user.studentProfile && req.params.id === "my") {
    res.json(user.studentProfile.internship.populate({ path: "internships", lean: true }));
  } else {
    return next(new Forbidden("You may only access your own internship."));
  }
}

export async function findInternships(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email })
    .select("isAdmin studentProfile")
    .populate({
      path: "studentProfile.internship",
      lean: true,
    });

  if (!user) return next(new NotFound("User not found"));

  let limit = 50;
  if (!user.isAdmin) {
    // calculate limit?
    //Only those that are in user.internshipsSeen or as many as this array has places available
    //> maybe fill that array first, then return that array?
    //if more results than fit into array, what should happen?
    limit = 12;
  }

  const companyQueryFields = [
    "companyName",
    "branchName",
    "country",
    "industry",
    "mainLanguage",
    "size",
  ];
  const internshipQueryFields = ["programmingLanguage", "operationalArea", "paymentType"];

  const options: { [k: string]: any } = {};

  companyQueryFields.forEach((field) => {
    if (req.params[field]) options[`company.${field}`] = req.params[field];
  });
  internshipQueryFields.forEach((field) => {
    if (req.params[field]) options[field] = req.params[field];
  });
  if (!user.isAdmin) options["company.excludedFromSearch"] = false;

  let select = FIELDS_VISIBLE_FOR_USER;
  if (user.isAdmin) select += FIELDS_ADDITIONALLY_VISIBLE_FOR_ADMIN;

  const internships = await Internship.find(options)
    .lean()
    .select(select)
    .limit(limit || 50)
    .skip((typeof req.query.offset === "string" && parseInt(req.query.offset)) || 0);

  res.json(internships);
}
