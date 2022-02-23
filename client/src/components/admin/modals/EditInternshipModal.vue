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
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
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
            >
          </div>

          <div class="mb-3">
            <label for="inSemesterOfStudy" class="form-label">Hochschulsemester</label>
            <input type="text"
                   class="form-control"
                   id="inSemesterOfStudy"
                   aria-describedby="inSemesterOfStudy"
                   :placeholder="internship?.inSemesterOfStudy"
            >
          </div>

          <div class="mb-3">
            <label for="AepPassed" class="form-label">AEP bestanden</label>
            <div class="form-check form-switch">
              <input class="form-check-input"
                     type="checkbox"
                     id="AepPassed"
                     :checked="internship?.aepPassed"
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

export default defineComponent({
  name: 'EditInternshipModal',
  props: {
    student: Object as PropType<Student>,
  },
  computed: {
    internship(): InternshipModule | undefined {
      return this.student?.studentProfile.internship;
    },
  },
  methods: {
    updateInternshipModule() {
      // TODO: Implement me
      console.log('implement me');
    },
  },
});
</script>
