export const ldap = {
  strategyName: "ldap",
  url: process.env.LDAP_URL as string,
  searchBase: process.env.LDAP_SEARCH_BASE as string,
  searchFilter: "(uid={{username}})",
  studentGroup: process.env.LDAP_STUDENT_GROUP as string,
  instructorGroup: process.env.LDAP_INSTRUCTOR_GROUP as string,
};

export const local = {
  strategyName: "local",
  password: process.env.BYPASS_LDAP,
};

export const auth = {
  strategy: process.env.NODE_ENV === "development" && process.env.BYPASS_LDAP ? "local" : "ldap",
  secret: process.env.AUTH_SECRET as string,
  refreshSecret: process.env.REFRESH_SECRET as string,
  expiryTime: "1h",
  algorithm: "HS256",
};
