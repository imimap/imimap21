<template>
  <div class="card mb-3">
    <div class="card-header">
      {{
        getDateString(internship.startDate) + ' - '
        + getDateString(internship.endDate)
      }}
      <span class="badge rounded-pill bg-secondary float-end">
                    {{ internship.status }}
                  </span>
    </div>
    <div class="card-body">
      <h5 class="card-title">{{ internship.company.companyName }}</h5>
      <h6 class="card-subtitle mb-2 text-muted">
        {{ internship.company.address?.city }},
        {{ internship.company.address?.country }}
      </h6>
      <div class="row">
        <div class="col-lg-4 col-md-12 mb-2">
          <span class="fw-bold list-item-label">Dauer</span><br>
          {{ duration.weeks }} Wochen, {{ duration.days }} Tage
        </div>
        <div class="col-lg-8 col-md-12 mb-2 status-internship-part">
          <span class="fw-bold list-item-label">Status</span>
          <br>
          <ul class="list-group">
            <UsersListStatusItem text="Antrag"
                                 :item="internship.requestPdf"
            />
            <UsersListStatusItem text="ECTS-Nachweis"
                                 :item="internship.lsfEctsProofPdf"
            />
            <UsersListStatusItem text="Ortsnachweis"
                                 :item="internship.locationJustificationPdf"
            />
            <UsersListStatusItem text="Praktikumsvertrag"
                                 :item="internship.contractPdf"
            />
            <UsersListStatusItem text="BVG Ticket Ausnahme"
                                 :item="internship.bvgTicketExemptionPdf"
            />
            <UsersListStatusItem text="Praktikumszeugnis"
                                 :item="internship.certificatePdf"
            />
            <UsersListStatusItem text="Praktikumsbericht"
                                 :item="internship.reportPdf"
            />
          </ul>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <button class="btn btn-success btn-sm me-2"
              @click="approveApplication(internship._id)"
      >
        Antrag genehmigen
      </button>
      <button class="btn btn-success btn-sm me-2"
              @click="markAsComplete(internship._id)"
      >
        Anrechenbar markieren
      </button>
      <button type="button" class="btn btn-secondary btn-sm me-2"
              data-bs-toggle="modal"
              data-bs-target="#internshipPartEditModal"
              @click="$emit('editInternshipPart', index)"
      >
        Details bearbeiten
      </button>
      <button class="btn btn-danger btn-sm me-2"
              @click="deleteInternshipPart(internship._id)"
      >
        Löschen
      </button>
    </div>
  </div>
</template>

<script lang="ts">
// TODO: Implement custom alert box
/* eslint-disable no-alert */
import { defineComponent, PropType } from 'vue';
import { getDateString, getTimeDifferenceDays } from '@/utils/admin';
import Internship from '@/models/Internship';
import UsersListStatusItem from '@/components/admin/users-list/UsersListStatusItem.vue';
import {
  approveInternshipApplication,
  deleteInternship,
  markInternshipAsPassed,
} from '@/utils/gateways';
import { showErrorNotification } from '@/utils/notification';

export default defineComponent({
  name: 'InternshipPart',
  components: {
    UsersListStatusItem,
  },
  props: {
    internship: {
      type: Object as PropType<Internship>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  emits: ['editInternshipPart', 'updateInternship'],
  computed: {
    duration(): { weeks: number; days: number } {
      const durationInDays = getTimeDifferenceDays(this.internship.startDate,
        this.internship.endDate);
      const weeks = Math.floor(durationInDays / 7);
      const days = Math.floor(durationInDays) % 7;
      return { weeks, days };
    },
  },
  methods: {
    getDateString,
    getTimeDifferenceDays,
    async approveApplication(internshipId: string) {
      const userDoubleChecked = window.confirm('Antrag zum Praktikum wirklich genehmigen?');
      if (!userDoubleChecked) return;
      const updatedInternship = await approveInternshipApplication(internshipId);
      if (!updatedInternship) {
        await showErrorNotification('Praktikumsantrag konnte nicht genehmigt werden.');
        return;
      }
      this.$emit('updateInternship', this.index, updatedInternship);
    },
    async markAsComplete(internshipId: string) {
      const userDoubleChecked = window
        .confirm('Teilpraktikum wirklich als anrechenbar markieren?');
      if (!userDoubleChecked) return;
      const updatedInternship = await markInternshipAsPassed(internshipId);
      if (!updatedInternship) {
        await showErrorNotification('Praktikum konnte nicht als anrechenbar markiert werden.');
        return;
      }
      this.$emit('updateInternship', this.index, updatedInternship);
    },
    async deleteInternshipPart(internshipId: string) {
      const userDoubleChecked = window.confirm('Teilpraktikum wirklich löschen?');
      if (!userDoubleChecked) return;
      await deleteInternship(internshipId);
      this.$emit('updateInternship', this.index, null);
    },
  },
});
</script>
