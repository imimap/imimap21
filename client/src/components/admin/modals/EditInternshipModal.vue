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
            {{ $t("userList.editInternshipModal.edit") }}</h5>
          <button type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  ref="closeButton"
                  @click="reset"
          />
        </div>
        <div class="modal-body">
          <p>
            {{ $t("userList.editInternshipModal.for") }} {{ student?.firstName }} {{ student?.lastName }}
            ({{ student?.studentProfile.studentId }})
          </p>

          <div class="mb-3">
            <label for="inSemester" class="form-label">{{ $t("userList.editInternshipModal.semester") }}</label>
            <input type="text"
                   class="form-control"
                   id="inSemester"
                   aria-describedby="inSemester"
                   :placeholder="internship?.inSemester"
                   v-model="inSemester"
            >
          </div>

          <div class="mb-3">
            <label for="inSemesterOfStudy" class="form-label">{{ $t("userList.editInternshipModal.universitySemester") }}</label>
            <input type="number"
                   min="1"
                   class="form-control"
                   id="inSemesterOfStudy"
                   aria-describedby="inSemesterOfStudy"
                   :placeholder="internship?.inSemesterOfStudy"
                   v-model.number="inSemesterOfStudy"
            >
          </div>

          <div class="mb-3">
            <label for="AepPassed" class="form-label">{{ $t("userList.editInternshipModal.aep") }}</label>
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
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="reset">
            {{ $t("userList.editInternshipModal.close") }}
          </button>
          <button type="button"
                  class="btn btn-success"
                  @click="updateInternshipModule"
          >
          {{ $t("userList.editInternshipModal.save") }}
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
import { createPayloadFromChangedProps } from '@/utils/admin';

export default defineComponent({
  name: 'EditInternshipModal',
  props: {
    student: Object as PropType<Student>,
  },
  emits: ['updateStudent'],
  data() {
    const initialProps = {
      inSemester: undefined as string | undefined,
      inSemesterOfStudy: undefined as number | undefined,
      aepPassed: undefined as boolean | undefined,
    };

    const updatableProperties = Object.keys(initialProps);

    return {
      updatableProperties,
      ...initialProps,
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
      const payload = createPayloadFromChangedProps(
        this.updatableProperties,
        this.$data,
        this.internship,
      );
      const updatedInternshipModule = await updateInternshipModule(this.internship._id, payload);
      if (updatedInternshipModule === null) return;
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
