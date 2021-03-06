import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { Forbidden, NotFound, BadRequest } from "http-errors";
import { Company } from "../models/company";
import { getCompanyObject } from "../helpers/companyHelper";

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
 * Returns a companies that fits a certain company name and optionally branch name
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

  if (req.query.companyName) {
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
  if (!user.isAdmin) select = "companyName branchName address.country";

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

  const options: { [k: string]: any } = {};
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
  } catch (e: any) {
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

  const companyProps = getCompanyObject(req.body);
  for (const prop in companyProps) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    companyToUpdate[prop] = companyProps[prop];
  }

  const savedCompany = await companyToUpdate.save();

  res.json(savedCompany);
}
