<template>
  <div class="container">
    <div class="row">
      <div class="col-12">

        <div class="accordion" id="listAccordion">
          <div v-for="(row, index) in users" v-bind:key="index" class="accordion-item">
            <h2 class="accordion-header" v-bind:id="index">
              <button class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      v-bind:data-bs-target="'#s0' + row.studentProfile.matrikelnummer"
                      aria-expanded="false"
                      v-bind:aria-controls="'s0' + row.studentProfile.matrikelnummer">
                <div class="container">
                  <div class="row">
                    <div class="col-2">
                      <h6 class="list-item-label">Name</h6>
                      <span class="fw-bold">{{ row.firstName + " " + row.lastName }}</span>
                    </div>
                    <div class="col-2">
                      <h6 class="list-item-label">Matrikelnr.</h6>
                      <span class="">{{ row.studentProfile.matrikelnummer }}</span>
                    </div>
                    <div class="col-2">
                      <h6 class="list-item-label">Praktika</h6>
                      <span class="">
                        {{ row.studentProfile.internshipModule.internshipParts.length }}
                      </span>
                    </div>
                    <div class="col-2">
                      <h6 class="list-item-label">Gesamtdauer</h6>
                      <span class="">
                        {{ Math.floor(getInternshipModuleDuration(
                        row.studentProfile.internshipModule.internshipParts) / 7) }}
                              Wochen,
                              {{ Math.floor(getInternshipModuleDuration(
                        row.studentProfile.internshipModule.internshipParts)) % 7 }} Tage
                      </span>
                    </div>
                    <div class="col-2 text-center">
                      <h6 class="list-item-label">Status</h6>
                      <span class="badge rounded-pill bg-success">Vollständig</span>
                    </div>
                  </div>
                </div>
              </button>
            </h2>
            <div v-bind:id="'s0' + row.studentProfile.matrikelnummer"
                 class="accordion-collapse collapse"
                 aria-labelledby="headingOne"
                 data-bs-parent="#listAccordion">
              <div class="accordion-body">
                <div class="container">
                  <div class="row">
                    <div class="col-8">
                      <h6>Praktika</h6>
                      <div v-for="(internship, internshipIndex) in
                      row.studentProfile.internshipModule.internshipParts"
                           v-bind:key="internshipIndex" class="card mb-3">
                        <div class="card-header">
                          {{ getDateString(internship.startDate) + ' - '
                        + getDateString(internship.endDate) }}
                          <span class="badge rounded-pill bg-secondary float-end">
                            Zugelassen
                          </span>
                        </div>
                        <div class="card-body">
                          <h5 class="card-title">
                            {{ internship.companyBranch.companyName }}
                          </h5>
                          <h6 class="card-subtitle mb-2 text-muted">
                            {{ internship.companyBranch.address.city }},
                            {{ internship.companyBranch.address.country }}
                          </h6>
                          <div class="row">
                            <div class="col-lg-4 col-md-12 mb-2">
                              <span class="fw-bold list-item-label">Dauer</span><br>
                              {{ Math.floor(getTimeDifferenceDays(internship.startDate,
                              internship.endDate) / 7) }}
                              Wochen,
                              {{ Math.floor(getTimeDifferenceDays(internship.startDate,
                              internship.endDate)) % 7 }}
                              Tage
                            </div>
                            <div class="col-lg-8 col-md-12 mb-2 status-internship-part">
                              <span class="fw-bold list-item-label">Status</span><br>
                                  <span class="badge rounded-pill bg-success d-block mb-2">
                                    Antrag vorhanden</span>
                                  <span class="badge rounded-pill bg-success d-block mb-2">
                                    Vertrag vorhanden</span>
                                  <span class="badge rounded-pill bg-secondary d-block mb-2">
                                    ECTS-Nachweis vorhanden
                                  </span>
                                  <span class="badge rounded-pill bg-secondary d-block mb-2">
                                    Zertifikat vorhanden
                                  </span>
                            </div>
                          </div>
                        </div>
                        <div class="card-footer">
                          <button class="btn btn-success btn-sm me-2">
                            Antrag genehmigen</button>
                          <button class="btn btn-success btn-sm me-2">
                            Anrechenbar markieren</button>
                          <button class="btn btn-secondary btn-sm me-2">
                            Details bearbeiten</button>
                          <button class="btn btn-danger btn-sm me-2">
                            Löschen</button>
                        </div>
                      </div>
                    </div>

                    <div class="col-4">
                      <div class="d-grid gap-2 mt-4 col-8 mx-auto">
                        <button class="btn btn-success" type="button">
                          AEP-Status bearbeiten
                        </button>
                        <button class="btn btn-success" type="button">
                          Kurs-Status bearbeiten
                        </button>
                        <button class="btn btn-success" type="button">
                          Zertifikat-Status bearbeiten
                        </button>
                        <button class="btn btn-secondary" type="button">
                          Details bearbeiten
                        </button>
                        <button class="btn btn-danger" type="button">
                          Löschen
                        </button>
                        <button class="btn btn-secondary" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseExample" aria-expanded="false"
                                aria-controls="collapseExample">
                          Mehr Aktionen
                        </button>
                      </div>
                      <div class="collapse" id="collapseExample">
                          <div class="d-grid gap-2 mt-4 col-8 mx-auto">
                            <button class="btn btn-secondary" type="button">
                              Aktion 2
                            </button>
                            <button class="btn btn-secondary" type="button">
                              Aktion 3
                            </button>
                            <button class="btn btn-secondary" type="button">
                              Aktion 4
                            </button>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Internship from '@/components/admin/Internship';

