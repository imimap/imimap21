import * as jwt from "express-jwt";
import { UnauthorizedError } from "express-jwt";
import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "http-errors";
import { auth as config } from "../config";

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

const authMiddleware = [
  jwt({
    secret: config.secret,
    userProperty: "user",
    getToken: getAuthTokenFromHeader,
    algorithms: ["HS256"],
  }),
  (error: unknown, request: Request, response: Response, next: NextFunction): void =>
    next(error instanceof UnauthorizedError ? new Unauthorized(error.message) : error),
];

export default authMiddleware;
