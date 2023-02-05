import { NextFunction, Request, Response } from "express";
import { BadRequest, Forbidden, InternalServerError, NotFound } from "http-errors";
import { IInternship, Internship, InternshipStatuses, PaymentTypes } from "../models/internship";
import { Semester } from "../helpers/semesterHelper";
import { InternshipModule } from "../models/internshipModule";
import { LeanDocument, Types } from "mongoose";
import { UploadedFile } from "express-fileupload";
import {
  getAuthorizedUser,
  getAuthorizedUserWithInternshipModule,
  getUser,
  getUserWithInternshipModule,
} from "../helpers/userHelper";
import { buildHtmlTemplate, buildPDFFile, saveFile } from "../helpers/pdfHelper";
import { IUser, User } from "../models/user";
import { constants } from "http2";
import { ICompany } from "../models/company";
import { collectInternships } from "./company";
import {
  createInternshipQueryOptions,
  getProjection,
  INTERNSHIP_FIELDS_ADDITIONALLY_VISIBLE_FOR_ADMIN,
  INTERNSHIP_FIELDS_VISIBLE_FOR_USER,
} from "../helpers/internshipHelper";
import { EventTypes } from "../models/event";
import path from "path";
import Responses from "../helpers/responses";

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

  let user: IUser | null;
  try {
    user = await User.findOne({ emailAddress: req.user?.email })
      .select("isAdmin studentProfile")
      .populate({
        path: "studentProfile.internship",
        populate: { path: "internships", populate: { path: "company" } },
      });
    if (!user) return next(new NotFound("User not found"));
  } catch (e) {
    return next(e);
  }

  let result;
  if (user.isAdmin || (await user.hasOwnInternship(internshipId))) {
    result = await Internship.findById(internshipId)
      .populate({ path: "company", lean: true })
      .lean();
    if (!result) return next(new NotFound("Internship not found"));
    // TODO: Remove type assertion after removing `extends Document` from IInternship
    res.json(Responses.fromInternship(result as IInternship, user.isAdmin));
  } else if (user.studentProfile && internshipId === "my") {
    result = user.studentProfile.internship.internships;
    res.json(result.map((i: IInternship) => Responses.fromInternship(i, user?.isAdmin)));
  } else {
    return next(new Forbidden("You may only access your own internship."));
  }
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
    if (user.studentProfile.companiesSeen && user.studentProfile.companiesSeen.length >= 12) {
      options._id = {
        $in: user.studentProfile.companiesSeen,
      };
      maxOffset = user.studentProfile.companiesSeen.length;
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
    if (!user.studentProfile.companiesSeen) user.studentProfile.companiesSeen = [];
    user.studentProfile.companiesSeen.push(internship.company._id); //TODO: check if it works like that
    await user.save();
  }

  res.json(Responses.fromInternship(internship));
}

/**
 * Returns information on internships that fit certain search criteria e.g. company.companyName or
 * programmingLanguage.
 * Returns administration information for admins only.
 * Default offset is 0. Default amount of internships returned for admins is 50.
 * Returns as many internships as a student has left in their 12-companies contingent
 * All companies returned to students are added to the student's seen companies.
 * Internships that took place at the same company do therefore not exceed the limit.
 * @param req
 * @param res
 * @param next
 */
