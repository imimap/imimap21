export const INTERNSHIP_FIELDS_VISIBLE_FOR_USER =
  "_id company tasks operationalArea programmingLanguages livingCosts salary paymentTypes status";
export const INTERNSHIP_FIELDS_ADDITIONALLY_VISIBLE_FOR_ADMIN =
  "startDate endDate workingHoursPerWeek supervisor";

export function createInternshipQueryOptions(query: QueryString.ParsedQs) {
  const options: { [k: string]: unknown } = {};

  if (Object.keys(query).length === 0) {
    return options;
  }

  const companyQueryFields = ["companyName", "branchName", "industry", "mainLanguage", "size"];
  companyQueryFields.forEach((field) => {
    if (query[field])
      options[`company.${field}`] = {
        $regex: query[field],
        $options: "i",
      };
  });
  if (query.country) {
    options["company.address.country"] = {
      $regex: query.country,
      $options: "i",
    };
  }
  if (query.operationalArea) {
    options.operationalArea = {
      $regex: query.operationalArea,
      $options: "i",
    };
  }
  if (query.programmingLanguage) {
    options.programmingLanguages = {
      $regex: query.programmingLanguage,
      $options: "i",
    };
  }
  if (query.paymentType) {
    options.paymentTypes = {
      $regex: query.paymentType,
      $options: "i",
    };
  }
  return options;
}

export function getProjection(select: string) {
  return select.split(" ").reduce((p: { [key: string]: unknown }, field) => {
    p[field] = 1;
    return p;
  }, {});
}
