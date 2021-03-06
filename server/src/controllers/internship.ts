import { NextFunction, Request, Response } from "express";
import { BadRequest, Forbidden, InternalServerError, NotFound } from "http-errors";
import { Internship, InternshipStatuses, PaymentTypes } from "../models/internship";
import { Semester } from "../helpers/semesterHelper";
import { InternshipModule } from "../models/internshipModule";
import { Types } from "mongoose";
import { UploadedFile } from "express-fileupload";
import {
  getAuthorizedUser,
  getAuthorizedUserWithInternshipModule,
  getUser,
  getUserWithInternshipModule,
} from "../helpers/userHelper";
import { buildHtmlTemplate, buildPDFFile, saveFile } from "../helpers/pdfHelper";
import { User } from "../models/user";
import { constants } from "http2";
import * as QueryString from "qs";

const INTERNSHIP_FIELDS_VISIBLE_FOR_USER =
  "_id company tasks operationalArea programmingLanguages livingCosts salary paymentTypes status";
const INTERNSHIP_FIELDS_ADDITIONALLY_VISIBLE_FOR_ADMIN =
  "startDate endDate workingHoursPerWeek supervisor";

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
  const internshipId = req.params.id.toString();

  if (internshipId === "random") return getRandomInternship(req, res, next);

  let user;
  try {
    user = await User.findOne({ emailAddress: req.user?.email })
      .select("isAdmin studentProfile")
      .populate({
        path: "studentProfile.internship",
        populate: { path: "internships", lean: true, populate: { path: "company", lean: true } },
        lean: true,
      });
    if (!user) return next(new NotFound("User not found"));
  } catch (e) {
    return next(e);
  }

  let result;
  if (user.isAdmin || user.hasOwnInternship(internshipId)) {
    result = await Internship.findById(internshipId)
      .populate({ path: "company", lean: true })
      .lean();
    if (!result) return next(new NotFound("Internship not found"));
  } else if (user.studentProfile && internshipId === "my") {
    result = user.studentProfile.internship.internships;
  } else {
    return next(new Forbidden("You may only access your own internship."));
  }
  res.json(result);
}

/**
 * Returns all information on certain internship for admin or on own internship for student.
 * @param req
 * @param res
 * @param next
 */
export async function getRandomInternship(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let user;
  try {
    user = await getUserWithInternshipModule(req.user?.email);
  } catch (e) {
    return next(e);
  }

  let maxOffset = await Internship.count();
  const options: { [k: string]: unknown } = {};
  if (user.studentProfile?.internship) {
    options["status"] = InternshipStatuses.PASSED;
    if (user.studentProfile.internshipsSeen && user.studentProfile.internshipsSeen.length >= 12) {
      options._id = {
        $in: user.studentProfile.internshipsSeen,
      };
      maxOffset = user.studentProfile.internshipsSeen.length;
    } else {
      options._id = {
        $nin: user.studentProfile.internship.internships,
      };
    }
  }

  const randomOffset = Math.floor(Math.random() * maxOffset);

  let select = INTERNSHIP_FIELDS_VISIBLE_FOR_USER;
  if (user.isAdmin) select += " " + INTERNSHIP_FIELDS_ADDITIONALLY_VISIBLE_FOR_ADMIN;

  const internship = await Internship.findOne(options).select(select).skip(randomOffset).lean();

  if (!internship) return next(new NotFound("Internship not found"));

  if (!user.isAdmin && user.studentProfile) {
    if (!user.studentProfile.internshipsSeen) user.studentProfile.internshipsSeen = [];
    user.studentProfile.internshipsSeen.push(internship._id);
    await user.save();
  }

  res.json(internship);
}

/**
 * Returns information on internships that fit certain search criteria eg. company.companyName or
 * programmingLanguage.
 * Returns administration information for admins only.
 * Default offset is 0. Default amount of internships returned for admins is 50.
 * Returns as many internships as a student has left in their 12-internships contingent
 * All internships returned to students are added to the student's seen internships.
 * Returned internships are selected in order, not randomly - thus, always the same internships are
 * returned for certain query.
 * @param req
 * @param res
 * @param next
 */
