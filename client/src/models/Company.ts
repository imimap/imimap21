import Address from '@/models/Address';
import Coordinates from '@/models/Coordinates';

const companySizes = {
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
      data.mainLanguage ? data.mainLanguage : '',
      data.excludedFromSearch ? data.excludedFromSearch : '',
      data.companyName,
      data.branchName ? data.branchName : '',
      new Address(
        data.address ? data.address.street : '',
        data.address ? data.address.streetNumber : '',
        data.address ? data.address.zip : '',
        data.address ? data.address.city : '',
        data.address ? data.address.country : '',
        data.address ? data.address.additionalLines : '',
        new Coordinates(
          data.address ? data.address.coordinates.latitude : '',
          data.address ? data.address.coordinates.longitude : '',
        ),
      ),
      data.emailAddress ? data.emailAddress : '',
      data.industry ? data.industry : '',
      data.website ? data.website : '',
      data.size ? data.size : '',
      data.comment ? data.comment : '',
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

  get prettyPrintSize(): string {
    return companySizes[this.size];
  }
}
