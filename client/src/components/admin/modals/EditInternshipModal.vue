<template>
  <div class="modal fade"
       id="internshipModuleEditModal"
       tabindex="-1"
       aria-labelledby="internshipModuleEditModalLabel"
       aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="internshipModuleEditModalLabel">
            Praktikumsmodul bearbeiten
          </h5>
          <button type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  ref="closeButton"
          />
        </div>
        <div class="modal-body">
          <p>
            für {{ student?.firstName }} {{ student?.lastName }}
            ({{ student?.studentProfile.studentId }})
          </p>

          <div class="mb-3">
            <label for="inSemester" class="form-label">Fachsemester</label>
            <input type="text"
                   class="form-control"
                   id="inSemester"
                   aria-describedby="inSemester"
                   :placeholder="internship?.inSemester"
                   v-model="inSemester"
            >
          </div>

          <div class="mb-3">
            <label for="inSemesterOfStudy" class="form-label">Hochschulsemester</label>
            <input type="number"
                   min="1"
                   class="form-control"
                   id="inSemesterOfStudy"
                   aria-describedby="inSemesterOfStudy"
                   :placeholder="internship?.inSemesterOfStudy"
                   v-model="inSemesterOfStudy"
            >
          </div>

          <div class="mb-3">
            <label for="AepPassed" class="form-label">AEP bestanden</label>
            <div class="form-check form-switch">
              <input class="form-check-input"
                     type="checkbox"
                     id="AepPassed"
                     :checked="internship?.aepPassed"
                     v-model="aepPassed"
              >
            </div>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Schließen</button>
          <button type="button"
                  class="btn btn-success"
                  @click="updateInternshipModule"
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
import InternshipModule from '@/models/InternshipModule';
import { updateInternshipModule } from '@/utils/gateways';
import { showSuccessNotification } from '@/utils/notification';

export default defineComponent({
  name: 'EditInternshipModal',
  props: {
    student: Object as PropType<Student>,
  },
  emits: ['updateStudent'],
  data() {
    return {
      inSemester: undefined,
      inSemesterOfStudy: undefined,
      aepPassed: undefined,
    };
  },
  computed: {
    internship(): InternshipModule | undefined {
      return this.student?.studentProfile.internship;
    },
  },
  methods: {
    async updateInternshipModule() {
      if (!this.internship) return;
      const payload: { [k: string]: unknown } = {};
      if (this.inSemester !== undefined && this.inSemester !== this.internship.inSemester) {
        payload.inSemester = this.inSemester;
      }
      if (this.inSemesterOfStudy !== undefined
        && this.inSemesterOfStudy !== this.internship.inSemesterOfStudy) {
        payload.inSemesterOfStudy = this.inSemesterOfStudy;
      }
      if (this.aepPassed !== undefined && this.aepPassed !== this.internship.aepPassed) {
        payload.aepPassed = this.aepPassed;
      }
      await updateInternshipModule(this.internship._id, payload);
      this.$emit('updateStudent', this.student?._id);
      await showSuccessNotification('Änderungen am Praktikumsmodul gespeichert');
      (this.$refs.closeButton as HTMLButtonElement).click();
      this.reset();
    },
    reset() {
      this.inSemester = undefined;
      this.inSemesterOfStudy = undefined;
      this.aepPassed = undefined;
    },
  },
  watch: {
    student() {
      this.reset();
    },
  },
});
</script>
