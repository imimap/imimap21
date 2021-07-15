export interface Company {
  _id: string;
  id: string;
  mainLanguage: string;
  excludedFromSearch: boolean;
  companyName: string;
  branchName: string;
  address: {
    street: string;
    streetNumber: string;
    zip: string;
    city: string;
    country: string;
    additionalLines: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  emailAddress: string;
  industry: string;
  website: string;
  size: string;
  comment: string;
}
