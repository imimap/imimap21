import { NextFunction, Request, Response } from "express";
import { IUser, User } from "../models/user";
import { BadRequest, Forbidden, InternalServerError, NotFound } from "http-errors";
import { IInternship, Internship, InternshipStatuses, PaymentTypes } from "../models/internship";
import { Semester } from "../helpers/semesterHelper";
import { InternshipModule } from "../models/internshipModule";
import { LeanDocument, Types } from "mongoose";
import { UploadedFile } from "express-fileupload";
import * as fsPromises from "fs/promises";
import * as pdf from "html-pdf";
import {Evaluation} from "../models/evaluation";

const INTERNSHIP_FIELDS_VISIBLE_FOR_USER =
  "_id company tasks operationalArea programmingLanguages livingCosts salary paymentTypes";
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
  if (req.params.id === "random") return getRandomInternship(req, res, next);

  const user = await User.findOne({ emailAddress: req.user?.email })
    .select("isAdmin studentProfile")
    .populate({
      path: "studentProfile.internship",
      populate: { path: "internships", lean: true, populate: { path: "company", lean: true } },
      lean: true,
    });

  if (!user) return next(new NotFound("User not found"));

  const internshipId = req.params.id.toString();

  if (
    user.isAdmin ||
    user.studentProfile?.internship.internships.some(
      (internship: IInternship) => internship._id.toString() === internshipId
    )
  ) {
    const internship = await Internship.findById(internshipId)
      .populate({ path: "company", lean: true })
      .lean();
    if (!internship) return next(new NotFound("Internship not found"));

    if(internship.status === InternshipStatuses.PLANNED && internship.evaluationFile === undefined) {
      // @ts-ignore
      const inSemester = user.studentProfile.internship.inSemester;
      // @ts-ignore
      internship.evaluationFile = await Evaluation.findOne({"inSemester": inSemester, "isPublished": true});
      if(internship.evaluationFile) {
        await Internship.findOneAndUpdate({ _id: internshipId }, {evaluationFile: internship.evaluationFile});
      }
    }
    res.json(internship);
  } else if (user.studentProfile && internshipId === "my") {
    const internships: IInternship[] = user.studentProfile.internship.internships;
    res.json(internships);
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
  const user = await User.findOne({ emailAddress: req.user?.email })
    .select("isAdmin studentProfile")
    .populate({
      path: "studentProfile.internship",
      lean: true,
    });
  if (!user) return next(new NotFound("User not found"));

  let select = INTERNSHIP_FIELDS_VISIBLE_FOR_USER;
  if (user.isAdmin) select += " " + INTERNSHIP_FIELDS_ADDITIONALLY_VISIBLE_FOR_ADMIN;

  let maxOffset = await Internship.count();
  const options: { [k: string]: unknown } = {};
  if (user.studentProfile?.internship) {
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

  const internship = await Internship.findOne(options).select(select).skip(randomOffset).lean();

  if (!internship) return next(new NotFound("Internship not found"));

  if (user.studentProfile) {
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

  const user = await User.findOne({ emailAddress: req.user?.email })
    .select("isAdmin studentProfile")
    .populate({
      path: "studentProfile.internship",
      lean: true,
    });

  if (!user) return next(new NotFound("User not found"));

  // Create Options
  const options: { [k: string]: unknown } = {};

  if (
    req.query.seen === "true" &&
    user.studentProfile?.internshipsSeen &&
    user.studentProfile.internshipsSeen.length > 0
  ) {
    options._id = {
      $in: user.studentProfile.internshipsSeen,
    };
  }

  const companyQueryFields = ["companyName", "branchName", "industry", "mainLanguage", "size"];
  companyQueryFields.forEach((field) => {
    if (req.query[field])
      options[`company.${field}`] = {
        $regex: req.query[field],
        $options: "i",
      };
  });
  if (req.query.country) {
    options["company.address.country"] = {
      $regex: req.query.country,
      $options: "i",
    };
  }
  if (req.query.operationalArea) {
    options.operationalArea = {
      $regex: req.query.operationalArea,
      $options: "i",
    };
  }
  if (req.query.programmingLanguage) {
    options.programmingLanguages = {
      $regex: req.query.programmingLanguage,
      $options: "i",
    };
  }
  if (req.query.paymentType) {
    options.paymentTypes = {
      $regex: req.query.paymentType,
      $options: "i",
    };
  }

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
  let limit = typeof req.query.limit === "string" && parseInt(req.query.limit);
  if (!user.isAdmin && user.studentProfile?.internshipsSeen) {
    limit = 12;
    limit = limit - user.studentProfile.internshipsSeen.length;
  }

  // Set offset if applicable
  const offset = typeof req.query.offset === "string" && parseInt(req.query.offset);
  // Build projection for only showing specific fields of an internship
  const projection = select.split(" ").reduce((p: { [key: string]: unknown }, field) => {
    p[field] = 1;
    return p;
  }, {});
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

  // Query internships that have already been viewed
  let internshipsSeenThatFitFilter = [];
  if (user.studentProfile) {
    options._id = {
      $in: user.studentProfile?.internshipsSeen,
    };

    internshipsSeenThatFitFilter = await Internship.aggregate([
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
    ]);
  }

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
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));

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
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));

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
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));

  const internships = await Internship.find().lean().select("programmingLanguages");
  const programmingLanguages: string[] = [
    ...new Set(internships.flatMap((internship) => internship.programmingLanguages || "")),
  ];

  res.json(programmingLanguages);
}

