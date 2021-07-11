import { sign, SignOptions } from "jsonwebtoken";
import { auth as config } from "../config";

export interface LdapUser {
  dn: string;
  controls: string[];
  objectClass: string[];
  cn: string;
  sn: string;
  givenName: string;
  distinguishedName: string;
  instanceType: string;
  whenCreated: string;
  whenChanged: string;
  uSNCreated: string;
  memberOf: string[];
  uSNChanged: string;
  employeeType: string;
  name: string;
  objectGUID: string;
  userAccountControl: string;
  badPwdCount: string;
  codePage: string;
  countryCode: string;
  homeDirectory: string;
  homeDrive: string;
  badPasswordTime: string;
  lastLogon: string;
  pwdLastSet: string;
  primaryGroupID: string;
  objectSid: string;
  accountExpires: string;
  logonCount: string;
  sAMAccountName: string;
  sAMAccountType: string;
  userPrincipalName: string;
  objectCategory: string;
  dSCorePropagationData: string;
  lastLogonTimestamp: string;
  uid: string;
  mail: string;
  uidNumber: string;
  gidNumber: string;
  gecos: string;
  loginShell: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: Role;
    }
  }
}

export enum Role {
  STUDENT,
  INSTRUCTOR,
}

export function generateAuthToken(user: Express.User): string {
  const payload = user;
  const options: SignOptions = {
    expiresIn: config.expiryTime,
    algorithm: "HS256",
    issuer: process.env.API_HOST,
    audience: process.env.API_HOST,
    subject: user.id,
  };
  return sign(payload, config.secret, options);
}
