import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { Forbidden, NotFound } from "http-errors";
import { Company } from "../models/company";

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
