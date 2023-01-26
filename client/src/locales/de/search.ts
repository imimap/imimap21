/* eslint-disable max-len */
const search = {
  headline: 'Praktikumssuche',
  hint: {
    hintHeading: 'Hinweis: ',
    hintContent: 'Starte am besten mit einer möglichst spezifischen Suche, '
    + 'da die Ergebnisanzeige auf 12 Ergebnisse beschränkt ist. '
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
    resultCount: 'Kein passendes Unternehmen gefunden | 1 passendes Unternehmen für deine Suche | {n} passende Unternehmen für deine Suche',
    previousResultCount: '0 frühere Ergebnisse | 1 Praktikum bei bisher gesehener Firmen aus früherer Suche | {n} Praktika bei bisher gesehenen Firmen aus früherer Suche',
  },
  showMap: 'Karte zeigen',
  company: 'Firma',
  location: 'Ort',
  orientation: 'Bereich',
  tookPlace: 'Fand statt in: ',
  payment: 'Bezahlung: ',
  website: 'Website: ',
  tasks: 'Aufgaben: ',
  contact: 'Kontakt: ',
  programmingLanguages: 'Programmiersprachen: ',
  tooManyResults: {
    headline: 'Achtung',
    resultCount: 'Es wurden {n} Treffer gefunden.',
    previousResultCount: 'Du hast bisher {n} von 12 möglichen Suchergebnissen gesehen.',
    question: 'Was möchtest du tun?',
    buttonConfirm: 'Zeige mir trotzdem die Ergebnisse!',
    buttonDecline: 'Ich möchte die Suche konkretisieren',
  },
};

export default search;
