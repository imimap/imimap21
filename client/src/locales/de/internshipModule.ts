/* eslint-disable max-len */
const internshipModule = {
  consent: {
    headline: 'Einverständniserklärung Datenverarbeitung',
    subHeadline1: 'Datenerhebung',
    subHeadline2: 'Löschen von Daten',
    subHeadline3: 'Detaillierte Informationen',
    content: 'Die Verarbeitung der Daten erfolgt auf Grundlage von Art. 6 I lit. b) DSGVO. Nach dieser Vorschrift ist die Verarbeitung personenbezogener Daten zur Erfüllung eines Vertrags, dessen Vertragspartei Du bist, oder zur Durchführung vorvertraglicher Maßnahmen erforderlich. Mit der Nutzung unserer Seite nimmst Du unser Angebot auf Abschluss eines entsprechenden (unentgeltlichen) Nutzungsvertrages an. Die Verarbeitung ist über Art. 6 I lit. f) DSGVO gerechtfertigt, da wir ein berechtigtes Interesse an der Verarbeitung haben und Deine Interessen, Grundrechte und Grundfreiheiten nicht überwiegen. Unser berechtigtes Interesse besteht darin, den reibungslosen Ablauf der Praktika und deren Anerkennung zu gewährleisten und künftigen Studierenden des Studienganges das Suchen und Finden eines Praktikumsplatzes zu erleichtern.',
    deleteData: 'Wenn Du deine Daten gelöscht haben möchtest, kontaktiere uns unter ',
    detailedInformation: 'Detailliertere Informationen findest Du auf der Webseite der',
    buttonConfirm: 'Ja - Ich bin mit der Verarbeitung meiner Daten zu den genannten Zwecken einverstanden.',
    buttonDecline: 'Nein - Ich bin mit der Verarbeitung meiner Daten zu den genannten Zwecken nicht einverstanden.',
  },
  forms: {
    uploadFile: '{file} hochladen',
    pickPDF: 'PDF-Datei auswählen',
    upload: 'Hochladen',
    reUpload: 'Neu hochladen',
    cancel: 'Abbrechen',
    download: 'Herunterladen',
    view: 'Öffnen',
  },
  pdfTypes: {
    request: 'Anmeldung',
    lsfEctsProof: 'ECTS-Nachweis',
    locationJustification: 'Zugangsberechtigung',
    contract: 'Praktikumsvertrag',
    bvgTicketExemption: 'BVG Ticket Ausnahme',
    certificate: 'Praktikumszeugnis',
    report: 'Praktikumsbericht',
  },
  pdfStatus: {
    unknown: 'Nicht eingereicht',
    submitted: 'Eingereicht',
    accepted: 'Gültig',
    rejected: 'Abgelehnt',
  },
  pdfActions: {
    accept: 'Akzeptieren',
    reject: 'Ablehnen',
    rejectModalTitle: 'PDF-Dokument ablehnen',
    rejectReasons: {
      signature: 'Fehlende Unterschrift',
      askProf: 'Bitte setze Dich mit der/dem Praktikumsbeauftragten in Verbindung',
      other: 'Sonstiges',
    },
  },
  internship: 'Praktikum',
  information: 'Information',
  semester: 'Semester',
  startDate: 'Anfangsdatum',
  endDate: 'Enddatum',
  duration: 'Dauer',
  weeks: 'Wochen',
  longEnoughForPartial: 'lang genug für ein Teilpraktikum.',
  longEnough: 'lang genug.',
  notLongEnough: 'nicht lang genug – ein Teilpraktikum muss mindestent 8 Wochen lang sein.',
  operationalArea: 'Einsatzgebiet',
  tasks: 'Aufgaben',
  workingHoursPerWeek: 'Arbeitsstunden pro Woche',
  applicationPhase: 'Beantragung',
  gradingPhase: 'Anerkennung',
  links: {
    title: 'Hilfreiche Links',
    website: 'IMI-Website: Praktikum',
    contract: 'Vorlage Praktikumsvertrag',
    certificate: 'Vorlage Praktikumszeugnis',
  },
  status: {
    internship: 'Status des Praktikums',
    overview: 'Statusübersicht',
    application: 'Status der Anmeldung',
    contract: 'Status des Vertrags',
    report: 'Status des Berichts',
    certificate: 'Status des Zertifikats',
    currentStatus: 'Status',
    open: 'noch offen',
    unknown: 'unbekannt',
    planned: 'geplant',
    requested: 'beantragt',
    requestedExplanation: 'Der/die Praktikumsbeauftragte/r muss dein Praktikum bestätigen. Komme dafür bitte in ihre/seine Sprechstunde.',
    rejected: 'abgelehnt',
    approved: 'angenommen',
    approvedExplanation: 'Dein Praktikumsantrag wurde angenommen. Vergiss nicht die Teilnahme am AEP. Viel Spaß beim Praktikum! ',
    over: 'beendet',
    readyForGrading: 'fertig zur Benotung',
    readyForGradingExplanation: 'Deine Dokumente werden überprüft und nach Absolvierung des AEPs an die Prüfungsverwaltung geschickt.',
    passed: 'bestanden',
    passedExplanation: 'Glückwunsch, du hast dein Praktikum erfolgreich beendet!',
    missingPart1: 'Folgende ',
    missingPart2: 'fehlen für die Beantragung deines Praktikums:',
    missingProofPart1: 'Du hast dein Praktikum beendet. Bitte reiche folgende ',
    missingProofPart2: ' für die Anerkennung deines Praktikums ein.',
    documents: 'Dokumente',
    details: 'Angaben',
    pleaseUpload: 'Bitte lade diese hier noch hoch.',
    pleaseEditInternship: 'Bitte bearbeite dafür dein Praktikum nochmal.',
    lsfEctsProofPdf: 'ECTS-Nachweis',
    contractPdf: 'Praktikumsvertrag',
    requestPdf: 'Praktikumsanmeldung',
    reportPdf: 'Praktikumsbericht',
    certificatePdf: 'Praktikumszertifikat',
  },
  comment: 'Kommentar',
  edit: 'Bearbeiten',
  delete: 'Löschen',
  moduleName: {
    name: 'Modulname',
    b20: 'Praxisphase 1: Fachpraktikum im Ausland',
    b201: 'Auswertung von Erfahrungen am Praxisplatz',
    b202: 'Fachpraktikum',
  },
  moduleNumber: 'Modulnummer',
  newPartialInternship: '(Weiteres) Praktikum eintragen',
  newPostponement: '(Weitere) Verschiebung beantragen',
  internshipModule: 's Praktikum im',
  semesterModule: 'Fachsemester)',
  commentLocation: 'Die Hochschschul-Zugangsberechtigung ist nur erforderlich, falls kein deutsches Abitur vorliegt',

};

export default internshipModule;
