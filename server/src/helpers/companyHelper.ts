export function getCompanyObject(
  propsObject: Record<string, unknown>,
  includeAdminProps = false
): Record<string, unknown> {
  const companyProps: Record<string, unknown> = {};

  //direct props of internship
  const directProps = [
    "companyName",
    "branchName",
    "emailAddress",
    "industry",
    "website",
    "mainLanguage",
    "size",
  ];

  if (includeAdminProps) {
    ["comment", "excludedFromSearch"].forEach((prop) => directProps.push(prop));
  }

  for (const prop of directProps) {
    if (propsObject[prop] !== undefined) companyProps[prop] = propsObject[prop];
  }

  //address props
  const addressProps = ["street", "streetNumber", "additionalLines", "zip", "city", "country"];
  for (const prop of addressProps) {
    if (propsObject[prop]) {
      companyProps[`address.${prop}`] = propsObject[prop];
    }
  }

  return companyProps;
}
