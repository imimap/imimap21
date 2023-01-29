const search = {
  headline: 'Internship Search',
  hint: {
    hintHeading: 'Notice: ',
    hintContent: 'Try starting with a very specific search because this feature '
      + 'is limited to showing 12 companies. There might been internships that '
      + 'took place at the same company, this does not count towards the limit. '
      + 'Companies, which you have seen once stay visible even if you reach this limit. '
      + 'If for any reason you need to extend that limit, '
      + 'please write an email at imi-praktikum[at]htw-berlin.de ',
  },
  form: {
    paymentOptions: {
      standard: '(un)paid',
      paid: 'paid',
      unpaid: 'unpaid',
    },
    search: 'Search',
    location: 'Location',
    niceLocation: 'a nice location',
    random: 'Generate Random',
    fun: 'in a fun industry',
    orientation: 'Orientation',
    interested: 'I\'m interested in',
    programmingLanguage: 'Programming language',
    info: 'I am searching for {payment} internships in {location}, working in {orientation} '
      + '\n with the programming language {programmingLanguage} ',
  },
  results: {
    noResults: 'No internships found. Try again with less specific search criteria.',
    resultCount: 'No internship fitting the criteria | One internship fitting the criteria | {n} internships fitting the criteria',
    previousResultCount: '0 results of previous searches | 1 internship at previously found company | {n} internships at previously found companies',
  },
  showMap: 'Show map',
  company: 'Company',
  location: 'Location',
  orientation: 'Orientation',
  tookPlace: 'Took place in: ',
  payment: 'Payment: ',
  website: 'Website: ',
  tasks: 'Tasks: ',
  contact: 'Contact: ',
  startDate: 'Start date: ',
  endDate: 'End date: ',
  workingHoursPerWeek: 'Working hours per week: ',
  supervisor: 'Supverisor: ',
  programmingLanguages: 'Programming languages: ',
  tooManyResults: {
    headline: 'Caution',
    resultCount: '{n} companies at various internships have been found.',
    previousResultCount: 'You have already seen {n} of 12 possible company results. A maximum of 12 companies will be displayed. '
    + 'Once you have seen these, you cannot start a new search.',
    question: 'What do you want to do?',
    buttonConfirm: 'Show the results anyway!',
    buttonDecline: 'I want to concretise my search.',
  },
  limitReached: 'You reached your search limit! Please contact the internship team imi-praktikum[at]htw-berlin.de, when you want to reset the limit.',

};

export default search;
