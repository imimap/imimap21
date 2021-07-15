import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { BadRequest, Forbidden, InternalServerError, NotFound } from "http-errors";
import { IInternship, Internship, InternshipStatuses, PaymentTypes } from "../models/internship";
import { Semester } from "../helpers/semesterHelper";
import { InternshipModule } from "../models/internshipModule";
import { Types } from "mongoose";
import { UploadedFile } from "express-fileupload";
import * as fsPromises from "fs/promises";
import * as pdf from "html-pdf";

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
  const user = await User.findOne({ emailAddress: req.user?.email })
    .select("isAdmin studentProfile")
    .populate({
      path: "studentProfile.internship",
      populate: { path: "internships", lean: true },
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
    const internship = await Internship.findById(internshipId).lean();
    if (!internship) return next(new NotFound("Internship not found"));
    res.json(internship);
  } else if (user.studentProfile && internshipId === "my") {
    const internships: IInternship[] = user.studentProfile.internship.internships;
    res.json(internships);
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
  if (req.query.semester) return findInternshipsInSemester(req, res, next);

  const user = await User.findOne({ emailAddress: req.user?.email })
    .select("isAdmin studentProfile")
    .populate({
      path: "studentProfile.internship",
      lean: true,
    });

  if (!user) return next(new NotFound("User not found"));

  // Create Options
  const options: { [k: string]: unknown } = {};

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

  // Query new internships
  let internships;
  if (limit <= 0) {
    internships = [];
  } else {
    if (user.isAdmin) {
      internships = await Internship.aggregate([
        // TODO: Add match on internship properties before lookup
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
      ])
        .limit(limit || 50)
        .skip(offset || 0);
    } else {
      internships = await Internship.aggregate([
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
        { $sample: { size: limit } },
      ]);
    }
  }

  // Query internships that have already been viewed
  options._id = {
    $in: user.studentProfile?.internshipsSeen,
  };

  const internshipsSeenThatFitFilter = await Internship.aggregate([
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
      return Internship.findById(id)
        .populate({
          path: "company",
          select: "address",
        })
        .lean()
        .select(select);
    })
  );

  res.json(internships);
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
  ];
  for (const prop of directProps) {
    if (propsObject[prop]) internshipProps[prop] = propsObject[prop];
  }

  const directArrayProps = ["programmingLanguages", "paymentTypes"];
  for (const prop of directArrayProps) {
    if (propsObject[prop]) internshipProps[prop] = propsObject[prop].toString().split(",");
  }

  if (propsObject.companyId) internshipProps.company = propsObject.companyId;

  //supervisor props
  if (propsObject.supervisorFullName)
    internshipProps["supervisor.fullName"] = propsObject.supervisorFullName;
  if (propsObject.supervisorEmailAddress)
    internshipProps["supervisor.emailAddress"] = propsObject.supervisorEmailAddress;

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
  const internshipProps = getInternshipObject(req.query);
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
    // Check if file was uploaded
    if (!req.files || Object.keys(req.files).length === 0)
      return next(new BadRequest("No files were uploaded"));

    // Get internship and check if it belongs to user or user is admin
    const internship = await Internship.findById(req.params.id);
    if (!internship) return next(new NotFound("Internship not found"));
    const user = await User.findOne({ emailAddress: req.user?.email }).populate({
      path: "studentProfile.internship",
      lean: true,
    });
    if (!user) return next(new NotFound("User not found"));
    if (
      user.studentProfile &&
      user.studentProfile.internship.internships.indexOf(internship._id) === -1
    )
      return next(new Forbidden("Students may only modify their own internships"));

    // Save uploaded file
    const pdf = req.files.pdf as UploadedFile;
    const uploadPath =
      internship.get(pdfProperty).nextPath() ??
      `pdfs/${user.studentProfile?.studentId}/${Types.ObjectId()}/${Types.ObjectId()}.pdf`;
    const uploadPathParts = uploadPath.split("/");
    uploadPathParts.pop();
    const uploadDir = uploadPathParts.join("/");

    try {
      await fsPromises.mkdir(uploadDir, { recursive: true });
      await pdf.mv(process.cwd() + "/" + uploadPath);
    } catch (e) {
      return next(new InternalServerError(e.message));
    }

    await internship.get(pdfProperty).submit(user._id, uploadPath);
    await internship.save();

    res.json({ path: uploadPath });
  };
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

  // Build PDF template
  const dateFormatter = new Intl.DateTimeFormat("de");
  const contentHtml = await fsPromises.readFile(`${process.cwd()}/pdf-templates/request.html`);
  const html = contentHtml.toString();
  const template = html
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
