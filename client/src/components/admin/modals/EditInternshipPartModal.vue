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
                   v-model="tasks"
            />
          </div>

          <div class="mb-3">
            <label for="operationalArea" class="form-label">Tätigkeitsbereich</label>
            <input type="text"
                   class="form-control"
                   id="operationalArea"
                   aria-describedby="operationalArea"
                   :placeholder="internshipPart?.operationalArea"
                   v-model="operationalArea"
            />
          </div>

          <div class="mb-3">
            <label for="programmingLanguages" class="form-label">Programmiersprachen</label>
            <input type="text"
                   class="form-control"
                   id="programmingLanguages"
                   aria-describedby="programmingLanguages"
                   :placeholder="internshipPart?.programmingLanguages"
                   v-model="programmingLanguages"
            />
          </div>

          <div class="mb-3">
            <label for="livingCosts" class="form-label">Lebenshaltungskosten</label>
            <input type="number"
                   class="form-control"
                   id="livingCosts"
                   aria-describedby="livingCosts"
                   :placeholder="internshipPart?.livingCosts"
                   v-model.number="livingCosts"
            />
          </div>

          <div class="mb-3">
            <label for="salary" class="form-label">Gehalt</label>
            <input type="number"
                   class="form-control"
                   id="salary"
                   aria-describedby="salary"
                   :placeholder="internshipPart?.salary"
                   v-model.number="salary"
            />
          </div>

          <div class="mb-3">
            <label for="salary" class="form-label">
              Bezahlungsart (Mehrfachauswahl möglich)</label>
            <select class="form-select"
                    multiple
                    aria-label="multiple select example"
                    v-model="paymentTypes"
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
                   :placeholder="internshipPart?.workingHoursPerWeek"
                   v-model.number="workingHoursPerWeek"
            />
          </div>

          <div class="mb-3">
            <label for="supervisorName" class="form-label">Supervisor</label>
            <input type="text"
                   class="form-control"
                   id="supervisorName"
                   aria-describedby="supervisorName"
                   :placeholder="internshipPart?.supervisor.fullName"
                   v-model="supervisorFullName"
            />
          </div>

          <div class="mb-3">
            <input type="text"
                   class="form-control"
                   id="supervisorEmail"
                   aria-describedby="supervisorEmail"
                   :placeholder="internshipPart?.supervisor.emailAddress"
                   v-model="supervisorEmailAddress"
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
import { createPayloadFromChangedProps, jsDateToHTMLDate } from '@/utils/admin';
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
    const initialProps = {
      tasks: undefined as string | undefined,
      operationalArea: undefined as string | undefined,
      programmingLanguages: undefined as string | undefined,
      livingCosts: undefined as number | undefined,
      salary: undefined as number | undefined,
      paymentTypes: undefined as string[] | undefined,
      startDate: jsDateToHTMLDate((this.internshipPart as unknown as Internship)?.startDate),
      endDate: jsDateToHTMLDate((this.internshipPart as unknown as Internship)?.endDate),
      workingHoursPerWeek: undefined as number | undefined,
      supervisorFullName: undefined as string | undefined,
      supervisorEmailAddress: undefined as string | undefined,
    };

    const updatableProperties = Object.keys(initialProps);

    return {
      availablePaymentTypes: [] as string[],
      updatableProperties,
      ...initialProps,
    };
  },
  async mounted() {
    this.availablePaymentTypes = await loadPaymentTypes();
  },
  computed: {
    internshipPart(): Internship | undefined {
      return this.student?.studentProfile.internship.internships[this.internshipIndex];
    },
  },
  methods: {
    jsDateToHTMLDate,
    async updateInternshipPart() {
      if (!this.internshipPart) return;
      const payload = createPayloadFromChangedProps(
        this.updatableProperties,
        this.$data,
        this.internshipPart,
      );
      const updatedInternship = await updateInternship(this.internshipPart._id, payload);
      if (updatedInternship === null) return;
      this.$emit('updateInternship', this.student?._id, this.internshipIndex, updatedInternship);
      await showSuccessNotification('Änderungen am Praktikum gespeichert');
      (this.$refs.closeButton as HTMLButtonElement).click();
      this.reset();
    },
    reset() {
      this.updatableProperties.forEach((prop) => {
        this.$data[prop] = undefined;
      });
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
      this.reset();
    },
  },
});
</script>
