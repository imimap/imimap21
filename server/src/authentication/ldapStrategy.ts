import * as LdapStrategy from "passport-ldapauth";
import { readFileSync } from "fs";
import { ldap as config } from "../config";
import { IncomingMessage } from "http";
import { LdapUser, Role } from "./user";
import { normalizeEmail } from "../helpers/emailAddressHelper";

function getLDAPConfig(request: IncomingMessage, callback: LdapStrategy.OptionsFunctionCallback) {
  const req = request as never as Request;
  callback(null, {
    server: {
      url: config.url,
      searchBase: config.searchBase,
      searchFilter: config.searchFilter,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      bindDN: `CN=${req.body.username},${config.searchBase}`,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      bindCredentials: req.body.password,
      tlsOptions: {
        ca: [readFileSync("certs/CA-HTW-cert.pem")],
      },
    },
  });
}

function verifyLdapResponse(user: LdapUser, done: LdapStrategy.VerifyDoneCallback) {
  if (user) {
    if (
      !user.memberOf.includes(config.studentGroup) &&
      !user.memberOf.includes(config.instructorGroup)
    )
      return done(null, null, {
        message: "user is not part of the IMI LDAP group",
      });

    done(null, {
      id: user.uid,
      firstName: user.givenName,
      lastName: user.sn,
      email: normalizeEmail(user.mail),
      role: user.memberOf.includes(config.studentGroup) ? Role.STUDENT : null,
    });
  } else {
    done(null, null, { message: "ldap error" });
  }
}

const ldapStrategy = new LdapStrategy(getLDAPConfig, verifyLdapResponse);
ldapStrategy.name = config.strategyName;

export default ldapStrategy;
