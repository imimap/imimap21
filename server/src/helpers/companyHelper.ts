export function getCompanyObject(propsObject: any) {
  const companyProps: { [k: string]: any } = {};

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
  for (const prop of directProps) {
    if (propsObject[prop]) companyProps[prop] = propsObject[prop];
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
