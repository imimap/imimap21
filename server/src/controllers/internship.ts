import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { Forbidden, NotFound } from "http-errors";
import { IInternship, Internship, InternshipStatuses } from "../models/internship";
import { Semester } from "../helpers/semesterHelper";
import { InternshipModule } from "../models/internshipModule";
import { Document, PopulatedDoc, Schema, Types } from "mongoose";

const INTERNSHIP_FIELDS_VISIBLE_FOR_USER =
  "_id company tasks operationalArea programminLanguages livingCosts salary paymentTypes";
const INTERNSHIP_FIELDS_ADDITIONALLY_VISIBLE_FOR_ADMIN =
  "startDate endDate workingHoursPerWeek supervisor status";

/**
 * Returns all information on certain internship for admin or on own internship for student.
 * @param req
 * @param res
 * @param next
 */
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
    const internship = await Internship.findById(req.params.id).lean();
    if (!internship) return next(new Forbidden("Internship not found"));
    res.json(internship);
  } else if (user.studentProfile && req.params.id === "my") {
    res.json(user.studentProfile.internship.populate({ path: "internships", lean: true }));
  } else {
    return next(new Forbidden("You may only access your own internship."));
  }
}

/**
 * Returns information on internships that fit certain search criteria eg. company.companyName or
 * programmingLanguage.
 * Returns administration information for admins only.
 * Default offset is 0. Default amount of internships returned for admins is 50.
 * Returns as many internships as a student has left in their 12-internships contingent
 * All internships returned to students are added to the student's seen internships.
 * Returned internships are selected in order, not randomly - thus, always the same internships are
 * returned for certain query. Todo: add randomness.
 * @param req
 * @param res
 * @param next
 */
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
  let select = INTERNSHIP_FIELDS_VISIBLE_FOR_USER;
  if (user.isAdmin) select += " " + INTERNSHIP_FIELDS_ADDITIONALLY_VISIBLE_FOR_ADMIN;

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

/**
 * Returns information on internships made in a specific semester.
 * Returns information from at maximum 50 modules (default limit), with a default offset of 0.
 * For users only returns the id and company address, for admins returns more information.
 * @param req
 * @param res
 * @param next
 */
export async function findInternshipsInSemester(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));

  if (!req.query.semester || !Semester.isValidSemesterString(req.query.semester.toString())) {
    return next(new NotFound("Invalid Semester String. Needs to be like WS2021 or SS2021."));
  }

  // Set limit: How many internships to return?
  const limit = 50;

  // Set offset if applicable
  const offset = typeof req.query.offset === "string" && parseInt(req.query.offset);

  const modules = await InternshipModule.find({
    inSemester: req.query.semester.toString(),
  })
    .select("internships")
    .limit(limit || 50)
    .skip(offset || 0);

  const internshipIds: Types.ObjectId[] = modules.flatMap((module) => module.internships);

  let select = "_id company.address";
  if (user.isAdmin)
    select += INTERNSHIP_FIELDS_VISIBLE_FOR_USER + INTERNSHIP_FIELDS_ADDITIONALLY_VISIBLE_FOR_ADMIN;

  const internships = internshipIds.map(async (id) => {
    await Internship.findById(id).select(select).lean();
  });

  res.json(internships);
}