export async function findInternships(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (Semester.isValidSemesterString(req.query.semester as string))
    return findInternshipsInSemester(req, res, next);

  let user;
  try {
    user = await getUserWithInternshipModule(req.user?.email);
  } catch (e) {
    return next(e);
  }

  // Create Options
  const options: { [k: string]: unknown } = createInternshipQueryOptions(req.query);

  if (!user.isAdmin) {
    options["company.excludedFromSearch"] = false;
    options.status = InternshipStatuses.PASSED;
    let excludedInternships = user.studentProfile?.internship.internships || [];
    if (
      user.studentProfile?.internshipsSeen &&
      user.studentProfile.internshipsSeen.length > 0 &&
      (!req.query.seen || req.query.seen === "false")
    ) {
      const internshipsSeen = user.studentProfile.internshipsSeen;
      excludedInternships = excludedInternships.concat(internshipsSeen);
    }
    if (excludedInternships.length > 0) {
      options._id = {
        $nin: excludedInternships,
      };
    }
    if (req.query.seen === "true") {
      options._id = {
        $in: user.studentProfile?.internshipsSeen || [],
      };
    }
  }

  // Set select: Which fields to select?
  // we add status here because otherwise we select only those internships with status == passed
  let select = INTERNSHIP_FIELDS_VISIBLE_FOR_USER;
  if (user.isAdmin) select += " " + INTERNSHIP_FIELDS_ADDITIONALLY_VISIBLE_FOR_ADMIN;

  // Set limit: How many internships to return?
  let limit = typeof req.query.limit === "string" && parseInt(req.query.limit);
  if (!user.isAdmin && user.studentProfile?.internshipsSeen) {
    limit = 12;
    if (req.query.seen !== "true") limit = limit - user.studentProfile.internshipsSeen.length;
  }

  // Set offset if applicable
  const offset = typeof req.query.offset === "string" && parseInt(req.query.offset);
  // Build projection for only showing specific fields of an internship
  const projection = getProjection(select);
  projection.company = { $first: "$company" };

  const pipeline: unknown[] = [
    {
      $lookup: {
        from: "companies",
        localField: "company",
        foreignField: "_id",
        as: "company",
      },
    },
    { $project: projection },
  ];

  if (Object.keys(options).length > 0) pipeline.push({ $match: options });

  // Query new internships
  let internships;
  if (user.isAdmin) {
    internships = await Internship.aggregate(pipeline)
      .limit(limit || 50)
      .skip(offset || 0);
  } else {
    if (limit <= 0) {
      internships = [];
    } else {
      pipeline.push({ $sample: { size: limit } });
      internships = await Internship.aggregate(pipeline);
    }
  }

  // Add newly returned internships to internshipsSeen
  if (req.query.seen !== "true" && !user.isAdmin && user.studentProfile && internships.length > 0) {
    if (!user.studentProfile.internshipsSeen) user.studentProfile.internshipsSeen = [];
    user.studentProfile.internshipsSeen.push(...internships.map((internship) => internship._id));
    await user.save();
  }

  res.json(internships);
}

function createInternshipQueryOptions(query: QueryString.ParsedQs) {
  const options: { [k: string]: unknown } = {};

  if (Object.keys(query).length === 0) {
    return options;
  }

  const companyQueryFields = ["companyName", "branchName", "industry", "mainLanguage", "size"];
  companyQueryFields.forEach((field) => {
    if (query[field])
      options[`company.${field}`] = {
        $regex: query[field],
        $options: "i",
      };
  });
  if (query.country) {
    options["company.address.country"] = {
      $regex: query.country,
      $options: "i",
    };
  }
  if (query.operationalArea) {
    options.operationalArea = {
      $regex: query.operationalArea,
      $options: "i",
    };
  }
  if (query.programmingLanguage) {
    options.programmingLanguages = {
      $regex: query.programmingLanguage,
      $options: "i",
    };
  }
  if (query.paymentType) {
    options.paymentTypes = {
      $regex: query.paymentType,
      $options: "i",
    };
  }
  return options;
}

function getProjection(select: string) {
  return select.split(" ").reduce((p: { [key: string]: unknown }, field) => {
    p[field] = 1;
    return p;
  }, {});
}

/**
 * Returns amount of internships that fit certain search criteria eg. company.companyName or
 * programmingLanguage.
 * @param req
 * @param res
 * @param next
 */
