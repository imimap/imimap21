import * as jwt from "express-jwt";
import { UnauthorizedError } from "express-jwt";
import { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from "express";
import { Forbidden, Unauthorized } from "http-errors";
import { auth as config } from "../config";
import { Role } from "./user";

/**
 * Extracts the auth token from the request authorization header and returns it.
 * @param request The auth token or null if it doesn't exist in the request
 */
function getAuthTokenFromHeader(request: Request) {
  if (!request.headers.authorization) return null;

  const authHeader = request.headers.authorization.split(" ");
  if (authHeader.length === 2 && authHeader[0] === "Bearer") {
    return authHeader[1];
  }

  return null;
}

const jwtMiddleware = jwt({
  secret: config.secret,
  userProperty: "user",
  getToken: getAuthTokenFromHeader,
  algorithms: ["HS256"],
});

/**
 * Converts authorization errors to 401 - Unauthorized, uses pass-through for other errors
 * @param error The error that occurred during authorization
 * @param req The express request
 * @param res The express response
 * @param next The next middleware
 */
function authErrorHandler(error: unknown, req: Request, res: Response, next: NextFunction): void {
  next(error instanceof UnauthorizedError ? new Unauthorized(error.message) : error);
}

/**
 * Checks if the current user is an admin and throws a 403 - Forbidden if they are not
 * @param req The express request
 * @param res The express response
 * @param next The next middleware
 */
function adminOnlyMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.user?.role !== Role.INSTRUCTOR) return next(new Forbidden("admin role required"));
  else return next();
}

/**
 * An authorization middleware. Checks if the authorization header contains a valid auth token and
 * if the user has the permissions necessary to access the protected resource.
 * @param adminOnly Boolean flag to only allow admins to access the protected resource
 */
function authMiddleware(adminOnly = false): (RequestHandler | ErrorRequestHandler)[] {
  const middleware: (RequestHandler | ErrorRequestHandler)[] = [jwtMiddleware, authErrorHandler];
  if (adminOnly) middleware.splice(1, 0, adminOnlyMiddleware);
  return middleware;
}

/**
 * Checks if the authenticated user is admin or if the
 * requested path starts with the user's student id.
 * @param req The express request
 * @param res The express response
 * @param next The next middleware
 */
export function pdfFileAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const studentId = req.path.substr(1, 8);
  if (req.user?.role === Role.INSTRUCTOR || req.user?.id === studentId) return next();
  else return next(new Forbidden("You are not permitted to access this resource"));
}

export default authMiddleware;