function getInternshipObject(propsObject: any) {
  const internshipProps: { [k: string]: unknown } = {};

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
    "evaluationFile",
  ];
  for (const prop of directProps) {
    if (propsObject[prop]) internshipProps[prop] = propsObject[prop];
  }

  if (propsObject.companyId) internshipProps.company = propsObject.companyId;

  //supervisor props
  internshipProps["supervisor"] = {
    fullName: propsObject.supervisorFullName,
    emailAddress: propsObject.supervisorEmailAddress,
  };

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
  const user = await User.findOne({ emailAddress: req.user?.email })
    .select("isAdmin studentProfile")
    .populate({
      path: "studentProfile.internship",
      lean: true,
    });

  if (!user) return next(new NotFound("User not found"));
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

  if (!user.studentProfile.internship) {
    // create new internship module
    const newInternshipModule = new InternshipModule({
      internships: [newlyCreatedInternship._id],
    });
    const newlyPlannedInternshipModule = await newInternshipModule.plan();
    user.studentProfile.internship = newlyPlannedInternshipModule._id;
  } else {
    user.studentProfile.internship.internships.push(newlyCreatedInternship._id);
  }
  await user.studentProfile.internship.save();
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
  const user = await User.findOne({ emailAddress: req.user?.email })
    .select("isAdmin studentProfile")
    .populate({
      path: "studentProfile.internship",
      lean: true,
    });

  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) {
    if (!user.studentProfile) return next(new NotFound("Student not found"));
    if (!user.studentProfile.internship.internships.includes(req.params.id))
      return next(new Forbidden("You may only edit your own internship"));
  }

  const internshipToUpdate = await Internship.findById(req.params.id);
  if (!internshipToUpdate) return next(new NotFound("Internship not found"));

  const mutableProps = ["salary", "paymentTypes", "livingCosts"];
  if (
    !user.isAdmin &&
    internshipToUpdate.status !== InternshipStatuses.PLANNED &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    !Object.keys(req.query).every((prop: string) => mutableProps.includes(prop))
  ) {
    return next(
      new Forbidden(
        "You may only change certain properties after your internship has been approved. Please contact your internship officer."
      )
    );
  }

  for (const prop in req.query) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    internshipToUpdate[prop] = req.query[prop];
  }

  const internshipProps = getInternshipObject(req.query);
  const updateEvent = {
    creator: user._id,
    changes: internshipProps,
    comment: "Internship updated",
  };

  internshipToUpdate.events.push(updateEvent);

  const savedInternship = await internshipToUpdate.save();
  if (!savedInternship) return next(new BadRequest("Could not update internship"));

  res.json(savedInternship);
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
      user = await getAuthorizedUser(req.user?.email, internship._id);
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

/**
 * Returns the authorized user with the specified email address.
 * @throws NotFound If the user was not found
 * @throws Forbidden If the user id not authorized to access the internship with the provided id.
 * @param emailAddress The email address of the user to find.
 * @param internshipId The internship id to use for the authorization check.
 * @returns IUser The authorized user
 */
