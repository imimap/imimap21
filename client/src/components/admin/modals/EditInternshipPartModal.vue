<!-- eslint-disable max-len -->
<template>
  <div class="modal fade"
       id="internshipPartEditModal"
       tabindex="-1"
       aria-labelledby="internshipPartEditModalLabel"
       aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="internshipPartEditModalLabel">Teilpraktikum bearbeiten</h5>
          <button type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  ref="closeButton"
          />
        </div>
        <div class="modal-body">
          <p>
            Praktikum von {{ student?.firstName }} {{ student?.lastName }}
            ({{ student?.studentProfile.studentId }})
            bei {{ internshipPart?.company?.companyName }}
            in {{ internshipPart?.company?.address?.city }}
          </p>

          <div class="mb-3">
            <label for="tasks" class="form-label">Aufgaben</label>
            <input type="text"
                   class="form-control"
                   id="tasks"
                   aria-describedby="tasks"
                   :placeholder="internshipPart?.tasks"
                   :content="internshipPart?.tasks"
            />
          </div>

          <div class="mb-3">
            <label for="operationalArea" class="form-label">Tätigkeitsbereich</label>
            <input type="text"
                   class="form-control"
                   id="operationalArea"
                   aria-describedby="operationalArea"
                   :placeholder="internshipPart?.operationalArea"
                   :content="internshipPart?.operationalArea"
            />
          </div>

          <div class="mb-3">
            <label for="programmingLanguages" class="form-label">Programmiersprachen</label>
            <input type="text"
                   class="form-control"
                   id="programmingLanguages"
                   aria-describedby="programmingLanguages"
                   :placeholder="internshipPart?.programmingLanguages?.toString().split(',').join(', ')"
                  :content="internshipPart?.programmingLanguages"
            />
          </div>

          <div class="mb-3">
            <label for="livingCosts" class="form-label">Lebenshaltungskosten</label>
            <input type="number"
                   class="form-control"
                   id="livingCosts"
                   aria-describedby="livingCosts"
                   :placeholder="internshipPart?.livingCosts?.toString()"
                   :content="internshipPart?.livingCosts"
            />
          </div>

          <div class="mb-3">
            <label for="salary" class="form-label">Gehalt</label>
            <input type="number"
                   class="form-control"
                   id="salary"
                   aria-describedby="salary"
                   :placeholder="internshipPart?.salary?.toString()"
                   :content="internshipPart?.salary"
            />
          </div>

          <div class="mb-3">
            <label for="salary" class="form-label">
              Bezahlungsart (Mehrfachauswahl möglich)</label>
            <select class="form-select"
                    multiple
                    aria-label="multiple select example"
                    :content="internshipPart?.paymentTypes"
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
            <label for="startDate" class="form-label">Startdatum</label>
            <input type="date"
                   class="form-control"
                   id="startDate"
                   aria-describedby="startDate"
                   v-model="startDate"
            />
          </div>

          <div class="mb-3">
            <label for="endDate" class="form-label">Enddatum</label>
            <input type="date"
                   class="form-control"
                   id="endDate"
                   aria-describedby="endDate"
                   v-model="endDate"
            />
          </div>

          <div class="mb-3">
            <label for="workingHoursPerWeek" class="form-label">Arbeitsstunden pro Woche</label>
            <input type="number"
                   min="0"
                   class="form-control"
                   id="workingHoursPerWeek"
                   aria-describedby="workingHoursPerWeek"
                   :placeholder="internshipPart?.workingHoursPerWeek?.toString()"
                   :content="internshipPart?.workingHoursPerWeek"
            />
          </div>

          <div class="mb-3">
            <label for="supervisorName" class="form-label">Supervisor</label>
            <input type="text"
                   class="form-control"
                   id="supervisorName"
                   aria-describedby="supervisorName"
                   :placeholder="internshipPart?.supervisor?.fullName"
                   :content="internshipPart?.supervisor?.fullName"
            />
          </div>

          <div class="mb-3">
            <input type="text"
                   class="form-control"
                   id="supervisorEmail"
                   aria-describedby="supervisorEmail"
                   :placeholder="internshipPart?.supervisor?.emailAddress"
                   :content="internshipPart?.supervisor?.emailAddress"
            />
          </div>

          <div class="mb-3">
            <label for="comment" class="form-label">Kommentar (nicht implementiert)</label>
            <textarea class="form-control"
                      id="comment"
                      aria-describedby="comment"
                      :placeholder="internshipPart?.comment"
            ></textarea>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Schließen
          </button>
          <button type="button"
                  class="btn btn-success"
                  @click="updateInternshipPart"
          >
            Speichern
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
import { showSuccessNotification } from '@/utils/notification';

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
      startDate: undefined as string | undefined,
      endDate: undefined as string | undefined,

    };
  },
  async mounted() {
    this.availablePaymentTypes = await loadPaymentTypes();
  },
  async created() {
    this.internshipPart = this.student?.studentProfile.internship.internships[this.internshipIndex];
  },

  methods: {
    normalizedDate(date: string | undefined): string | undefined {
      if (!date) return undefined;
      const dateWithoutTime = new Date(date).toISOString().split('T')[0].toString();
      return dateWithoutTime;
    },
    async updateInternshipPart() {
      if (!this.internshipPart) return;
      this.internshipPart.startDate = this.normalizedDate(this.startDate)
        ?? this.internshipPart.startDate;
      this.internshipPart.endDate = this.normalizedDate(this.endDate)
        ?? this.internshipPart.endDate;
      const updatedInternship = await
      updateInternship(this.internshipPart._id, this.internshipPart);
      if (updatedInternship === null) return;
      this.$emit('updateInternship', this.student?._id, this.internshipIndex, updatedInternship);
      await showSuccessNotification('Änderungen am Praktikum gespeichert');
      (this.$refs.closeButton as HTMLButtonElement).click();
    },

    isSelectedPaymentType(paymentType: string): boolean {
      if (!this.internshipPart || this.internshipPart?.paymentTypes.length === 0) {
        return false;
      }
      return this.internshipPart.paymentTypes.indexOf(paymentType) !== -1;
    },
  },
  watch: {
    student() {
      this.internshipPart = undefined;
      // eslint-disable-next-line max-len
      this.internshipPart = this.student?.studentProfile.internship.internships[this.internshipIndex];
      this.startDate = this.normalizedDate(this.internshipPart?.startDate);
      this.endDate = this.normalizedDate(this.internshipPart?.endDate);
    },
    internshipIndex() {
      this.internshipPart = undefined;
      // eslint-disable-next-line max-len
      this.internshipPart = this.student?.studentProfile.internship.internships[this.internshipIndex];
      this.startDate = this.normalizedDate(this.internshipPart?.startDate);
      this.endDate = this.normalizedDate(this.internshipPart?.endDate);
    },
  },
});
</script>
