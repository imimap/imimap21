<template>
  <div class="modal fade"
       id="internshipPartEditModal"
       tabindex="-1"
       aria-labelledby="internshipPartEditModalLabel"
       aria-hidden="true"
       ref=""
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="internshipPartEditModalLabel">{{ $t('internship.heading.edit') }}</h5>
          <button type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  ref="closeButton"
                  @click="resetData"
          />
        </div>
        <div v-if="internshipPart != undefined" class="modal-body">
          <p>
            <span>
             {{$t("internship.heading.internshipOf") }}
            </span>
            <span>{{ student?.firstName }} {{ student?.lastName }}
            ({{ student?.studentProfile.studentId }})</span>
            <span>   {{$t("internship.heading.at") }}</span>
            <span>{{ internshipPart?.company?.companyName }}</span>
            <span>{{$t("internship.heading.in") }}</span>
            <span>{{ internshipPart?.company?.address?.city }}</span>
          </p>

          <div class="mb-3">
            <label for="tasks" class="form-label">{{ $t('internship.form.tasks') }}</label>
            <input type="text"
                   class="form-control"
                   id="tasks"
                   aria-describedby="tasks"
                   v-model="internshipPart.tasks"
            />
          </div>

          <div class="mb-3">
            <label for="operationalArea" class="form-label">{{ $t('internship.form.operationalArea') }}</label>
            <input type="text"
                   class="form-control"
                   id="operationalArea"
                   aria-describedby="operationalArea"
                   v-model="internshipPart.operationalArea"
            />
          </div>

          <div class="mb-3">
            <label for="programmingLanguages" class="form-label">{{ $t('internship.form.programmingLanguages') }}</label>
            <input type="text"
                   class="form-control"
                   id="programmingLanguages"
                   aria-describedby="programmingLanguages"
                   v-model="internshipPart.programmingLanguages"
            />
          </div>

          <div class="mb-3">
            <label for="livingCosts" class="form-label">{{ $t('internship.form.livingCosts') }}</label>
            <input type="number"
                   class="form-control"
                   id="livingCosts"
                   aria-describedby="livingCosts"
                   v-model="internshipPart.livingCosts"
            />
          </div>

          <div class="mb-3">
            <label for="salary" class="form-label">{{ $t('internship.form.salary') }}</label>
            <input type="number"
                   class="form-control"
                   id="salary"
                   aria-describedby="salary"
                   v-model="internshipPart.salary"
            />
          </div>

          <div class="mb-3">
            <label for="salary" class="form-label">
              {{ $t('internship.form.paymentType.info') }}</label>
            <select class="form-select"
                    multiple
                    aria-label="multiple select example"
                    v-model="internshipPart.paymentTypes"
            >
              <option v-for="paymentType in availablePaymentTypes"
                      :key="paymentType"
                      :value="paymentType"
                      :selected="isSelectedPaymentType(paymentType)"
              >
                {{ paymentType }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label for="startDate" class="form-label">{{ $t('internship.form.startDate') }}</label>
            <input type="date"
                   class="form-control"
                   id="startDate"
                   aria-describedby="startDate"
                   v-model="internshipPart.startDate"
            />
          </div>

          <div class="mb-3">
            <label for="endDate" class="form-label">{{ $t('internship.form.endDate') }}</label>
            <input type="date"
                   class="form-control"
                   id="endDate"
                   aria-describedby="endDate"
                   v-model="internshipPart.endDate"
            />
          </div>

          <div class="mb-3">
            <label for="workingHoursPerWeek" class="form-label">{{ $t('internship.form.workingHoursPerWeek') }}</label>
            <input type="number"
                   min="0"
                   class="form-control"
                   id="workingHoursPerWeek"
                   aria-describedby="workingHoursPerWeek"
                   v-model="internshipPart.workingHoursPerWeek"
            />
          </div>

          <div class="mb-3">
            <label for="supervisorName" class="form-label">{{ $t('internship.form.supervisorName') }}</label>
            <input type="text"
                   class="form-control"
                   id="supervisorName"
                   aria-describedby="supervisorName"
                   v-model="internshipPart.supervisor.fullName"
            />
          </div>

          <div class="mb-3">
            <label for="supervisorEmail" class="form-label required">{{ $t('internship.form.supervisorEmail') }}</label>
            <input type="text"
                   class="form-control"
                   id="supervisorEmail"
                   aria-describedby="supervisorEmail"
                   v-model="internshipPart.supervisor.emailAddress"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="resetData">
            {{ $t('internship.modal.close') }}
          </button>
          <button type="button"
                  class="btn btn-success"
                  @click="updateInternshipPart"
          >
          {{ $t('internship.modal.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Student from '@/models/Student';
import Internship from '@/models/Internship';
import { loadPaymentTypes, updateInternship } from '@/utils/gateways';
import { showErrorNotification, showSuccessNotification } from '@/utils/notification';

export default defineComponent({
  name: 'EditInternshipPartModal',
  props: {
    student: Object as PropType<Student>,
    internshipIndex: {
      type: Number,
      required: true,
    },
  },
  emits: ['updateInternship'],
  data() {
    return {
      availablePaymentTypes: [] as string[],
      internshipPart: {} as Internship | undefined,
      originalInternshipPart: '',
    };
  },
  async mounted() {
    this.availablePaymentTypes = await loadPaymentTypes();
  },
  async created() {
    this.internshipPart = this.student?.studentProfile.internship.internships[this.internshipIndex];
  },

  methods: {
    normalizedDate(date: string): string {
      return new Date(date).toISOString().split('T')[0].toString();
    },
    async updateInternshipPart() {
      try {
        if (!this.internshipPart?.supervisor.emailAddress) {
          throw new Error('Please enter an e-mail for the supervisor');
        }
        const updatedInternship = await
        updateInternship(this.internshipPart._id, this.internshipPart);
        this.$emit('updateInternship', this.student?._id, this.internshipIndex, updatedInternship);
        await showSuccessNotification('Änderungen am Praktikum gespeichert');
        (this.$refs.closeButton as HTMLButtonElement).click();
      } catch (err: any) {
        await showErrorNotification(err);
        this.resetData();
      }
    },
    isSelectedPaymentType(paymentType: string): boolean {
      if (!this.internshipPart || this.internshipPart?.paymentTypes.length === 0) {
        return false;
      }
      return this.internshipPart.paymentTypes.indexOf(paymentType) !== -1;
    },
    updateProperties() {
      this.internshipPart = undefined;
      this.internshipPart = this.student?.studentProfile.internship.internships[this.internshipIndex];
      this.originalInternshipPart = JSON.stringify(this.internshipPart);
    },
    resetData() {
      if (this.originalInternshipPart) {
        this.internshipPart = JSON.parse(this.originalInternshipPart);
      }
    },
  },
  watch: {
    student() {
      this.updateProperties();
    },
    internshipIndex() {
      this.updateProperties();
    },
    'internshipPart.endDate': function (newValue) {
      if (this.internshipPart) this.internshipPart.endDate = this.normalizedDate(newValue);
    },
    'internshipPart.startDate': function (newValue) {
      if (this.internshipPart) this.internshipPart.startDate = this.normalizedDate(newValue);
    },
  },
});
</script>
