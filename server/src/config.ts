export const ldap = {
  strategyName: "ldap",
  url: process.env.LDAP_URL as string,
  searchBase: process.env.LDAP_SEARCH_BASE as string,
  searchFilter: "(uid={{username}})",
  studentGroup: process.env.STUDENT_GROUP as string,
  instructorGroup: process.env.LDAP_INSTRUCTOR_GROUP as string,
};

export const auth = {
  secret: process.env.AUTH_SECRET as string,
  expiryTime: "1h",
  algorithm: "HS256",
};