export async function findInternshipsAmount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let user;
  try {
    user = await getUserWithInternshipModule(req.user?.email);
  } catch (e) {
    return next(e);
  }

  // Create Options
  const options = createInternshipQueryOptions(req.query);

  if (!user.isAdmin) {
    options["company.excludedFromSearch"] = false;
    options.status = InternshipStatuses.PASSED;
    const excludedInternships = user.studentProfile?.internship.internships || [];
    if (excludedInternships.length > 0) {
      options._id = {
        $nin: excludedInternships,
      };
    }
  }

  const projection = getProjection(INTERNSHIP_FIELDS_VISIBLE_FOR_USER);
  projection.company = { $first: "$company" };
  const facet = {
    $facet: {
      totalCount: [
        {
          $count: "count",
        },
      ],
    },
  };
  const pipeline: unknown[] = [
    {
      $lookup: {
        from: "companies",
        localField: "company",
        foreignField: "_id",
        as: "company",
      },
    },
    { $project: projection },
  ];
  if (Object.keys(options).length > 0) pipeline.push({ $match: options });
  pipeline.push(facet);

  const internships = await Internship.aggregate(pipeline);

  const count = internships[0].totalCount.length > 0 ? internships[0].totalCount[0].count : 0;

  res.json(count);
}

/**
 * Returns amount of seen internships
 * @param req
 * @param res
 * @param next
 */
export async function findInternshipsSeenAmount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let user;
  try {
    user = await getUser(req.user?.email);
  } catch (e) {
    return next(e);
  }

  res.json(user.studentProfile?.internshipsSeen?.length || 0);
}

/**
 * Returns information on internships made in a specific semester.
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
  let user;
  try {
    user = await getUser(req.user?.email);
  } catch (e) {
    return next(e);
  }

  if (!req.query.semester || !Semester.isValidSemesterString(req.query.semester.toString())) {
    return next(new NotFound("Invalid Semester String. Needs to be like WS2021 or SS2021."));
  }

  const modules = await InternshipModule.find({
    inSemester: req.query.semester.toString(),
  })
    .lean()
    .select("internships");

  const internshipIds: Types.ObjectId[] = modules.flatMap((module) => module.internships);

  let select = "_id";
  if (user.isAdmin)
    select +=
      " " +
      INTERNSHIP_FIELDS_VISIBLE_FOR_USER +
      " " +
      INTERNSHIP_FIELDS_ADDITIONALLY_VISIBLE_FOR_ADMIN;

  const internships = await Promise.all(
    internshipIds.map((id: Types.ObjectId) => {
      return Internship.findOne({
        _id: id,
        company: {
          $ne: null,
        },
      })
        .populate({
          path: "company",
          select: "address",
        })
        .lean()
        .select(select);
    })
  );

  res.json(internships.filter((internship) => internship ?? false));
}

export async function getInternshipLocations(req: Request, res: Response): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matcher: any = { internships: { $ne: [] } };
  if (req.query.semester && req.query.semester !== "") matcher.inSemester = req.query.semester;

  const locations = await InternshipModule.aggregate([
    { $match: matcher },
    { $unwind: "$internships" },
    {
      $lookup: {
        from: "internships",
        localField: "internships",
        foreignField: "_id",
        as: "internship",
      },
    },
    {
      $project: {
        internship: { $first: "$internship" },
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "internship.company",
        foreignField: "_id",
        as: "company",
      },
    },
    {
      $project: {
        company: { $first: "$company" },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          city: "$company.address.city",
          country: "$company.address.country",
          coordinates: "$company.address.coordinates",
        },
      },
    },
  ]);

  res.json(locations.filter((l) => Object.keys(l).length > 0));
}

/**
 * Returns all paymentTypes
 * Returns only paymentTypes that exist on internships
 * @param req
 * @param res
 * @param next
 */
export async function getAllPaymentTypes(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await getUser(req.user?.email);
  } catch (e) {
    return next(e);
  }

  res.json([...Object.values(PaymentTypes)]);
}

/**
 * Returns all operationalAreas
 * Returns only operationalAreas that exist on internships
 * @param req
 * @param res
 * @param next
 */
