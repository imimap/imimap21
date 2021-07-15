<template>
  <div class="container">
    <div class="row">
      <div class="col-12">

        <div class="row">
          <div class="col-lg-3 col-md-12 mb-3">
            <select class="form-select"
                    aria-label="Sortieren nach"
                    v-model="currentSorting"
                    @change="changeSorting">
              <option selected value="">Sortieren nach...</option>
              <option value="lastName">Nachname</option>
              <option value="studentId">Matrikelnummer</option>
            </select>
          </div>
          <div class="col-lg-3 col-md-12 mb-3">
            <select class="form-select"
                    aria-label="Sortieren nach"
                    v-model="currentFilterDuration">
              <option selected value="">Dauer...</option>
              <option value="uncomplete">&lt; 16 Wochen</option>
              <option value="complete">&#8925; 16 Wochen</option>
            </select>
          </div>
          <div class="col-lg-3 col-md-12 mb-3">
            <select class="form-select"
                    aria-label="Sortieren nach"
                    v-model="currentFilterStatus">
              <option selected value="">Status...</option>
              <option value="uncomplete">Unvollständig</option>
              <option value="complete">Vollständig</option>
              <option value="passed">Bestanden</option>
            </select>
          </div>
          <div class="col-lg-3 col-md-12 mb-3">
            <input type="text"
                   class="form-control"
                   placeholder="Suche..."
                   aria-label="Suche"
                   aria-describedby="suche"
                   v-model="currentSearch">
            <div id="emailHelp" class="form-text">
              Matrikelnummer oder Nachname</div>
          </div>
        </div>

        <div v-if="!isLoading" class="accordion" id="listAccordion">
          <div v-for="(row, index) in studentsWithSearch" v-bind:key="index" class="accordion-item">
            <h2 class="accordion-header" v-bind:id="index">
              <button class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      v-bind:data-bs-target="'#' + row.studentProfile.studentId"
                      aria-expanded="false"
                      v-bind:aria-controls="row.studentProfile.studentId">
                <div class="container">
                  <div class="row">
                    <div class="col-2">
                      <h6 class="list-item-label">Name</h6>
                      <span class="fw-bold">{{ row.lastName + ", " + row.firstName }}</span>
                    </div>
                    <div class="col-2">
                      <h6 class="list-item-label">Matrikelnr.</h6>
                      <span class="">{{ row.studentProfile.studentId }}</span>
                    </div>
                    <div class="col-2">
                      <h6 class="list-item-label">Praktika</h6>
                      <span class="">
                        {{ row.internshipModule.internships.length }}
                      </span>
                    </div>
                    <div class="col-2">
                      <h6 class="list-item-label">Gesamtdauer</h6>
                      <span class="">
                        {{ getInternshipModuleDuration(row.internshipModule.internships) }}
                      </span>
                    </div>
                    <div class="col-2 text-center">
                      <h6 class="list-item-label">Status</h6>
