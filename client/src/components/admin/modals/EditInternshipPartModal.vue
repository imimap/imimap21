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
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
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
            />
          </div>

          <div class="mb-3">
            <label for="operationalArea" class="form-label">Tätigkeitsbereich</label>
            <input type="text"
                   class="form-control"
                   id="operationalArea"
                   aria-describedby="operationalArea"
                   :placeholder="internshipPart?.operationalArea"
            />
          </div>

          <div class="mb-3">
            <label for="programmingLanguages" class="form-label">Programmiersprachen</label>
            <input type="text"
                   class="form-control"
                   id="programmingLanguages"
                   aria-describedby="programmingLanguages"
                   :placeholder="internshipPart?.programmingLanguages"
            />
          </div>

          <div class="mb-3">
            <label for="livingCosts" class="form-label">Lebenshaltungskosten</label>
            <input type="number"
                   class="form-control"
                   id="livingCosts"
                   aria-describedby="livingCosts"
                   :placeholder="internshipPart?.livingCosts"
            />
          </div>

          <div class="mb-3">
            <label for="salary" class="form-label">Gehalt</label>
            <input type="number"
                   class="form-control"
                   id="salary"
                   aria-describedby="salary"
                   :placeholder="internshipPart?.salary"
            />
          </div>

          <div class="mb-3">
            <label for="salary" class="form-label">
              Bezahlungsart (Mehrfachauswahl möglich)</label>
            <select class="form-select"
                    multiple
                    aria-label="multiple select example"
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
                   :value="jsDateToHTMLDate(internshipPart?.startDate)"
            />
          </div>

          <div class="mb-3">
            <label for="endDate" class="form-label">Enddatum</label>
            <input type="date"
                   class="form-control"
                   id="endDate"
                   aria-describedby="endDate"
                   :value="jsDateToHTMLDate(internshipPart?.endDate)"
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
            />
          </div>

          <div class="mb-3">
            <label for="supervisorFirstName" class="form-label">Supervisor</label>
            <div class="mb-2 row g-2 align-items-center">
              <div class="col-6">
                <input type="text"
                       class="form-control"
                       id="supervisorFirstName"
                       aria-describedby="supervisorFirstName"
                       :placeholder="supervisorFirstName"
                />
              </div>

              <div class="col-6">
                <input type="text"
                       class="form-control"
                       id="supervisorLastName"
                       aria-describedby="supervisorLastName"
                       :placeholder="supervisorLastName"
                />
              </div>

              <div class="col-12">
                <input type="text"
                       class="form-control"
                       id="supervisorEmail"
                       aria-describedby="supervisorEmail"
                       :placeholder="internshipPart?.supervisor.emailAddress"
                />
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label for="comment" class="form-label">Kommentar</label>
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
import { jsDateToHTMLDate } from '@/utils/admin';
import { loadPaymentTypes } from '@/utils/gateways';

export default defineComponent({
  name: 'EditInternshipPartModal',
  props: {
    student: Object as PropType<Student>,
    internshipIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      availablePaymentTypes: [] as string[],
    };
  },
  async mounted() {
    this.availablePaymentTypes = await loadPaymentTypes();
  },
  computed: {
    internshipPart(): Internship | undefined {
      return this.student?.studentProfile.internship.internships[this.internshipIndex];
    },
    supervisorFirstName(): string {
      if (!this.internshipPart?.supervisor.fullName) return '';
      const nameParts = this.internshipPart.supervisor.fullName.split(' ');
      return nameParts.slice(0, nameParts.length - 1).join(' ');
    },
    supervisorLastName(): string {
      if (!this.internshipPart?.supervisor.fullName) return '';
      const nameParts = this.internshipPart.supervisor.fullName.split(' ');
      return nameParts[nameParts.length - 1];
    },
  },
  methods: {
    jsDateToHTMLDate,
    updateInternshipPart() {
      // TODO: Implement me
      console.log('implement me');
    },
    isSelectedPaymentType(paymentType: string): boolean {
      if (!this.internshipPart || this.internshipPart?.paymentTypes.length === 0) {
        return false;
      }
      return this.internshipPart.paymentTypes.indexOf(paymentType) !== -1;
    },
  },
});
</script>