export async function getAllOperationalAreas(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await getUser(req.user?.email);
  } catch (e) {
    return next(e);
  }

  const operationalAreas: string[] = await Internship.distinct("operationalArea");

  res.json(operationalAreas);
}

/**
 * Returns all operationalAreas
 * Returns only operationalAreas that exist on internships
 * @param req
 * @param res
 * @param next
 */
export async function getAllProgrammingLanguages(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await getUser(req.user?.email);
  } catch (e) {
    return next(e);
  }

  const internships = await Internship.find().lean().select("programmingLanguages");
  const programmingLanguages: string[] = [
    ...new Set(internships.flatMap((internship) => internship.programmingLanguages || "")),
  ];

  res.json(programmingLanguages);
}

function getInternshipObject(propsObject: Record<string, unknown>) {
  const internshipProps: Record<string, unknown> = {};

  //direct props of internship
  const directProps = [
    "startDate",
    "endDate",
    "tasks",
    "operationalArea",
    "livingCosts",
    "salary",
    "workingHoursPerWeek",
    "programmingLanguages",
    "paymentTypes",
  ];
  for (const prop of directProps) {
    if (propsObject[prop] !== undefined) internshipProps[prop] = propsObject[prop];
  }

  if (propsObject.companyId !== undefined) internshipProps.company = propsObject.companyId;

  //supervisor props
  if (
    propsObject.supervisorFullName !== undefined ||
    propsObject.supervisorEmailAddress !== undefined
  ) {
    internshipProps["supervisor"] = {};
    if (propsObject.supervisorFullName !== undefined)
      (internshipProps["supervisor"] as Record<string, unknown>).fullName =
        propsObject.supervisorFullName;
    if (propsObject.supervisorEmailAddress !== undefined)
      (internshipProps["supervisor"] as Record<string, unknown>).emailAddress =
        propsObject.supervisorEmailAddress;
  }

  return internshipProps;
}

/**
 * Creates own internship
 * @param req
 * @param res
 * @param next
 */
export async function createInternship(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let user;
  try {
    user = await getUserWithInternshipModule(req.user?.email);
  } catch (e) {
    return next(e);
  }
  if (!user.studentProfile) return next(new NotFound("User does not appear to be a student"));

  // create new internship
  const internshipProps = getInternshipObject(req.body);
  const newInternship = new Internship(internshipProps);
  newInternship.events = [
    {
      creator: user._id,
      changes: internshipProps,
      comment: "New internship created",
    },
  ];
  const newlyCreatedInternship = await newInternship.save();
  if (!newlyCreatedInternship) return next(new BadRequest("Could not create internship"));

  let internshipModuleId = user.studentProfile.internship;
  let internshipModule;
  if (!internshipModuleId) {
    // create new internship module
    const newInternshipModule = new InternshipModule({});
    internshipModule = await newInternshipModule.plan();
    internshipModuleId = user.studentProfile.internship;
    user.studentProfile.internship = internshipModuleId;
  } else {
    internshipModule = await InternshipModule.findById(internshipModuleId);
  }
  if (!internshipModule) return next(new NotFound("Internship Module not found."));
  if (!internshipModule.internships) internshipModule.internships = [];

  internshipModule.internships.push(newlyCreatedInternship._id);

  await internshipModule.save();
  await user.save();
  res.json(newlyCreatedInternship);
}

/**
 * Updates an internship
 * @param req
 * @param res
 * @param next
 */
export async function updateInternship(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let user;
  try {
    user = await getAuthorizedUser(req.user?.email, req.params.id);
  } catch (e) {
    return next(e);
  }

  const internshipToUpdate = await Internship.findById(req.params.id);
  if (!internshipToUpdate) return next(new NotFound("Internship not found"));

  const mutableProps = ["salary", "paymentTypes", "livingCosts"];
  if (
    !user.isAdmin &&
    internshipToUpdate.status !== InternshipStatuses.PLANNED &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    !Object.keys(req.body).every((prop: string) => mutableProps.includes(prop))
  ) {
    return next(
      new Forbidden(
        "You may only change certain properties after your internship has been requested. Please contact your internship officer."
      )
    );
  }

  const internshipProps = getInternshipObject(req.body);
  const updateEvent = {
    creator: user._id,
    changes: internshipProps,
    comment: "Internship updated",
  };

  internshipToUpdate.events.push(updateEvent);

  Object.assign(internshipToUpdate, internshipProps);

  const savedInternship = await internshipToUpdate.save();
  if (!savedInternship) return next(new BadRequest("Could not update internship"));

  res.json(savedInternship);
}