<!--                      <span class="badge rounded-pill bg-warning">-->
                      <span :class="`badge rounded-pill ${internshipModuleStatusColors[row
                      .internshipModule.status]}`">
                        {{ row.internshipModule.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </h2>
            <div v-bind:id="row.studentProfile.studentId"
                 class="accordion-collapse collapse"
                 aria-labelledby="headingOne"
                 data-bs-parent="#listAccordion">
              <div class="accordion-body">
                <div class="container">
                  <div class="row">
                    <div class="col-8">
                      <h5>Praktika</h5>
                      <div v-for="(internship, internshipIndex) in
                      row.internshipModule.internships"
                           v-bind:key="internshipIndex" class="card mb-3">
                        <div class="card-header">
                          {{ getDateString(internship.startDate) + ' - '
                        + getDateString(internship.endDate) }}
                          <span class="badge rounded-pill bg-secondary float-end">
                            {{ internship.status }}
                          </span>
                        </div>
                        <div class="card-body">
                          <h5 class="card-title">
                            {{ internship.companyDetails.companyName }}
                          </h5>
                          <h6 class="card-subtitle mb-2 text-muted">
                            {{ internship.companyDetails.address.city }},
                            {{ internship.companyDetails.address.country }}
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

                              <ul class="list-group">
                                <UsersListStatusItem text="Antrag"
                                                     :item="internship.requestPdf"/>
                                <UsersListStatusItem text="ECTS-Nachweis"
                                                     :item="internship.lsfEctsProofPdf"/>
                                <UsersListStatusItem text="Ortsnachweis"
                                                     :item="internship.locationJustificationPdf"/>
                                <UsersListStatusItem text="Praktikumsvertrag"
                                                     :item="internship.contractPdf"/>
                                <UsersListStatusItem text="BVG Ticket Ausnahme"
                                                     :item="internship.bvgTicketExemptionPdf"/>
                                <UsersListStatusItem text="Praktikumszeugnis"
                                                     :item="internship.certificatePdf"/>
                                <UsersListStatusItem text="Praktikumsbericht"
                                                     :item="internship.reportPdf"/>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div class="card-footer">
                          <button class="btn btn-success btn-sm me-2"
                               @click="quickActionApproveApplicationOnInternshipPart(row.id,
                                  internship.id)">
                            Antrag genehmigen</button>
                          <button class="btn btn-success btn-sm me-2"
                                  @click="quickActionMarkAsCompletedOnInternshipPart(row.id,
                                  internship.id)">
                            Anrechenbar markieren</button>
                          <button type="button" class="btn btn-secondary btn-sm me-2"
                                  data-bs-toggle="modal"
                                  data-bs-target="#internshipPartEditModal"
                                  @click="changeCurrentEditInternshipPartIndex(row.id,
                                  internship.id)">
                            Details bearbeiten</button>
                          <button class="btn btn-danger btn-sm me-2"
                                  @click="deleteInternshipPart(row.id, internship.id)">
                            Löschen</button>
                        </div>
                      </div>
                    </div>

                    <div class="col-4">
                      <div class="d-grid gap-2 mt-4 col-8 mx-auto">
                        <button class="btn btn-secondary"
                                type="button"
                                :disabled="row.internshipModule.aepPassed"
                                @click="quickActionMarkAepPassedOnInternshipModule(
                                  row.internshipModule._id,
                                  `${row.firstName} ${row.lastName}`)">
                          AEP bestanden markieren
                        </button>
                        <button type="button"
                                class="btn btn-secondary"
                                :disabled="row.studentProfile.internshipsSeen.length === 0"
                                @click="clearSearch(row._id,
                                `${row.firstName} ${row.lastName}`)">
                          Suchanfragen zurücksetzen</button>
                       <button type="button" class="btn btn-secondary" data-bs-toggle="modal"
                                data-bs-target="#internshipModuleEditModal"
                                @click="changeCurrentEditInternshipModuleIndex(row.id)">
                          Details bearbeiten</button>
                        <button class="btn btn-danger" type="button"
                                @click="deleteInternshipModule(row.id)">
                          Löschen
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="d-flex justify-content-center">
          <div class="spinner-border text-htw" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- InternshipModule Modal -->
<!--  <div class="modal fade" id="internshipModuleEditModal" tabindex="-1"-->
<!--       aria-labelledby="internshipModuleEditModalLabel" aria-hidden="true">-->
<!--    <div class="modal-dialog modal-xl">-->
<!--      <div class="modal-content">-->
<!--        <div class="modal-header">-->
<!--          <h5 class="modal-title" id="internshipModuleEditModalLabel">-->
<!--            Praktikumsmodul bearbeiten</h5>-->
<!--          <button type="button" class="btn-close" data-bs-dismiss="modal"-->
<!--                  aria-label="Close">-->
<!--          </button>-->
<!--        </div>-->
<!--        <div class="modal-body">-->
<!--          <p>für {{ users[currentEditInternshipModuleIndex].firstName }}-->
<!--             {{ users[currentEditInternshipModuleIndex].lastName }}-->
<!--            ({{users[currentEditInternshipModuleIndex].studentProfile.matrikelnummer}})</p>-->

<!--          <div class="mb-3">-->
<!--            <label for="inSemester" class="form-label">Fachsemester</label>-->
<!--            <input type="text" class="form-control" id="inSemester"-->
<!--                   aria-describedby="inSemester"-->
<!--                   v-model="users[currentEditInternshipModuleIndex]-->
<!--                   .studentProfile.internshipModule.inSemester" />-->
<!--          </div>-->

<!--          <div class="mb-3">-->
<!--            <label for="inSemesterOfStudy" class="form-label">Hochschulsemester</label>-->
<!--            <input type="text" class="form-control" id="inSemesterOfStudy"-->
<!--                   aria-describedby="inSemesterOfStudy"-->
<!--                   v-model="users[currentEditInternshipModuleIndex]-->
<!--                   .studentProfile-->
<!--                   .internshipModule-->
<!--                   .inSemesterOfStudy" />-->
<!--          </div>-->

<!--          <div class="mb-3">-->
<!--            <label for="AepPassed" class="form-label">AEP bestanden</label>-->
<!--            <div class="form-check form-switch">-->
<!--              <input class="form-check-input" type="checkbox" id="AepPassed"-->
<!--                     v-model="users[currentEditInternshipModuleIndex]-->
<!--                   .studentProfile-->
<!--                   .internshipModule-->
<!--                   .AepPassed">-->
<!--            </div>-->
<!--          </div>-->

<!--        </div>-->
<!--        <div class="modal-footer">-->
<!--          <button type="button" class="btn btn-secondary"-->
<!--                  data-bs-dismiss="modal">Schließen</button>-->
<!--          <button type="button"-->
<!--                  class="btn btn-success"-->
<!--                  @click="updateIntershipModule(currentEditInternshipModuleIndex)"-->
<!--          >Speichern</button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->

  <!-- InternshipPart Modal -->
<!--  <div class="modal fade" id="internshipPartEditModal" tabindex="-1"-->
<!--       aria-labelledby="internshipPartEditModalLabel" aria-hidden="true">-->
<!--    <div class="modal-dialog modal-xl">-->
<!--      <div class="modal-content">-->
<!--        <div class="modal-header">-->
<!--          <h5 class="modal-title" id="internshipPartEditModalLabel">-->
<!--            Teilpraktikum bearbeiten</h5>-->
<!--          <button type="button" class="btn-close" data-bs-dismiss="modal"-->
<!--                  aria-label="Close">-->
<!--          </button>-->
<!--        </div>-->
<!--        <div class="modal-body">-->
<!--          <p>Praktikum von-->
<!--            {{ users[currentEditInternshipModuleIndex].firstName }}-->
<!--            {{ users[currentEditInternshipModuleIndex].lastName }}-->
<!--            ({{users[currentEditInternshipModuleIndex].studentProfile.matrikelnummer}})-->
<!--            bei-->
<!--            {{ users[currentEditInternshipModuleIndex]-->
<!--              .studentProfile-->
<!--              .internshipModule-->
<!--              .internshipParts[currentEditInternshipPartIndex]-->
<!--              .companyBranch-->
<!--              .companyName }}-->
<!--            in-->
<!--            {{ users[currentEditInternshipModuleIndex]-->
<!--              .studentProfile-->
<!--              .internshipModule-->
<!--              .internshipParts[currentEditInternshipPartIndex]-->
<!--              .companyBranch-->
<!--              .address-->
<!--              .city}}-->
<!--          </p>-->

<!--          <div class="mb-3">-->
<!--            <label for="description" class="form-label">Beschreibung</label>-->
<!--            <input type="text" class="form-control" id="description"-->
<!--                   aria-describedby="inSemester"-->
<!--                   v-model="users[currentEditInternshipModuleIndex]-->
<!--                   .studentProfile-->
<!--                   .internshipModule-->
<!--                   .internshipParts[currentEditInternshipPartIndex]-->
<!--                   .description" />-->
<!--          </div>-->

<!--          <div class="mb-3">-->
<!--            <label for="tasks" class="form-label">Aufgaben</label>-->
<!--            <input type="text" class="form-control" id="tasks"-->
<!--                   aria-describedby="tasks"-->
<!--                   v-model="users[currentEditInternshipModuleIndex]-->
<!--                   .studentProfile-->
<!--                   .internshipModule-->
<!--                   .internshipParts[currentEditInternshipPartIndex]-->
<!--                   .tasks" />-->
<!--          </div>-->

<!--          <div class="mb-3">-->
<!--            <label for="operationalArea" class="form-label">Tätigkeitsbereich</label>-->
<!--            <input type="text" class="form-control" id="operationalArea"-->
<!--                   aria-describedby="operationalArea"-->
<!--                   v-model="users[currentEditInternshipModuleIndex]-->
<!--                   .studentProfile-->
<!--                   .internshipModule-->
<!--                   .internshipParts[currentEditInternshipPartIndex]-->
<!--                   .operationalArea" />-->
<!--          </div>-->

<!--          <div class="mb-3">-->
<!--            <label for="programmingLanguages" class="form-label">Programmiersprachen</label>-->
<!--            <input type="text" class="form-control" id="programmingLanguages"-->
<!--                   aria-describedby="programmingLanguages"-->
<!--                   v-model="users[currentEditInternshipModuleIndex]-->
<!--                   .studentProfile-->
<!--                   .internshipModule-->
<!--                   .internshipParts[currentEditInternshipPartIndex]-->
<!--                   .programmingLanguages" />-->
<!--          </div>-->

<!--          <div class="mb-3">-->
<!--            <label for="livingCosts" class="form-label">Lebenshaltungskosten</label>-->
<!--            <input type="text" class="form-control" id="livingCosts"-->
<!--                   aria-describedby="livingCosts"-->
<!--                   v-model="users[currentEditInternshipModuleIndex]-->
<!--                   .studentProfile-->
<!--                   .internshipModule-->
<!--                   .internshipParts[currentEditInternshipPartIndex]-->
<!--                   .livingCosts" />-->
<!--          </div>-->

<!--          <div class="mb-3">-->
<!--            <label for="salary" class="form-label">Gehalt</label>-->
<!--            <input type="text" class="form-control" id="salary"-->
<!--                   aria-describedby="salary"-->
<!--                   v-model="users[currentEditInternshipModuleIndex]-->
<!--                   .studentProfile-->
<!--                   .internshipModule-->
<!--                   .internshipParts[currentEditInternshipPartIndex]-->
<!--                   .salary" />-->
<!--          </div>-->

<!--          <div class="mb-3">-->
<!--            <label for="salary" class="form-label">-->
<!--              Bezahlungsart (Mehrfachauswahl möglich)</label>-->
<!--            <select class="form-select" multiple aria-label="multiple select example"-->
<!--                    v-model="users[currentEditInternshipModuleIndex]-->
<!--                   .studentProfile-->
<!--                   .internshipModule-->
<!--                   .internshipParts[currentEditInternshipPartIndex]-->
<!--                   .paymentType">-->
<!--              <option value="uncharted" selected>Unbekannt</option>-->
<!--              <option value="cash benefit">Cash Gehalt</option>-->
<!--              <option value="noncash benefit">Non-Cash Gehalt</option>-->
<!--              <option value="no payment">Unbezahlt</option>-->
<!--            </select>-->
<!--          </div>-->

<!--          <div class="mb-3">-->
<!--            <label for="startDate" class="form-label">Startdatum</label>-->
<!--            <input type="date" class="form-control" id="startDate"-->
<!--                   aria-describedby="startDate"-->
<!--                   v-model="users[currentEditInternshipModuleIndex]-->
<!--                   .studentProfile-->
<!--                   .internshipModule-->
<!--                   .internshipParts[currentEditInternshipPartIndex]-->
<!--                   .startDate" />-->
<!--          </div>-->

<!--          <div class="mb-3">-->
<!--            <label for="endDate" class="form-label">Enddatum</label>-->
<!--            <input type="date" class="form-control" id="endDate"-->
<!--                   aria-describedby="endDate"-->
<!--                   v-model="users[currentEditInternshipModuleIndex]-->
<!--                   .studentProfile-->
<!--                   .internshipModule-->
<!--                   .internshipParts[currentEditInternshipPartIndex]-->
<!--                   .endDate" />-->
<!--          </div>-->

<!--          <div class="mb-3">-->
<!--            <label for="workingHoursPerWeek" class="form-label">-->
<!--              Arbeitsstunden pro Woche</label>-->
<!--            <input type="number" min="0" class="form-control" id="workingHoursPerWeek"-->
<!--                   aria-describedby="workingHoursPerWeek"-->
<!--                   v-model="users[currentEditInternshipModuleIndex]-->
<!--                   .studentProfile-->
<!--                   .internshipModule-->
<!--                   .internshipParts[currentEditInternshipPartIndex]-->
<!--                   .workingHoursPerWeek" />-->
<!--          </div>-->

<!--          <div class="mb-3">-->
<!--            <label for="supervisorFirstName" class="form-label">Supervisor</label>-->
<!--            <div class="mb-2 row g-2 align-items-center">-->
<!--              <div class="col-6">-->
<!--                <input type="text" class="form-control" id="supervisorFirstName"-->
<!--                       aria-describedby="supervisorFirstName" placeholder="Vorname"-->
<!--                       v-model="users[currentEditInternshipModuleIndex]-->
<!--                   .studentProfile-->
<!--                   .internshipModule-->
<!--                   .internshipParts[currentEditInternshipPartIndex]-->
<!--                   .supervisor-->
<!--                   .firstName" />-->
<!--              </div>-->

<!--              <div class="col-6">-->
<!--                <input type="text" class="form-control" id="supervisorLastName"-->
<!--                       aria-describedby="supervisorLastName" placeholder="Nachname"-->
<!--                       v-model="users[currentEditInternshipModuleIndex]-->
<!--                   .studentProfile-->
<!--                   .internshipModule-->
<!--                   .internshipParts[currentEditInternshipPartIndex]-->
<!--                   .supervisor-->
<!--                   .lastName" />-->
<!--              </div>-->

<!--              <div class="col-12">-->
<!--                <input type="text" class="form-control" id="supervisorEmail"-->
<!--                       aria-describedby="supervisorEmail" placeholder="E-Mail"-->
<!--                       v-model="users[currentEditInternshipModuleIndex]-->
<!--                   .studentProfile-->
<!--                   .internshipModule-->
<!--                   .internshipParts[currentEditInternshipPartIndex]-->
<!--                   .supervisor-->
<!--                   .emailAddress" />-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

<!--          <div class="mb-3">-->
<!--            <label for="comment" class="form-label">Kommentar</label>-->
<!--            <textarea class="form-control" id="comment"-->
<!--                   aria-describedby="comment"-->
<!--                   v-model="users[currentEditInternshipModuleIndex]-->
<!--                   .studentProfile-->
<!--                   .internshipModule-->
<!--                   .internshipParts[currentEditInternshipPartIndex]-->
<!--                   .comment"></textarea>-->
<!--          </div>-->

<!--        </div>-->
<!--        <div class="modal-footer">-->
<!--          <button type="button" class="btn btn-secondary"-->
<!--                  data-bs-dismiss="modal">Schließen</button>-->
<!--          <button type="button"-->
<!--                  class="btn btn-success"-->
<!--                  @click="updateIntershipPart(currentEditInternshipModuleIndex)"-->
<!--          >Speichern</button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Student from '@/models/Student';
import {
  clearStudentSearch,
  getCompany,
  getInternshipModule,
  getStudentsList,
  markAepPassedOnInternshipModule,
} from '@/utils/gateways';
import { getDateString, getInternshipModuleDuration, getTimeDifferenceDays } from '@/utils/admin';
import internshipModuleStatusColors from '@/models/InternshipModuleStatus';
import store from '@/store';
import UsersListStatusItem from '@/components/admin/UsersListStatusItem.vue';

export default defineComponent({
  name: 'UsersList',
  components: {
    UsersListStatusItem,
  },
  data() {
    return {
      currentEditInternshipModuleIndex: 0,
      currentEditInternshipPartIndex: 0,
      currentSorting: '',
      currentFilterDuration: '',
      currentFilterStatus: '',
      currentSearch: '',
      students: [] as Student[],
      isLoading: false,
      internshipModuleStatusColors,
    };
  },
  computed: {
    studentsWithSearch(): Student[] {
      return this.students.filter((student) => student.firstName.toLowerCase()
        .includes(this.currentSearch.toLowerCase())
        || student
          .lastName
          .toLowerCase()
          .includes(this.currentSearch.toLowerCase())
        || student
          .studentProfile.studentId
          .toLowerCase()
          .includes(this.currentSearch.toLowerCase()));
    },
  },
  mounted() {
    this.updateList();
  },
  methods: {
    getDateString,
    getInternshipModuleDuration,
    getTimeDifferenceDays,
    async updateList() {
      this.isLoading = true;
      try {
        const studentList = await getStudentsList() as Student[];
        for (let i = 0; i < studentList.length; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          studentList[i].internshipModule = await getInternshipModule(studentList[i]
            .studentProfile.internship);
          for (let k = 0; k < studentList[i].internshipModule.internships.length; k += 1) {
            studentList[i]
              .internshipModule
              .internships[k]
              // eslint-disable-next-line no-await-in-loop
              .companyDetails = await getCompany(studentList[i].internshipModule
                .internships[k]
                .company);
          }
        }
        this.students = studentList;
        console.log(studentList);
      } catch (err) {
        console.log(err);
      }
      this.isLoading = false;
    },
    async clearSearch(studentId: string, studentName: string) {
      const userDoubleChecked = window.confirm(`Suchanfragen für ${studentName} zurücksetzen?`);
      if (userDoubleChecked) {
        const apiResponse = await clearStudentSearch(studentId);
        console.log(apiResponse);
        if ('status' in apiResponse && apiResponse.status === 204) {
          await store.dispatch('addNotification', {
            text: `Die Suche wurde für ${studentName} zurückgesetzt.`,
            type: 'success',
          });
        } else {
          await store.dispatch('addNotification', {
            text: 'Die Suche konnte nicht zurückgesetzt werden.',
            type: 'danger',
          });
        }
      } else {
        console.log('cancel');
      }
      return true;
    },
    async quickActionMarkAepPassedOnInternshipModule(
      internshipModuleId: string,
      studentName: string,
    ) {
      const userDoubleChecked = window.confirm('AEP zum Praktikumsmodul wirklich '
        + 'als bestanden markieren?');
      if (userDoubleChecked) {
        const apiResponse = await markAepPassedOnInternshipModule(internshipModuleId);
        console.log(apiResponse);
        if ('status' in apiResponse && apiResponse.status === 200) {
          await store.dispatch('addNotification', {
            text: `Das AEP für ${studentName} als bestanden markiert.`,
            type: 'success',
          });
        } else {
          await store.dispatch('addNotification', {
            text: 'Das AEP konnte nicht als bestanden markiert werden.',
            type: 'danger',
          });
        }
      } else {
        console.log('cancel');
      }
      return true;
    },
    changeCurrentEditInternshipModuleIndex(internshipModuleId: number) {
      this.currentEditInternshipModuleIndex = internshipModuleId;
    },
    updateIntershipModule(internshipModuleId: number) {
      return true;
    },
    changeCurrentEditInternshipPartIndex(internshipModuleId: number, internshipPartId: number) {
      this.currentEditInternshipModuleIndex = internshipModuleId;
      this.currentEditInternshipPartIndex = internshipPartId;
    },
    updateIntershipPart(internshipModuleId: number, internshipPartId: number) {
      return true;
    },
    // async quickActionApproveApplicationOnInternshipPart(internshipModuleId: number,
    //   internshipPartId: number) {
    //   const userDoubleChecked = window.confirm('Antrag zum Praktikum wirklich genehmigen?');
    //   if (userDoubleChecked) {
    //     this.users[internshipModuleId]
    //       .studentProfile
    //       .internshipModule
    //       .internshipParts[internshipPartId]
    //       .events
    //       .push({
    //         type: 'Internship Application approved',
    //       });
    //     console.log('Antrag genehmigt!');
    //   } else {
    //     console.log('cancel');
    //   }
    //   return true;
    // },
    // quickActionMarkAsCompletedOnInternshipPart(internshipModuleId: number,
    //   internshipPartId: number) {
    //   const userDoubleChecked = window
    //     .confirm('Teilpraktikum wirklich als anrechenbar markieren?');
    //   if (userDoubleChecked) {
    //     this.users[internshipModuleId]
    //       .studentProfile
    //       .internshipModule
    //       .internshipParts[internshipPartId]
    //       .events
    //       .push({
    //         type: 'readyForGrading',
    //       });
    //     console.log('Teilpraktikum anrechenbar markiert!');
    //   } else {
    //     console.log('cancel');
    //   }
    //   return true;
    // },
    deleteInternshipModule(internshipModuleId: number) {
      const userDoubleChecked = window.confirm('Praktikumsmodul wirklich löschen?');
      if (userDoubleChecked) {
        // API call delete
        console.log('InternshipModule mit Id: ', internshipModuleId, ' gelöscht');
      } else {
        console.log('cancel');
      }
      return true;
    },
    deleteInternshipPart(internshipModuleId: number, internshipPartId: number) {
      const userDoubleChecked = window.confirm('Teilpraktikum wirklich löschen?');
      if (userDoubleChecked) {
        // API call delete
        console.log('InternshipPart mit internshipModuleId: ', internshipModuleId, ' und '
          + 'internshipPartId: ', internshipPartId, 'gelöscht');
      } else {
        console.log('cancel');
      }
      return true;
    },
    changeSorting() {
      if (this.currentSorting === 'lastName') {
        this.students
          .sort((a, b) => a[this.currentSorting]
            .localeCompare(b[this.currentSorting]));
      } else if (this.currentSorting === 'studentId') {
        this.students
          .sort((a, b) => a.studentProfile[this.currentSorting]
            .localeCompare(b.studentProfile[this.currentSorting]));
      }
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

  .text-htw {
    color: rgba(119, 185, 0, 1);
    width: 3rem;
    height: 3rem;
  }

</style>
