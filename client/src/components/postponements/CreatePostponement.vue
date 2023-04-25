<template>
  <div id="form-block4" class="text-left">
    <form v-on:submit.prevent>
      <h3>{{ $t("postponement.heading") }}</h3>
      <div class="pl-5">
        <div class="row">&nbsp;</div>
        <div class="row">
          <div class="field">
            {{ $t("postponement.statement") }}
          </div>
        </div>
        <div class="row">&nbsp;</div>
        <div class="row">
          <div class="field">
            {{ $t("postponement.request") }}:
            <select v-model="newSemester" class="required">
              <option
                v-for="semester in nextSemesters"
                v-bind:key="semester"
                :value="semester">
                {{ semester }}
              </option>
            </select>
          </div>
        </div>
        <div class="row">&nbsp;</div>
        <div class="row">
          <div class="form-group max required">
            {{ $t("postponement.info") }}:
            <label class="sr-only" for="postponementSemester">
              {{ $t("postponement.semesterOfStudy") }}
            </label>
            <input
              v-model="newSemesterOfStudy"
              class="form-control"
              type="number"
              min="4"
              id="postponementSemester"/>
          </div>
        </div>
        <div class="row">&nbsp;</div>
        <div class="row">
          <div class="form-group">
            <label for="postponementReason" class="required">
              {{ $t("postponement.reason") }}
            </label>
            <textarea
              v-model="reason"
              cols="50"
              rows="10"
              class="form-control"
              id="postponementReason"/>
          </div>
        </div>
        <div class="row my-4">
          <div class="col-md-4">
            <button
              v-on:click="savePostponement"
              type="submit"
              class="btn btn-secondary">
              {{ $t("actions.send") }}
            </button>
          </div>
        </div>
        <div class="row mt-3">
          <a href="javascript:history.back()">{{ $t("actions.back") }}</a>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { showSuccessNotification } from '@/utils/notification';
import { loadUpcomingSemesters, requestPostponement } from '@/utils/gateways';

export default defineComponent({
  name: 'CreatePostponement',
  data() {
    return {
      newSemester: '' as string,
      newSemesterOfStudy: 5,
      reason: '',
      nextSemesters: [] as string[],
    };
  },
  async created() {
    this.nextSemesters = await loadUpcomingSemesters();
    // eslint-disable-next-line prefer-destructuring
    this.newSemester = this.nextSemesters[0];
  },
  methods: {
    async savePostponement() {
      const success = await requestPostponement(this.newSemester, this.newSemesterOfStudy, this.reason);
      if (!success) return;
      await showSuccessNotification('Verschiebung erfolgreich beantragt!');
      await this.$router.push({ name: 'InternshipModuleIndex' });
    },
  },
});
</script>
