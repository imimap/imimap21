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
            {{ $t("postponement.actions.edit") }}
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
            {{ $t("postponement.for") }} {{ student?.firstName }} {{ student?.lastName }}
            ({{ student?.studentProfile.studentId }})
          </p>

          <div class="mb-3">
            <label for="newSemesterOfStudy" class="form-label">
              {{ $t("postponement.semester") }}
            </label>
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
            <label for="newSemester" class="form-label">
              {{ $t("postponement.semesterOfStudy") }}
            </label>
            <select v-model="newSemester" class="form-select" id="newSemester">
              <option
                v-for="semester in upcomingSemesters"
                :key="semester"
                :value="semester"
                :selected="semester === postponement?.newSemester"
              >
                {{ semester }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label for="reason" class="form-label">{{ $t("postponement.reason") }}</label>
            <textarea class="form-control"
                      id="reason"
                      aria-describedby="reason"
                      :placeholder="postponement?.reason"
                      v-model="reason"
            ></textarea>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            {{ $t("actions.abort") }}
          </button>
          <button type="button" class="btn btn-success" @click="updatePostponement">
            {{ $t("actions.save") }}
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
import { loadUpcomingSemesters, updatePostponement } from '@/utils/gateways';

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
      upcomingSemesters: [] as string[],
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
      this.updatableProperties.forEach((prop) => {
        this[prop] = this.postponement?.[prop];
      });
    },
  },
  watch: {
    postponement() {
      this.reset();
    },
  },
  async mounted() {
    this.upcomingSemesters = await loadUpcomingSemesters();
  },
});
</script>
