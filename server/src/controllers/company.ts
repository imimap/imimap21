import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { NotFound } from "http-errors";
import { Internship } from "../models/internship";

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
  if (req.params.country) options.company.country = req.params.country;

  const cities: string[] = await Internship.find(options).distinct("company.city");

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

  const countries: string[] = await Internship.distinct("company.country");

  res.json(countries);
}
