<template>
  <div class="modal fade"
       id="postponementEditModal"
       tabindex="-1"
       aria-labelledby="postponementEditModalLabel"
       aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="postponementEditModalLabel">
            Verschiebungsantrag bearbeiten
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
            <label for="newSemesterOfStudy" class="form-label">Hochschulsemester</label>
            <input type="number"
                   min="1"
                   class="form-control"
                   id="newSemesterOfStudy"
                   aria-describedby="newSemesterOfStudy"
                   :placeholder="postponement?.newSemesterOfStudy"
                   v-model.number="newSemesterOfStudy"
            >
          </div>

          <div class="mb-3">
            <label for="newSemester" class="form-label">Fachsemester</label>
            <input type="text"
                   class="form-control"
                   id="newSemester"
                   aria-describedby="newSemester"
                   :placeholder="postponement?.newSemester"
                   v-model="newSemester"
            >
          </div>

          <div class="mb-3">
            <label for="reason" class="form-label">Grund</label>
            <textarea class="form-control"
                      id="reason"
                      aria-describedby="reason"
                      :placeholder="postponement?.reason"
                      v-model="reason"
            ></textarea>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Schließen</button>
          <button type="button" class="btn btn-success" @click="updatePostponement">
            Speichern
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Postponement, { PostponementRequester } from '@/models/Postponement';
import { createPayloadFromChangedProps } from '@/utils/admin';
import { showSuccessNotification } from '@/utils/notification';
import { updatePostponement } from '@/utils/gateways';

export default defineComponent({
  name: 'EditPostponementModal',
  props: {
    postponement: Object as PropType<Postponement>,
  },
  emits: ['updatePostponement'],
  computed: {
    student(): PostponementRequester | undefined {
      return this.postponement?.user;
    },
  },
  data() {
    const initialProps = {
      newSemesterOfStudy: undefined as number | undefined,
      newSemester: undefined as string | undefined,
      reason: undefined as boolean | undefined,
    };

    const updatableProperties = Object.keys(initialProps);

    return {
      updatableProperties,
      ...initialProps,
    };
  },
  methods: {
    async updatePostponement() {
      if (!this.postponement) return;
      const payload = createPayloadFromChangedProps(
        this.updatableProperties,
        this.$data,
        this.postponement,
      );
      const updatedPostponement = await updatePostponement(this.postponement._id, payload);
      if (updatedPostponement === null) return;
      this.$emit('updatePostponement', updatedPostponement);
      await showSuccessNotification('Änderungen am Verschiebungsantrag gespeichert');
      (this.$refs.closeButton as HTMLButtonElement).click();
      this.reset();
    },
    reset() {
      this.newSemesterOfStudy = undefined;
      this.newSemester = undefined;
      this.reason = undefined;
    },
  },
  watch: {
    postponement() {
      this.reset();
    },
  },
});
</script>