export async function getSearchResults(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (Semester.isValidSemesterString(req.query.semester as string))
    return findInternshipsInSemester(req, res, next);

  let user: IUser;
  try {
    user = await getUserWithInternshipModule(req.user?.email);
  } catch (e) {
    return next(e);
  }

  // Create Options
  const options: { [k: string]: unknown } = createInternshipQueryOptions(req.query);
  const excludedCompanies = [] as ICompany[];

  if (!user.isAdmin) {
    options["company.excludedFromSearch"] = false;
    options.status = InternshipStatuses.PASSED;
    for (const i in user.studentProfile?.internship.internships) {
      const company = (i as unknown as InstanceType<typeof Internship>).company;
      excludedCompanies.push(company);
    }
    if (excludedCompanies.length > 0) {
      options._id = {
        $nin: excludedCompanies,
      };
    }
  }

  // Set select: Which fields to select?
  // for students only passed internships get retured
  let select = INTERNSHIP_FIELDS_VISIBLE_FOR_USER;
  if (user.isAdmin) select += " " + INTERNSHIP_FIELDS_ADDITIONALLY_VISIBLE_FOR_ADMIN;

  // Set limit: How many internships to return?
  let limit = typeof req.query.limit === "string" && parseInt(req.query.limit);
  if (!user.isAdmin && user.studentProfile?.companiesSeen) {
    limit = 12 - user.studentProfile.companiesSeen.length;
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
    { $match: options },
    {
      $group: {
        _id: "$company._id",
        internships: { $addToSet: "$$CURRENT" },
      },
    },
  ];

  let companiesWithInternships: any[] = [];
  const searchResults = [];

  //returns companies with a list of internships fitting the search criteria that happened at that company
  companiesWithInternships = await queryCompaniesWithInternships(user, pipeline, limit, offset);

  if (!user.isAdmin && user.studentProfile) {
    //fetch previously seen internships of student
    let internshipsOfSeenCompanies = await collectInternships(user);
    internshipsOfSeenCompanies = internshipsOfSeenCompanies.map((i) => i._id);
    if (!user.studentProfile.companiesSeen) user.studentProfile.companiesSeen = [];
    let processed = 0;

    //for each company in the result go through the internship list
    for (const company in companiesWithInternships) {
      for (const internship in companiesWithInternships[company].internships) {
        if (
          //internship fits search criteria and has already been seen-> add to results
          internshipsOfSeenCompanies.some((doc) =>
            doc.equals(companiesWithInternships[company].internships[internship]._id)
          )
        ) {
          searchResults.push(companiesWithInternships[company].internships[internship]);
        } else if (
          //internship fits criteria but has not been seen, but the company had been seen
          user.studentProfile.companiesSeen.some((doc) =>
            doc.equals(companiesWithInternships[company]._id)
          )
        ) {
          searchResults.push(companiesWithInternships[company].internships[internship]);
        } else {
          if (processed < limit) {
            //internship has not been seen and meets criteria --> add to result and add company to seen list
            searchResults.push(companiesWithInternships[company].internships[internship]);
            user.studentProfile.companiesSeen.push(companiesWithInternships[company]._id);
            processed++;
          }
        }
      }
      await user.save();
    }
  } else {
    //user is admin, just add all internships of the found companies
    for (const company in companiesWithInternships) {
      for (const internship in companiesWithInternships[company].internships) {
        searchResults.push(companiesWithInternships[company].internships[internship]);
      }
    }
  }
  res.json(searchResults);
}

