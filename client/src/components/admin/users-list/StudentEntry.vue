<template>
  <div class="accordion-item">
    <div class="accordion-header">
      <div class="accordion-button collapsed"
           type="button"
           data-bs-toggle="collapse"
           :data-bs-target="'#' + student.studentProfile.studentId"
           aria-expanded="false"
           :aria-controls="student.studentProfile.studentId"
      >
        <div class="container">
          <div class="row">
            <div class="col-2">
              <h6 class="list-item-label">Name</h6>
              <span class="fw-bold">{{ student.lastName + ", " + student.firstName }}</span>
            </div>
            <div class="col-2">
              <h6 class="list-item-label">Matrikelnr.</h6>
              <span>{{ student.studentProfile.studentId }}</span>
            </div>
            <div class="col-2">
              <h6 class="list-item-label">Praktika</h6>
              <span>{{ internship.internships.length }}</span>
            </div>
            <div class="col-2">
              <h6 class="list-item-label">Gesamtdauer</h6>
              <span>
                {{ getInternshipModuleDuration(internship.internships) }}
              </span>
            </div>
            <div class="col-2 text-center">
              <h6 class="list-item-label">Status</h6>
              <span :class=
                      "`badge rounded-pill ${internshipModuleStatusColors[internship.status]}`"
              >
                {{ internship.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :id="student.studentProfile.studentId"
         class="accordion-collapse collapse"
         aria-labelledby="headingOne"
         data-bs-parent="#listAccordion"
    >
      <div class="accordion-body">
        <div class="container">
          <div class="row">
            <div class="col-8">
              <h5>Praktika</h5>
              <InternshipPart v-for="(internship, internshipIndex) in internship.internships"
                              :key="internshipIndex"
                              :internship="internship"
                              :index="internshipIndex"
                              @editInternshipPart="editInternshipPart"
                              @updateInternship="updateInternship"
              />
            </div>

            <div class="col-4">
              <div class="d-grid gap-2 mt-4 col-8 mx-auto">
                <button class="btn btn-secondary"
                        type="button"
                        :disabled="internship.aepPassed"
                        @click="passAEP(internship._id,
                                    `${student.firstName} ${student.lastName}`)"
                >
                  AEP bestanden markieren
                </button>
                <button type="button"
                        class="btn btn-secondary"
                        :disabled="student.studentProfile.internshipsSeen.length === 0"
                        @click="clearSearch"
                >
                  Suchanfragen zurücksetzen
                </button>
                <button type="button"
                        class="btn btn-secondary"
                        data-bs-toggle="modal"
                        data-bs-target="#internshipModuleEditModal"
                        @click="$emit('editInternshipModule', student)"
                >
                  Details bearbeiten
                </button>
                <button class="btn btn-danger" type="button"
                        @click="deleteInternshipModule"
                >
                  Löschen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// TODO: Implement custom alert box
/* eslint-disable no-alert */
import { defineComponent, PropType } from 'vue';
import { getDateString, getInternshipModuleDuration, getTimeDifferenceDays } from '@/utils/admin';
import internshipModuleStatusColors from '@/models/InternshipModuleStatus';
import Student from '@/models/Student';
import {
  clearStudentSearch,
  deleteInternshipModule,
  markAepPassedOnInternshipModule,
} from '@/utils/gateways';
import { showErrorNotification, showSuccessNotification } from '@/utils/notification';
import InternshipPart from '@/components/admin/users-list/InternshipPart.vue';
import InternshipModule from '@/models/InternshipModule';
import Internship from '@/models/Internship';

export default defineComponent({
  name: 'StudentEntry',
  components: {
    InternshipPart,
  },
  props: {
    student: {
      type: Object as PropType<Student>,
      required: true,
    },
  },
  emits: ['editInternshipModule', 'editInternshipPart', 'updateStudent', 'updateInternship'],
  data() {
    return {
      internshipModuleStatusColors,
    };
  },
  computed: {
    internship(): InternshipModule {
      return this.student.studentProfile.internship;
    },
  },
  methods: {
    getDateString,
    getInternshipModuleDuration,
    getTimeDifferenceDays,
    async passAEP() {
      const userDoubleChecked = window.confirm('AEP zum Praktikumsmodul wirklich '
        + 'als bestanden markieren?');
      if (!userDoubleChecked) return;
      const apiResponse = await markAepPassedOnInternshipModule(
        this.student.studentProfile.internship._id,
      );
      if (!('status' in apiResponse) || apiResponse.status !== 200) {
        await showErrorNotification('Das AEP konnte nicht als bestanden markiert werden.');
        return;
      }
      await showSuccessNotification(`Das AEP für ${this.student.firstName} ${this.student.lastName} als bestanden markiert.`);
      this.$emit('updateStudent', this.student._id);
    },
    async deleteInternshipModule() {
      // TODO: API Endpoint doesn't exist. Is this really needed?
      const userDoubleChecked = window.confirm('Praktikumsmodul wirklich löschen?');
      if (!userDoubleChecked) return;
      const result = await deleteInternshipModule(this.student.studentProfile.internship._id);
      if (!result) return;
      await showSuccessNotification('Das Praktikumsmodul wurde gelöscht.');
    },
    async clearSearch() {
      const userDoubleChecked = window.confirm(`Suchanfragen für ${this.student.firstName}
      ${this.student.lastName} zurücksetzen?`);
      if (!userDoubleChecked) return;
      const apiResponse = await clearStudentSearch(this.student._id);
      if (!('status' in apiResponse) || apiResponse.status !== 204) {
        await showErrorNotification('Die Suche konnte nicht zurückgesetzt werden.');
        return;
      }
      await showSuccessNotification(`Die Suche wurde für ${this.student.firstName}
      ${this.student.lastName} wurde zurückgesetzt.`);
      this.$emit('updateStudent', this.student._id);
    },
    editInternshipPart(internshipPartIndex: number) {
      this.$emit('editInternshipPart', this.student, internshipPartIndex);
    },
    updateInternship(index: number, internship: Internship) {
      // TODO: Maybe use the updated internship returned by the API for updating the frontend.
      // Currently the updated internship doesn't populate the company, so there is some data
      // missing. Merge updated internship with existing one?
      // this.$emit('updateInternship', this.student._id, index, internship);
      this.$emit('updateStudent', this.student._id);
    },
  },
});
</script>
