<template>
  <div class="accordion-item">
    <div class="accordion-header">
      <div class="accordion-button collapsed"
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
              <h6 class="list-item-label">{{ $t("userList.studentEntry.matriculationNumber") }}</h6>
              <span>{{ student.studentProfile.studentId }}</span>
            </div>
            <div class="col-2">
              <h6 class="list-item-label">{{ $t("userList.studentEntry.internships") }}</h6>
              <span>{{ internship.internships.length }}</span>
            </div>
            <div class="col-2">
              <h6 class="list-item-label">{{ $t("userList.studentEntry.duration") }}</h6>
              <span>
                {{ getInternshipModuleDuration(internship.internships) }}
              </span>
            </div>
            <div class="col-2 text-center">
              <h6 class="list-item-label">Status</h6>
              <span  v-if="internship.internships.length > 0">
                <span v-for="(internshipPart, internshipIndex) in internship.internships"
                  :key="internshipIndex"
                  :class="['badge', 'rounded-pill', statusBadgeColors[(internshipPart as any).status]] "
                  style="margin: 0 2px;"
                  >
                  <span  v-if="(internshipPart as any).status">{{ (internshipPart as any).status }}</span>
                </span>
              </span>
              <span v-else>
                <span>-</span>
              </span>
            </div>
            <div class="col-2 text-center">
              <h6 class="list-item-label">AEP</h6>
              <span :class="['badge','rounded-pill', aepBadgeColor]">{{ aepStatus }}</span>
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
              <h5>{{ $t("userList.studentEntry.internships") }}</h5>
              <InternshipPart v-for="(internshipPart, internshipIndex) in internship.internships"
                              :key="internshipIndex"
                              :internship="internshipPart"
                              :index="internshipIndex"
                              @editInternshipPart="editInternshipPart"
                              @updateInternship="updateInternship"
              />
            </div>

            <div class="col-4">
              <div class="d-grid gap-2 mt-4 col-8 mx-auto">
                <button class="btn btn-success"
                        type="button"
                        :disabled="internship.aepPassed"
                        @click="passAEP()"
                >
                {{ $t("userList.studentEntry.passAEP") }}
                </button>
                <button type="button"
                        class="btn btn-secondary"
                        :disabled="student.studentProfile.companiesSeen.length === 0"
                        @click="clearSearch"
                >
                {{ $t("userList.studentEntry.resetSearchLimit") }}
                </button>
                <button type="button"
                        class="btn btn-secondary"
                        data-bs-toggle="modal"
                        data-bs-target="#internshipModuleEditModal"
                        @click="$emit('editInternshipModule', student)"
                >
                {{ $t("userList.studentEntry.editDetails") }}
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
import {
  getDateString, getInternshipModuleDuration, getTimeDifferenceDays,
} from '@/utils/admin';
import statusBadgeColors from '@/utils/statusBadgeColors';
import Student from '@/models/Student';
import { clearStudentSearch, markAepPassedOnInternshipModule } from '@/utils/gateways';
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
      statusBadgeColors: statusBadgeColors(),
    };
  },
  computed: {
    internship(): InternshipModule {
      return this.student.studentProfile.internship;
    },
    aepStatus(): string {
      return this.internship.aepPassed ? `${this.$t('userList.studentEntry.passed')}` : `${this.$t('userList.studentEntry.open')}`;
    },
    aepBadgeColor(): string {
      return this.internship.aepPassed ? 'bg-success' : 'bg-secondary';
    },
  },
  methods: {
    getDateString,
    getInternshipModuleDuration,
    getTimeDifferenceDays,
    async passAEP() {
      const userDoubleChecked = window.confirm(`${this.$t('userList.notifications.confirmAEP')}`);
      if (!userDoubleChecked) return;
      const apiResponse = await markAepPassedOnInternshipModule(
        this.student.studentProfile.internship._id,
      );
      if (!('status' in apiResponse) || apiResponse.status !== 200) {
        await showErrorNotification(`${this.$t('userList.notifications.aepError')}`);
        return;
      }
      // eslint-disable-next-line max-len
      await showSuccessNotification(`${this.$t('userList.notifications.aepSuccessPart1')}${this.student.firstName} ${this.student.lastName}${this.$t('userList.notifications.aepSuccessPart2')}`);
      this.$emit('updateStudent', this.student._id);
    },
    async clearSearch() {
      const userDoubleChecked = window.confirm(`${this.$t('userList.notifications.confrimResetSearchResultPart1')}${this.student.firstName}
      ${this.student.lastName}${this.$t('userList.notifications.confrimResetSearchResultPart2')}`);
      if (!userDoubleChecked) return;
      const apiResponse = await clearStudentSearch(this.student._id);
      if (!('status' in apiResponse) || apiResponse.status !== 204) {
        await showErrorNotification(`${this.$t('userList.notifications.resetSearchResultError')}`);
        return;
      }
      await showSuccessNotification(`${this.$t('userList.notifications.resetSearchResultPart1')}${this.student.firstName}
      ${this.student.lastName}${this.$t('userList.notifications.resetSearchResultPart2')}`);
      this.$emit('updateStudent', this.student._id);
    },
    editInternshipPart(internshipPartIndex: number) {
      this.$emit('editInternshipPart', this.student, internshipPartIndex);
    },
    updateInternship(index: number, internship: Internship) {
      this.$emit('updateInternship', this.student._id, index, internship);
    },
  },
});
</script>