async function queryCompaniesWithInternships(
  user: IUser,
  pipeline: unknown[],
  limit: number | false,
  offset: number | false
): Promise<any[]> {
  let internships;
  if (user.isAdmin) {
    internships = await Internship.aggregate(pipeline)
      .limit(limit || 50)
      .skip(offset || 0);
  } else {
    if (limit <= 0) {
      internships = [];
    } else {
      internships = await Internship.aggregate(pipeline);
    }
  }
  return internships.map((i) => Responses.fromInternship(i, user.isAdmin));
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
  let user: IUser;
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

  res.json(
    internships
      .filter((internship) => internship ?? false)
      .map((i) => Responses.fromInternship(i as LeanDocument<IInternship>, user.isAdmin))
  );
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
  if (propsObject.supervisor !== undefined) {
    internshipProps["supervisor"] = propsObject.supervisor;
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
      type: EventTypes.INTERNSHIP_CREATE,
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
  res.json(Responses.fromInternship(newlyCreatedInternship, user.isAdmin));
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

  if (!user.isAdmin && internshipToUpdate.status === InternshipStatuses.PASSED) {
    return next(
      new Forbidden(
        "It is not allowed to edit an internship when it is passed. Please contact your internship officer."
      )
    );
  }
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
    type: EventTypes.INTERNSHIP_UPDATE,
    creator: user._id,
    changes: internshipProps,
    comment: "Internship updated",
  };

  internshipToUpdate.events.push(updateEvent);

  Object.assign(internshipToUpdate, internshipProps);

  const savedInternship = await internshipToUpdate.save();
  if (!savedInternship) return next(new BadRequest("Could not update internship"));

  res.json(Responses.fromInternship(savedInternship, user.isAdmin));
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

  const internship = await Internship.findById(req.params.id);
  if (!internship) return next(new NotFound("Internship not found"));

  if (
    internship.status !== InternshipStatuses.PLANNED &&
    internship.status !== InternshipStatuses.UNKNOWN
  ) {
    if (!user.isAdmin) return next(new Forbidden("Only admins may delete an internship"));
  }

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
    res.json(Responses.fromInternship(savedInternship, user.isAdmin));
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
    res.json(Responses.fromInternship(savedInternship, user.isAdmin));
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
    const student = await getStudentDetails(user, internship._id);
    const nextFileId = internship.get(pdfProperty).nextFileId();
    const pdfType = pdfProperty.replace("Pdf", "");
    const fileName = `${student.id}_${student.name}_${pdfType}_${nextFileId}.pdf`;
    const uploadPath = path.join("pdfs", student.id, fileName);
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

/**
 * Get student id from authenticated user or, if auth user is admin
 * from database using the internship id.
 * @param user The authenticated user
 * @param internshipId The internship id to use for database lookup
 *                     if authenticated user is not the student
 */
async function getStudentDetails(
  user: IUser,
  internshipId: Types.ObjectId
): Promise<{ id: string; name: string }> {
  if (user.studentProfile) {
    return {
      id: user.studentProfile.studentId,
      name: user.lastName ?? "no-name",
    };
  } else {
    const student = await getUserFromInternshipId(internshipId);
    if (!student.studentProfile)
      throw new Error("Student without student profile detected. This should never be the case!");
    return {
      id: student.studentProfile.studentId,
      name: student.lastName ?? "no-name",
    };
  }
}

/**
 * Find the user whom the given internship id belongs to.
 * @param internshipId The internship id of the user
 */
async function getUserFromInternshipId(internshipId: Types.ObjectId): Promise<IUser> {
  const users = await User.aggregate([
    {
      $lookup: {
        from: "internshipmodules",
        localField: "studentProfile.internship",
        foreignField: "_id",
        as: "internship",
      },
    },
    { $match: { "internship.internships": internshipId } },
  ]);
  return users[0];
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

export async function addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  let user;
  try {
    user = await getAuthorizedUser(req.user?.email, req.params.id);
  } catch (e) {
    return next(e);
  }

  if (!user.isAdmin) return next(new Forbidden("Only admins may mark internships as passed"));

  const internship = await Internship.findById(req.params.id);
  if (!internship) return next(new NotFound("Internship not found"));

  internship.comments.push({
    author: user._id,
    content: req.body.content,
  });
  const updatedInternship = await internship.save();

  res.json(Responses.fromInternship(updatedInternship, user.isAdmin));
}

export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let user: IUser;
  try {
    user = await getAuthorizedUser(req.user?.email, req.params.id);
  } catch (e) {
    return next(e);
  }

  const internship = await Internship.findById(req.params.id);
  if (!internship) return next(new NotFound("Internship not found"));

  const commentIndex = internship.comments.findIndex(
    (c) => c._id?.equals(req.params.commentId) && c.author.equals(user._id)
  );
  if (commentIndex === -1) return next(new NotFound("Comment not found"));

  internship.comments.splice(commentIndex, 1);
  const updatedInternship = await internship.save();

  res.json(Responses.fromInternship(updatedInternship, user.isAdmin));
}
