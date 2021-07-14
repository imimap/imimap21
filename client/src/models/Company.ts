export default class Company {
  _id = '';

  mainLanguage = '';

  excludedFromSearch = false;

  companyName = '';

  branchName = '';

  address = {
    street: '',
    streetNumber: '',
    zip: '',
    city: '',
    country: '',
    additionalLines: '',
    coordinates: {
      latitude: 1,
      longitude: 1,
    },
  };

  emailAddress = '';

  industry = '';

  website = '';

  size = '';

  comment = '';
}
