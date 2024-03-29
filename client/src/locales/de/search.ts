const search = {
  headline: 'Praktikumssuche',
  hint: {
    hintHeading: 'Hinweis: ',
    hintContent: 'Starte am besten mit einer möglichst spezifischen Suche, '
    + 'da die Ergebnisanzeige auf 12 Firmen beschränkt ist. '
    + 'Praktika, die bei der gleichen Firma stattgefunden haben, zählen nur einfach zum Limit dazu. '
    + 'Firmen, die Du einmal gesehen hast, bleiben auch nach dem '
    + 'erreichen des Limits sichtbar. Solltest das Limit aus '
    + 'irgendeinem Grund nicht ausreichen, kannst du in '
    + 'Ausnahmefällen per Mail an imi-praktikum[at]htw-berlin.de um eine Zurücksetzung bitten.',
  },
  form: {
    paymentOptions: {
      standard: '(un)bezahlten',
      paid: 'bezahlten',
      unpaid: 'unbezahlten',
    },
    orientation: 'Bereich',
    search: 'Suchen',
    location: 'Standardort',
    niceLocation: 'einer schönen location',
    random: 'Zufallsvorschlag',
    fun: 'der Spaß macht',
    interested: 'die mich interessiert',
    programmingLanguage: 'Programmiersprache',
    info: 'Ich suche nach {payment} Praktika in {location} im Bereich {orientation} '
  + 'mit \n der Programmiersprache {programmingLanguage} ',
  },
  results: {
    noResults: 'Keine Praktika gefunden. Versuche es mit weniger spezifischen Suchkriterien.',
    resultCount: 'Kein passendes Praktikum gefunden | 1 passendes Praktikum für deine Suche | {n} passende Praktika für deine Suche',
    previousResultCount: '0 frühere Ergebnisse | 1 Praktikum bei bereits gesehener Firma aus früheren Suchen '
    + '| {n} Praktika bei bereits gesehenen Firmen aus früheren Suchen',
  },
  showMap: 'Karte umschalten',
  company: 'Firma',
  location: 'Ort',
  orientation: 'Bereich',
  tookPlace: 'Fand statt in: ',
  payment: 'Bezahlung: ',
  website: 'Website: ',
  tasks: 'Aufgaben: ',
  contact: 'Kontakt: ',
  startDate: 'Startdatum: ',
  endDate: 'Enddatum: ',
  workingHoursPerWeek: 'Arbeitsstunden pro Woche: ',
  supervisor: 'Betreuuer: ',
  programmingLanguages: 'Programmiersprachen: ',
  tooManyResults: {
    headline: 'Achtung',
    resultCount: 'Es wurden {n} neue Firmen gefunden, die du bisher nicht gesehen hast.',
    previousResultCount: 'Du hast bisher {n} von 12 möglichen Firmen gesehen. '
    + 'Dir werden maximal 12 Firmen angezeigt. Wenn du das Limit erreicht hast, kannst du keine neue Suche starten. ',
    question: 'Was möchtest du tun?',
    buttonConfirm: 'Zeige mir trotzdem die Ergebnisse!',
    buttonDecline: 'Ich möchte die Suche konkretisieren',
  },
  limitReached: 'Du hast all deine Versuche aufgebraucht! Bitte wende dich an die '
  + 'Praktikumsverwaltung imi-praktikum[at]htw-berlin.de, falls du dein Limit zurücksetzen musst.',
};

export default search;
