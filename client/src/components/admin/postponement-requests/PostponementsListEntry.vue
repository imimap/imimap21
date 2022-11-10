<template>
  <div class="accordion-item">
    <div class="accordion-header">
      <div class="accordion-button collapsed"
           data-bs-toggle="collapse"
           :data-bs-target="`#${student.studentProfile.studentId}`"
           aria-expanded="false"
           :aria-controls="student.studentProfile.studentId">
        <div class="container">
          <div class="row">
            <div class="col-2">
              <h6 class="list-item-label">Name</h6>
              <span class="fw-bold">{{ studentName }}</span>
            </div>
            <div class="col-2">
              <h6 class="list-item-label">Matrikelnr.</h6>
              {{ postponement.user.studentProfile.studentId }}
            </div>
            <div class="col-3">
              <h6 class="list-item-label">nach Hochschulsemester</h6>
              {{ postponement.newSemesterOfStudy }}
            </div>
            <div class="col-3">
              <h6 class="list-item-label">nach Fachsemester</h6>
              {{ postponement.newSemester }}
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
        <h4>Hochschulsemester</h4>
        <p>Verschiebung auf <b>{{ postponement.newSemesterOfStudy }}.</b> Fachsemester</p>

        <h4>Fachsemester</h4>
        <p>Verschiebung auf <b>{{ postponement.newSemester }}</b></p>

        <h4>Grund</h4>
        <p>{{ postponement.reason }}</p>

        <div class="mt-3">
          <button class="btn btn-success me-3" @click="acceptPostponementRequest">
            Annehmen
          </button>

          <button class="btn btn-danger me-3" @click="rejectPostponementRequest">
            Ablehnen
          </button>

          <button class="btn btn-secondary"
                  data-bs-toggle="modal"
                  data-bs-target="#postponementEditModal"
                  @click="$emit('editPostponement', postponement)"
          >
            Bearbeiten
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// TODO: Implement custom alert box
/* eslint-disable no-alert */
import { defineComponent, PropType } from 'vue';
import { acceptPostponement, rejectPostponement } from '@/utils/gateways';
import { showErrorNotification, showSuccessNotification } from '@/utils/notification';
import Postponement, { PostponementRequester } from '@/models/Postponement';

export default defineComponent({
  name: 'PostponementsListEntry',
  props: {
    postponement: {
      type: Object as PropType<Postponement>,
      required: true,
    },
  },
  emits: ['removePostponement', 'editPostponement'],
  computed: {
    student(): PostponementRequester {
      return this.postponement.user;
    },
    studentName(): string {
      return `${this.student.firstName} ${this.student.lastName}`;
    },
  },
  methods: {
    async acceptPostponementRequest() {
      const userDoubleChecked = window.confirm('Verschiebungsantrag wirklich genehmigen?');
      if (!userDoubleChecked) return;
      const success = await acceptPostponement(this.postponement._id);
      if (!success) {
        await showErrorNotification('Genehmigung fehlgeschlagen.');
        return;
      }
      await showSuccessNotification('Der Antrag wurde genehmigt.');
      this.$emit('removePostponement', this.postponement);
    },
    async rejectPostponementRequest() {
      const userDoubleChecked = window.confirm('Verschiebungsantrag wirklich ablehnen?');
      if (!userDoubleChecked) return;
      const success = await rejectPostponement(this.postponement._id);
      if (!success) {
        await showErrorNotification('Ablehnung fehlgeschlagen.');
        return;
      }
      await showSuccessNotification('Der Antrag wurde abgelehnt.');
      this.$emit('removePostponement', this.postponement);
    },
  },
});
</script>

<style scoped lang="scss">
.btn-success {
  background: rgba(119, 185, 0, 0.9);
  border-color: rgba(119, 185, 0, 0.9);

  &:hover, &:active, &:focus {
    background: rgba(119, 185, 0, 1);
    border-color: rgba(119, 185, 0, 1);
  }
}

.accordion-item .accordion-body {
  background: #eee;
}

.accordion-header {
  color: #000000;
  cursor: pointer;
}

.list-item-label {
  font-size: 0.8rem;
  color: #666666;
  text-transform: uppercase;
}
</style>
