import { IUser, User } from "../models/user";
import { Forbidden, NotFound } from "http-errors";
import { Types } from "mongoose";

interface IPopulate {
  path: string;
  lean: boolean;
  populate?: IPopulate;
}

/**
 * Returns the user with the specified email address.
 * @throws NotFound If the user was not found
 * @param emailAddress The email address of the user to find.
 * @param populateCompany Should the company object be fully returned instead of just the id?
 * @returns IUser The authorized user
 */
export async function getUser(emailAddress: string | undefined): Promise<IUser> {
  if (!emailAddress) throw new NotFound("User not found. No email address was provided.");
  const user = await User.findOne({ emailAddress: emailAddress }).select("_id isAdmin studentProfile");
  if (!user) throw new NotFound("User not found");
  return user;
}

/**
 * Returns the user with the specified email address.
 * @throws NotFound If the user was not found
 * @param emailAddress The email address of the user to find.
 * @returns IUser The authorized user
 */
export async function getUserWithInternshipModule(
  emailAddress: string | undefined
): Promise<IUser> {
  const user = await getUser(emailAddress);
  return user.populate("studentProfile.internship");
}

/**
 * Returns the authorized user with the specified email address.
 * @throws NotFound If the user was not found
 * @throws Forbidden If the user id not authorized to access the internship with the provided id.
 * @param emailAddress The email address of the user to find.
 * @param internshipId The internship id to use for the authorization check.
 * @returns IUser The authorized user
 */
export async function getAuthorizedUser(
  emailAddress: string | undefined,
  internshipId: string
): Promise<IUser> {
  const user: IUser = await getUser(emailAddress);
  if (!user.isAdmin && !user.hasOwnInternship(internshipId))
    throw new Forbidden("Student is not authorized for this action");
  return user;
}

/**
 * Returns the authorized user with the specified email address.
 * @throws NotFound If the user was not found
 * @throws Forbidden If the user id not authorized to access the internship with the provided id.
 * @param emailAddress The email address of the user to find.
 * @param internshipId The internship id to use for the authorization check.
 * @returns IUser The authorized user
 */
export async function getAuthorizedUserWithInternshipModule(
  emailAddress: string | undefined,
  internshipId: string
): Promise<IUser> {
  const user: IUser = await getUserWithInternshipModule(emailAddress);
  if (user.isAdmin || user.hasOwnInternship(internshipId)) return user;
  throw new Forbidden("Student is not authorized for this action");
}