export async function deleteInternship(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let user;
  try {
    user = await getAuthorizedUser(req.user?.email, req.params.id);
  } catch (e) {
    return next(e);
  }

  if (!user.isAdmin) return next(new Forbidden("Only admins may delete an internship"));

  const result = await Internship.findByIdAndDelete(req.params.id);
  if (!result) return next(new NotFound("Internship not found"));

  res.statusCode = constants.HTTP_STATUS_NO_CONTENT;
  res.send();
}

export async function approveInternshipApplication(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let user;
  try {
    user = await getAuthorizedUser(req.user?.email, req.params.id);
  } catch (e) {
    return next(e);
  }

  if (!user.isAdmin) return next(new Forbidden("Only admins may approve internship applications"));

  const internshipToUpdate = await Internship.findById(req.params.id);
  if (!internshipToUpdate) return next(new NotFound("Internship not found"));

  try {
    const savedInternship = await internshipToUpdate.approve(user._id);
    res.json(savedInternship);
  } catch (e) {
    return next(new BadRequest(e.message));
  }
}

export async function markInternshipAsPassed(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let user;
  try {
    user = await getAuthorizedUser(req.user?.email, req.params.id);
  } catch (e) {
    return next(e);
  }

  if (!user.isAdmin) return next(new Forbidden("Only admins may mark internships as passed"));

  const internshipToUpdate = await Internship.findById(req.params.id);
  if (!internshipToUpdate) return next(new NotFound("Internship not found"));

  try {
    const savedInternship = await internshipToUpdate.pass(user._id);
    res.json(savedInternship);
  } catch (e) {
    return next(new BadRequest(e.message));
  }
}

export function submitPdf(
  pdfProperty: string
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    // Get internship and check if it belongs to user or user is admin
    const internship = await Internship.findById(req.params.id);
    if (!internship) return next(new NotFound("Internship not found"));
    let user;
    try {
      user = await getAuthorizedUserWithInternshipModule(req.user?.email, internship._id);
    } catch (e) {
      return next(e);
    }

    // Check if user is admin and pdf document was rejected
    if (user.isAdmin && req.body.reject) {
      res.json(await internship.get(pdfProperty).reject(user._id));
      return;
    }

    // Check if file was uploaded
    if (!req.files?.pdf) {
      // Check if user is admin and file was accepted
      if (user.isAdmin && req.body.accept) {
        res.json(await internship.get(pdfProperty).accept(user._id));
        return;
      }
      return next(new BadRequest("No files were uploaded"));
    }

    // Save uploaded file
    const pdf = req.files.pdf as UploadedFile;
    const uploadPath =
      internship.get(pdfProperty).nextPath() ??
      `pdfs/${user.studentProfile?.studentId}/${Types.ObjectId()}/${Types.ObjectId()}.pdf`;
    const error = await saveFile(pdf, uploadPath);
    if (error) return next(new InternalServerError(error.message));

    // Add pdf path to internship
    let updatedPdf;
    if (user.isAdmin && req.body.accept)
      updatedPdf = await internship.get(pdfProperty).accept(user._id, uploadPath);
    else updatedPdf = await internship.get(pdfProperty).submit(user._id, uploadPath);
    await internship.save();

    res.json(updatedPdf);
  };
}

export async function generateRequestPdf(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let user;
  try {
    user = await getAuthorizedUserWithInternshipModule(req.user?.email, req.params.id);
  } catch (e) {
    return next(e);
  }
  // Load internship
  const internship = await Internship.findById(req.params.id)
    .populate({ path: "company", lean: true })
    .lean();
  if (!internship) return next(new NotFound("Internship not found"));

  // Build PDF file
  const template = await buildHtmlTemplate("request.html", user, internship);
  const pdf = await buildPDFFile(template);
  res.setHeader("Content-Type", "application/pdf");
  res.send(pdf);
}