async function getAuthorizedUser(
  emailAddress: string | undefined,
  internshipId: Types.ObjectId
): Promise<IUser> {
  const user = await User.findOne({ emailAddress: emailAddress }).populate({
    path: "studentProfile.internship",
    lean: true,
  });
  if (!user) throw new NotFound("User not found");
  if (
    user.studentProfile &&
    user.studentProfile.internship.internships.indexOf(internshipId) === -1
  )
    throw new Forbidden("Students may only modify their own internships");
  return user;
}

/**
 * Saves an uploaded file to the disk.
 * @param file The file to save
 * @param path The path to save the file to
 * @returns Error|null Returns null if saving the file was successful, otherwise returns error
 */
async function saveFile(file: UploadedFile, path: string): Promise<Error | null> {
  // Get path without filename
  const uploadPathParts = path.split("/");
  uploadPathParts.pop();
  const uploadDir = uploadPathParts.join("/");

  try {
    // Create parent directories if necessary
    await fsPromises.mkdir(uploadDir, { recursive: true });
    // Save file
    await file.mv(process.cwd() + "/" + path);
  } catch (e) {
    return e;
  }

  return null;
}

export async function generateRequestPdf(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).populate({
    path: "studentProfile.internship",
    lean: true,
  });
  // Check if user exists and has permissions to generate request PDF for requested internship
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin && user.studentProfile?.internship.internships.indexOf(req.params.id) === -1)
    return next(new Forbidden("Students may only generate request PDFs for their own internships"));
  // Load internship
  const internship = await Internship.findById(req.params.id)
    .populate({ path: "company", lean: true })
    .lean();
  if (!internship) return next(new NotFound("Internship not found"));

  // Build PDF file
  const template = await buildHtmlTemplate("request.html", user, internship);
  try {
    pdf
      .create(template, { format: "A4", border: "20px", header: { height: "50px" } })
      .toStream((err, stream) => {
        if (err) throw err;
        res.setHeader("Content-Type", "application/pdf");
        stream.pipe(res);
      });
  } catch (e) {
    next(new BadRequest(e));
  }
}

/**
 * Loads a HTML file template and replaces the placeholders with the user's actual data.
 * @param fileName The file to load the template from
 * @param user The user to use for filling in the data
 * @param internship The internship to use for filling in the data
 * @returns string The generated HTML template
 */
async function buildHtmlTemplate(
  fileName: string,
  user: LeanDocument<IUser>,
  internship: LeanDocument<IInternship>
): Promise<string> {
  const dateFormatter = new Intl.DateTimeFormat("de");
  const contentHtml = await fsPromises.readFile(`${process.cwd()}/pdf-templates/${fileName}`);
  const html = contentHtml.toString();
  return html
    .replace("{{semester}}", user.studentProfile?.internship.inSemester ?? "")
    .replace("{{studentId}}", user.studentProfile?.studentId ?? "")
    .replace("{{firstName}}", user.firstName ?? "")
    .replace("{{lastName}}", user.lastName ?? "")
    .replace("{{emailAddress}}", user.emailAddress ?? "")
    .replace("{{company}}", internship.company.companyName ?? "")
    .replace(
      "{{street}}",
      `${internship.company.address.street ?? ""} ${internship.company.address.streetNumber ?? ""}`
    )
    .replace("{{zipCode}}", internship.company.address.zip ?? "")
    .replace("{{city}}", internship.company.address.city ?? "")
    .replace("{{country}}", internship.company.address.country ?? "")
    .replace("{{supervisor}}", internship.supervisor?.fullName ?? "")
    .replace("{{supervisor.emailAddress}}", internship.supervisor?.emailAddress ?? "")
    .replace(
      "{{startDate}}",
      internship.startDate ? dateFormatter.format(internship.startDate) : ""
    )
    .replace("{{endDate}}", internship.endDate ? dateFormatter.format(internship.endDate) : "")
    .replace("{{semesterOfStudy}}", user.studentProfile?.internship.inSemesterOfStudy ?? "")
    .replace("{{operationalArea}}", internship.operationalArea ?? "")
    .replace("{{tasks}}", internship.tasks ?? "")
    .replace("{{programmingLanguages}}", internship.programmingLanguages?.join(", ") ?? "");
}

