import Address from '@/models/Address';
import Coordinates from '@/models/Coordinates';

export const companySizes = {
  big: 'mehr als 250 Angestellte',
  medium: 'weniger als 250 Angestellte',
  small: 'weniger als 50 Angestellte',
};

export default class Company {
  _id: string;

  mainLanguage: string;

  excludedFromSearch: boolean;

  companyName: string;

  branchName: string;

  address: Address;

  emailAddress: string;

  industry: string;

  website: string;

  size: string;

  comment: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static parseFromAPIResponseData(data: any): Company {
    return new Company(
      data._id,
      data.mainLanguage !== undefined ? data.mainLanguage : '',
      data.excludedFromSearch !== undefined ? data.excludedFromSearch : false,
      data.companyName,
      data.branchName !== undefined ? data.branchName : '',
      new Address(
        data.address !== undefined ? data.address.street : '',
        data.address !== undefined ? data.address.streetNumber : '',
        data.address !== undefined ? data.address.zip : '',
        data.address !== undefined ? data.address.city : '',
        data.address !== undefined ? data.address.country : '',
        data.address !== undefined ? data.address.additionalLines : '',
        new Coordinates(
          data.address !== undefined ? data.address.coordinates.latitude : '',
          data.address !== undefined ? data.address.coordinates.longitude : '',
        ),
      ),
      data.emailAddress !== undefined ? data.emailAddress : '',
      data.industry !== undefined ? data.industry : '',
      data.website !== undefined ? data.website : '',
      data.size !== undefined ? data.size : '',
      data.comment !== undefined ? data.comment : '',
    );
  }

  constructor(
    id: string,
    mainLanguage: string,
    excludedFromSearch: boolean,
    companyName: string,
    branchName: string,
    address: Address,
    emailAddress: string,
    industry: string,
    website: string,
    size: string,
    comment: string,
  ) {
    this._id = id;
    this.mainLanguage = mainLanguage;
    this.excludedFromSearch = excludedFromSearch;
    this.companyName = companyName;
    this.branchName = branchName;
    this.address = address;
    this.emailAddress = emailAddress;
    this.industry = industry;
    this.website = website;
    this.size = size;
    this.comment = comment;
  }

  public prettyPrintSize(): string {
    return companySizes[this.size];
  }
}
