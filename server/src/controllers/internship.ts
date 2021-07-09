import { NextFunction, Request, Response } from "express";
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

  // Create Options
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
  if (!user.isAdmin && user.studentProfile?.internshipsSeen) {
    options["company.excludedFromSearch"] = false;
    if (user.studentProfile.internshipsSeen.length > 0) {
      const internshipsExcludedFromQuery = user.studentProfile?.internshipsSeen.concat(
        user.studentProfile.internship.internships
      );
      options._id = {
        $nin: internshipsExcludedFromQuery,
      };
    }
  }

  // Set select: Which fields to select?
  let select = FIELDS_VISIBLE_FOR_USER;
  if (user.isAdmin) select += FIELDS_ADDITIONALLY_VISIBLE_FOR_ADMIN;

  // Set limit: How many internships to return?
  let limit = 50;
  if (!user.isAdmin && user.studentProfile?.internshipsSeen) {
    limit = 12;
    limit = limit - user.studentProfile.internshipsSeen.length;
  }

  // Set offset if applicable
  const offset = typeof req.query.offset === "string" && parseInt(req.query.offset);

  // Query new internships
  // todo: would be nice if it returned random internships out of all possible results
  const internships = await Internship.find(options)
    .lean()
    .select(select)
    .limit(limit || 50)
    .skip(offset || 0);

  // Query internships that have already been viewed
  options._id = {
    $in: user.studentProfile?.internshipsSeen,
  };
  const internshipsSeenThatFitFilter = await Internship.find(options).lean().select(select);

  // Add newly returned internships to internshipsSeen
  if (!user.isAdmin && user.studentProfile?.internshipsSeen && internships.length > 0) {
    user.studentProfile.internshipsSeen.push(...internships.map((internship) => internship._id));
    await user.save();
  }

  // Return all internships that one has already seen and that fit the filter together with as many
  // as possible other internships that one has not yet seen and that fit the filter
  res.json(internships.concat(internshipsSeenThatFitFilter));
}