/**
* Updates an answer in evaluationFile of an internship
* @param req
* @param res
* @param next
*/
export async function updateAnswerOnInternship(
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
  if (!user.isAdmin) {
    if (!user.studentProfile) return next(new NotFound("Student not found"));
    if (!user.studentProfile.internship.internships.includes(req.params.id))
      return next(new Forbidden("You may only edit your own internship"));
  }

  const internshipToUpdate = await Internship.findById(req.params.id);
  if (!internshipToUpdate) return next(new NotFound("Internship not found"));

  // @ts-ignore
  const question = internshipToUpdate.evaluationFile.questions.id(req.query.id);
  question.answerTextContent = req.query.answerTextContent;
  question.studentAllowsToPublish = req.query.studentAllowsToPublish;
  question.answerUpdatedAt = Date.now();
  const savedInternship = await internshipToUpdate.save();
  if (!savedInternship) return next(new BadRequest("Could not update internship"));

  res.json(internshipToUpdate);
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
export async function getInternshipEvaluation(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may get the internships."));

  const internships = await Internship.find({ 'evaluationFile.inSemester': req.query.semester });
  if (!internships) return next(new NotFound("No Internship with evaluation files found"));

  const mapInternshipsIdQuestions = new Map();

  for(const internship of internships) {
    const internshipModule = await InternshipModule.find({ internships: internship.id });
    const student = await User.findOne({ "studentProfile.internship": internshipModule[0]._id });
    // @ts-ignore
    const question = internship.evaluationFile.questions.id(req.query.questionId);
    mapInternshipsIdQuestions.set(internship.id,{question, student});
  }

  res.json(Array.from(mapInternshipsIdQuestions));
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
export async function updateAnswerToPublish(req: Request, res: Response, next: NextFunction): Promise<void> {

  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may get/edit the internships."));

  const internshipToUpdate = await Internship.findById(req.params.id);
  if (!internshipToUpdate) return next(new NotFound("Internship not found"));

  console.log(internshipToUpdate);
  console.log(req.query.questionId);

  // @ts-ignore
  const question = internshipToUpdate.evaluationFile.questions.id(req.query.questionId);
  question.isAnswerReviewed = req.query.isAnswerReviewed;
  question.isAnswerPublished = req.query.isAnswerPublished;

  const savedInternship = await internshipToUpdate.save();
  if (!savedInternship) return next(new BadRequest("Could not update internship"));

  res.json(savedInternship);
}

/**
 * Returns filtered information of possible evlaution forms of an intership
 * from different semesters to the student
 * @param req
 * @param res
 * @param next
 */
export async function getAllInternshipsInCompany(
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
  if (!user.isAdmin) {
    if (!user.studentProfile) return next(new NotFound("Student not found"));
  }

  const INTERNSHIP_FIELDS_QUESTION_ANSWER =
    "evaluationFile.inSemester " +
    "evaluationFile.questions.title " +
    "evaluationFile.questions.textContent " +
    "evaluationFile.questions.answerTextContent " +
    "evaluationFile.questions.studentAllowsToPublish " +
    "evaluationFile.questions.isAnswerPublished";

  const internshipsToShow = await Internship.find({ company: req.params.id })
    .select(INTERNSHIP_FIELDS_QUESTION_ANSWER);
  if (!internshipsToShow) return next(new NotFound("Internship not found"));

  const evaluationsAndProfiles = new Map();
  let inSemester = '';

  for (let[index, internship] of internshipsToShow.entries()) {
    let questions = [];
    if(internship.evaluationFile) {
      inSemester = internship.evaluationFile.inSemester;
      console.log(inSemester);
      for(const question of internship.evaluationFile.questions) {
        if(question.studentAllowsToPublish && question.isAnswerPublished) {
          questions.push(question);
        }
      }
    }

    const internshipModule = await InternshipModule.find({ internships: internship.id });
    const internshipOwner = await User.findOne({ "studentProfile.internship": internshipModule[0]._id, "studentProfile.showMyProfile": true }, {_id: false, emailAddress: true, firstName: true});

    evaluationsAndProfiles.set(index, {internshipOwner, questions, inSemester});
  }

  res.json(Array.from(evaluationsAndProfiles));
}