export default defineComponent({
  name: 'UsersList',
  data() {
    return {
      users: [{
        firstName: 'Mark',
        lastName: 'Otto',
        isAdmin: false,
        emailAddress: 'email@student.de',
        studentProfile: {
          matrikelnummer: '456123',
          internshipsSeen: [],
          internshipModule: {
            reportPdf: '',
            internshipParts: [
              {
                companyBranch: {
                  companyName: 'Coding B.V.',
                  branchName: 'Coding B.V. Amsterdam',
                  industry: 'Web Development',
                  website: 'https://coding.nl',
                  mainLanguage: 'english',
                  comment: '',
                  excludedFromSearch: false,
                  size: 'LARGE',
                  address: {
                    street: 'asdfghjk',
                    number: '38',
                    zip: '1234',
                    city: 'Amsterdam',
                    country: 'Netherlands',
                    latitude: 52.370216,
                    longitude: 4.895168,
                  },
                },
                description: 'qwertzu',
                tasks: 'lorem ipsum tasks',
                operationalArea: 'Lorem ipsum area',
                programmingLanguages: [],
                livingCosts: 400,
                salary: 500,
                paymentType: [],
                startDate: '2021-02-01',
                endDate: '2021-03-25',
                workingHoursPerWeek: 40,
                supervisor: {},
                comment: 'lrem ipsem iofgaiuzfbauidzfbaubauh kommentar',
                requestPdf: '',
                lsfEctsProofPdf: '',
                locationJustificationPdfs: [],
                contractPdf: '',
                bvgTicketExemptionRequestPdf: '',
                certificatePdf: '',
                events: [],
              },
              {
                companyBranch: {
                  companyName: '123VeryMuchCoding GmbH',
                  branchName: '123VeryMuchCoding GmbH Berlin',
                  industry: 'Web Development',
                  website: 'https://coding.de',
                  mainLanguage: 'german',
                  comment: '',
                  excludedFromSearch: false,
                  size: 'medium',
                  address: {
                    street: 'Unter den Linden',
                    number: '192',
                    zip: '12345',
                    city: 'Berlin',
                    country: 'Germany',
                    latitude: 52.520008,
                    longitude: 13.404954,
                  },
                },
                description: 'qwertzu',
                tasks: 'lorem ipsum tasks',
                operationalArea: 'Lorem ipsum area',
                programmingLanguages: [],
                livingCosts: 400,
                salary: 500,
                paymentType: [],
                startDate: '2020-04-01',
                endDate: '2020-08-31',
                workingHoursPerWeek: 36,
                supervisor: {},
                comment: 'lrem ipsem iofgaiuzfbauidzfbaubauh kommentar',
                requestPdf: '',
                lsfEctsProofPdf: '',
                locationJustificationPdfs: [],
                contractPdf: '',
                bvgTicketExemptionRequestPdf: '',
                certificatePdf: '',
                events: [],
              },
            ],
            inSemester: '3',
            inSemesterOfStudy: 5,
            AepPassed: false,
            completeDocumentsPdf: '',
            events: [],
          },
        },
      },
      {
        firstName: 'Lisa',
        lastName: 'Muster',
        isAdmin: false,
        emailAddress: 'email@student.de',
        studentProfile: {
          matrikelnummer: '123456',
          internshipsSeen: [],
          internshipModule: {
            reportPdf: '',
            internshipParts: [
              {
                companyBranch: {
                  companyName: 'Coding B.V.',
                  branchName: 'Coding B.V. Amsterdam',
                  industry: 'Web Development',
                  website: 'https://coding.nl',
                  mainLanguage: 'english',
                  comment: '',
                  excludedFromSearch: false,
                  size: 'LARGE',
                  address: {
                    street: 'asdfghjk',
                    number: '38',
                    zip: '1234',
                    city: 'Amsterdam',
                    country: 'Netherlands',
                    latitude: 52.370216,
                    longitude: 4.895168,
                  },
                },
                description: 'qwertzu',
                tasks: 'lorem ipsum tasks',
                operationalArea: 'Lorem ipsum area',
                programmingLanguages: [],
                livingCosts: 400,
                salary: 500,
                paymentType: [],
                startDate: '2020-04-01',
                endDate: '2020-08-31',
                workingHoursPerWeek: 40,
                supervisor: {},
                comment: 'lrem ipsem iofgaiuzfbauidzfbaubauh kommentar',
                requestPdf: '',
                lsfEctsProofPdf: '',
                locationJustificationPdfs: [],
                contractPdf: '',
                bvgTicketExemptionRequestPdf: '',
                certificatePdf: '',
                events: [],
              },
              {
                companyBranch: {
                  companyName: '123VeryMuchCoding GmbH',
                  branchName: '123VeryMuchCoding GmbH Berlin',
                  industry: 'Web Development',
                  website: 'https://coding.de',
                  mainLanguage: 'german',
                  comment: '',
                  excludedFromSearch: false,
                  size: 'medium',
                  address: {
                    street: 'Unter den Linden',
                    number: '192',
                    zip: '12345',
                    city: 'Berlin',
                    country: 'Germany',
                    latitude: 52.520008,
                    longitude: 13.404954,
                  },
                },
                description: 'qwertzu',
                tasks: 'lorem ipsum tasks',
                operationalArea: 'Lorem ipsum area',
                programmingLanguages: [],
                livingCosts: 400,
                salary: 500,
                paymentType: [],
                startDate: '2020-04-01',
                endDate: '2020-08-31',
                workingHoursPerWeek: 36,
                supervisor: {},
                comment: 'lrem ipsem iofgaiuzfbauidzfbaubauh kommentar',
                requestPdf: '',
                lsfEctsProofPdf: '',
                locationJustificationPdfs: [],
                contractPdf: '',
                bvgTicketExemptionRequestPdf: '',
                certificatePdf: '',
                events: [],
              },
            ],
            inSemester: '3',
            inSemesterOfStudy: 5,
            AepPassed: false,
            completeDocumentsPdf: '',
            events: [],
          },
        },
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        isAdmin: false,
        emailAddress: 'email@student.de',
        studentProfile: {
          matrikelnummer: '918273',
          internshipsSeen: [],
          internshipModule: {
            reportPdf: '',
            internshipParts: [
              {
                companyBranch: {
                  companyName: 'Coding B.V.',
                  branchName: 'Coding B.V. Amsterdam',
                  industry: 'Web Development',
                  website: 'https://coding.nl',
                  mainLanguage: 'english',
                  comment: '',
                  excludedFromSearch: false,
                  size: 'LARGE',
                  address: {
                    street: 'asdfghjk',
                    number: '38',
                    zip: '1234',
                    city: 'Amsterdam',
                    country: 'Netherlands',
                    latitude: 52.370216,
                    longitude: 4.895168,
                  },
                },
                description: 'qwertzu',
                tasks: 'lorem ipsum tasks',
                operationalArea: 'Lorem ipsum area',
                programmingLanguages: [],
                livingCosts: 400,
                salary: 500,
                paymentType: [],
                startDate: '2020-04-01',
                endDate: '2020-08-31',
                workingHoursPerWeek: 40,
                supervisor: {},
                comment: 'lrem ipsem iofgaiuzfbauidzfbaubauh kommentar',
                requestPdf: '',
                lsfEctsProofPdf: '',
                locationJustificationPdfs: [],
                contractPdf: '',
                bvgTicketExemptionRequestPdf: '',
                certificatePdf: '',
                events: [],
              },
              {
                companyBranch: {
                  companyName: '123VeryMuchCoding GmbH',
                  branchName: '123VeryMuchCoding GmbH Berlin',
                  industry: 'Web Development',
                  website: 'https://coding.de',
                  mainLanguage: 'german',
                  comment: '',
                  excludedFromSearch: false,
                  size: 'medium',
                  address: {
                    street: 'Unter den Linden',
                    number: '192',
                    zip: '12345',
                    city: 'Berlin',
                    country: 'Germany',
                    latitude: 52.520008,
                    longitude: 13.404954,
                  },
                },
                description: 'qwertzu',
                tasks: 'lorem ipsum tasks',
                operationalArea: 'Lorem ipsum area',
                programmingLanguages: [],
                livingCosts: 400,
                salary: 500,
                paymentType: [],
                startDate: '2020-04-01',
                endDate: '2020-08-31',
                workingHoursPerWeek: 36,
                supervisor: {},
                comment: 'lrem ipsem iofgaiuzfbauidzfbaubauh kommentar',
                requestPdf: '',
                lsfEctsProofPdf: '',
                locationJustificationPdfs: [],
                contractPdf: '',
                bvgTicketExemptionRequestPdf: '',
                certificatePdf: '',
                events: [],
              },
              {
                companyBranch: {
                  companyName: '123VeryMuchCoding GmbH',
                  branchName: '123VeryMuchCoding GmbH Berlin',
                  industry: 'Web Development',
                  website: 'https://coding.de',
                  mainLanguage: 'german',
                  comment: '',
                  excludedFromSearch: false,
                  size: 'medium',
                  address: {
                    street: 'Unter den Linden',
                    number: '192',
                    zip: '12345',
                    city: 'Berlin',
                    country: 'Germany',
                    latitude: 52.520008,
                    longitude: 13.404954,
                  },
                },
                description: 'qwertzu',
                tasks: 'lorem ipsum tasks',
                operationalArea: 'Lorem ipsum area',
                programmingLanguages: [],
                livingCosts: 400,
                salary: 500,
                paymentType: [],
                startDate: '2020-04-01',
                endDate: '2020-08-31',
                workingHoursPerWeek: 36,
                supervisor: {},
                comment: 'lrem ipsem iofgaiuzfbauidzfbaubauh kommentar',
                requestPdf: '',
                lsfEctsProofPdf: '',
                locationJustificationPdfs: [],
                contractPdf: '',
                bvgTicketExemptionRequestPdf: '',
                certificatePdf: '',
                events: [],
              },
            ],
            inSemester: '3',
            inSemesterOfStudy: 5,
            AepPassed: false,
            completeDocumentsPdf: '',
            events: [],
          },
        },
      },
      ],
    };
  },
  methods: {
    getDateString(ISODateString: string) {
      const date = new Date(ISODateString);
      return date.toLocaleDateString();
    },
    getTimeDifferenceDays(start: string, end: string) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      return (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24;
    },
    getInternshipModuleDuration(internshipParts: Internship[]) {
      let durationSumInDays = 0;
      internshipParts.forEach((internship) => {
        durationSumInDays += this.getTimeDifferenceDays(internship.startDate, internship.endDate);
      });
      return durationSumInDays;
    },
  },
});
</script>

<style scoped>
  template {
    padding: 20px;
  }

  .btn-success {
    background: rgba(119, 185, 0, 0.9);
    border-color: rgba(119, 185, 0, 0.9);
  }

  .btn-success:hover, .btn-success:active, .btn-success:focus {
    background: rgba(119, 185, 0, 1);
    border-color: rgba(119, 185, 0, 1);
  }

  .table-nav button {
    margin-right: 20px;
  }

  .accordion-item .accordion-body{
    background: #eee;
  }

  .accordion-header button {
    color: #000000;
  }

  .list-item-label {
    font-size: 0.8rem;
    color: #666666;
    text-transform: uppercase;
  }

</style>
