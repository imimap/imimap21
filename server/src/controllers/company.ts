import { NextFunction, Request, Response } from "express";
import { IUser, User } from "../models/user";
import { BadRequest, Forbidden, NotFound } from "http-errors";
import { Company } from "../models/company";
import { getCompanyObject } from "../helpers/companyHelper";
import { constants } from "http2";
import { getUser, getUserWithInternshipModule } from "../helpers/userHelper";
import {
  createInternshipQueryOptions,
  getProjection,
  INTERNSHIP_FIELDS_ADDITIONALLY_VISIBLE_FOR_ADMIN,
  INTERNSHIP_FIELDS_VISIBLE_FOR_USER,
} from "./internship";
import { Internship, InternshipStatuses } from "../models/internship";

/**
 * Returns all companies to admins
 * limit default = 50, offset default = 0
 * @param req
 * @param res
 * @param next
 */
export async function getAllCompanies(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (req.query.companyName || req.query.branchName) return searchCompanyByName(req, res, next);

  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may get all companies."));

  const limit = typeof req.query.limit === "string" && parseInt(req.query.limit);
  const offset = typeof req.query.offset === "string" && parseInt(req.query.offset);

  const companies = await Company.find()
    .limit(limit || 50)
    .skip(offset || 0);

  res.json(companies);
}

export async function getCompanyById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may get all company details."));

  const companyId = req.params.id.toString();

  if (user.isAdmin) {
    const company = await Company.findById(companyId).lean();
    if (!company) return next(new NotFound("Company not found"));
    res.json(company);
  } else {
    return next(new Forbidden("You are not allowed to fetch company details."));
  }
}

/**
 * Returns a company that fits a certain company name and optionally branch name
 * @param req
 * @param res
 * @param next
 */
export async function searchCompanyByName(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));

  const searchOptions: { [k: string]: any } = {};
  const cn = req.query.companyName as string;

  if (cn) {
    if (cn.length < 2) {
      //so students won't find companies by randomly typing one letter
      res.json(null);
      return;
    }
    searchOptions.companyName = {
      $regex: req.query.companyName,
      $options: "i",
    };
  }

  if (req.query.branchName) {
    searchOptions.branchName = {
      $regex: req.query.branchName,
      $options: "i",
    };
  }

  searchOptions.excludedFromSearch = false;

  let select = null;
  if (!user.isAdmin)
    select =
      "companyName branchName address.country address.city address.street address.streetNumber";

  const companies = await Company.findOne(searchOptions).select(select).lean();

  res.json(companies);
}

/**
 * Returns all cities or cities in a specific countries
 * Returns only cities that are internship locations
 * @param req
 * @param res
 * @param next
 */
export async function getCities(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));

  const options: Record<string, unknown> = {};
  if (req.params.country) options["address.country"] = req.params.country;

  const cities: string[] = await Company.find(options).distinct("address.city");

  res.json(cities);
}

/**
 * Returns all countries
 * Returns only countries that are internship locations
 * Default limit = 50, default offset = 0
 * @param req
 * @param res
 * @param next
 */
export async function getAllCountries(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));

  const countries: string[] = await Company.distinct("address.country");

  res.json(countries);
}

/**
 * Creates new company
 * @param req
 * @param res
 * @param next
 */
export async function createCompany(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let savedCompany;
  try {
    const companyProps = getCompanyObject(req.body);
    const newCompany = new Company(companyProps);
    savedCompany = await newCompany.save();
  } catch (e) {
    return next(e);
  }

  res.json(savedCompany);
}

/**
 * Update company
 * @param req
 * @param res
 * @param next
 */
export async function updateCompany(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await User.findOne({ emailAddress: req.user?.email }).lean().select("isAdmin");
  if (!user) return next(new NotFound("User not found"));
  if (!user.isAdmin) return next(new Forbidden("Only admins may edit companies"));

  if (!req.params.id) return next(new BadRequest("Please provide a company id."));
  const companyToUpdate = await Company.findById(req.params.id);
  if (!companyToUpdate) return next(new NotFound("Company not found"));

  const companyProps = getCompanyObject(req.body, true);
  for (const prop in companyProps) {
    const propPath = prop.split(".");
    let propToUpdate = companyToUpdate;
    while (propPath.length > 1) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      propToUpdate = propToUpdate[propPath.shift()];
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    propToUpdate[propPath.shift()] = companyProps[prop];
  }

  const savedCompany = await companyToUpdate.save();

  res.json(savedCompany);
}

export async function deleteCompany(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.params.id) return next(new BadRequest("Please provide a company id"));
  const result = await Company.findByIdAndDelete(req.params.id);
  if (!result) return next(new NotFound("Company not found"));

  res.statusCode = constants.HTTP_STATUS_NO_CONTENT;
  res.send();
}

/**
 * Returns amount of seen companies
 * @param req
 * @param res
 * @param next
 */
export async function findCompaniesSeenAmount(
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
  res.json(user.studentProfile?.companiesSeen?.length || 0);
}

/**
 * Returns seen companies
 * @param req
 * @param res
 * @param next
 */
export async function findInternshipsOfSeenCompanies(
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
  if (!user.studentProfile?.companiesSeen) res.json([]);
  const internships = await collectInternships(user);

  res.json(internships);
}

export async function collectInternships(user: IUser): Promise<any[]> {
  let select = INTERNSHIP_FIELDS_VISIBLE_FOR_USER;
  if (user.isAdmin) select += " " + INTERNSHIP_FIELDS_ADDITIONALLY_VISIBLE_FOR_ADMIN;
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
    {
      $match: {
        "company._id": {
          $in: user.studentProfile?.companiesSeen,
        },
      },
    },
  ];
  const internships = await Internship.aggregate(pipeline);
  return internships;
}

/**
 * Returns amount of internships that fit certain search criteria eg. company.companyName or
 * programmingLanguage.
 * @param req
 * @param res
 * @param next
 */
export async function findNewCompaniesAmount( //find all internships fitting criteria, but check if companies appear twice -> count companies, not internships
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

  if (!user.isAdmin && options.length !== 0) {
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
  //gets internships matching criteria but groups the ones in the same company and returns the count
  const pipeline: unknown[] = [
    {
      $lookup: {
        from: "companies",
        localField: "company",
        foreignField: "_id",
        as: "company",
      },
    },
    {
      $match: options,
    },
    {
      $group: {
        // without $count stage in next step printable like: internships.forEach((i) => console.log(`${i._id}, ${i.name}: ${i.companyCount}`));
        _id: "$company._id",
        name: { $first: "$company.companyName" },
        companyCount: { $sum: 1 },
      },
    },
  ];

  const internships = await Internship.aggregate(pipeline);
  if (internships.length == 0) res.json(0);
  else {
    let count = 0;
    for (const c in internships) {
      for (const i in internships[c]._id) {
        if (user.studentProfile?.companiesSeen?.indexOf(internships[c]._id[i]) === -1) {
          count++;
        }
      }
    }
    res.json(count);
  }
}
