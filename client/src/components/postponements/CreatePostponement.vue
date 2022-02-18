<template>
    <div id="form-block4" class="text-left">
      <form v-on:submit.prevent>
        <h3>Antrag auf Verschiebung des Praktikums</h3>
        <div class="pl-5">
          <div class="row">&nbsp;</div>
          <div class="row">
            <div class="field">
              Ich möchte mein Praktikum nicht im 4. Fachsemester absolvieren.
            </div>
          </div>
          <div class="row">&nbsp;</div>
          <div class="row">
            <div class="field">
              Ich beantrage eine Verschiebung auf das
              <select v-model="this.newSemester">
                <option
                  v-for="semester in this.nextSemesters"
                  v-bind:key="semester"
                  v-bind:newSemester="semester"
                  :value="semester">
                  {{ semester }}
                </option>
              </select>
            </div>
          </div>
          <div class="row">&nbsp;</div>
          <div class="row">
            Dieses wird mein
            <div class="form-group max" >
              <label class="sr-only" for="postponementSemester">
                Semester of study
              </label>
              <input
                v-model="this.newSemesterOfStudy"
                cols="5"
                class="form-control"
                type="number"
                min="1"
                id="postponementSemester"/>
            </div>
            . Fachsemester sein.
          </div>
          <div class="row">&nbsp;</div>
          <div class="row">
            <div class="form-group">
              <label for="postponementReason">Begründung</label>
              <textarea
                v-model="this.reason"
                cols="50"
                rows="10"
                class="form-control"
                id="postponementReason"/>
            </div>
          </div>
          <div class="row">
            <div class="actions">
              <button
                v-on:click="savePostponement"
                type="submit"
                class="btn btn-secondary my-4">
                Verschiebung beantragen
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import http from '@/utils/http-common';
import { showErrorNotification, showSuccessNotification } from '@/utils/notification';

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
    let res;
    try {
      res = await http.get('/info/semesters/upcoming');
      this.nextSemesters = res.data;
      // eslint-disable-next-line prefer-destructuring
      this.newSemester = res.data[0];
    } catch (err: any) {
      await showErrorNotification(`Fehler beim Anfragen der Namen der folgenden Semester [ERROR: ${err.message}]`);
    }
  },
  methods: {
    async savePostponement() {
      try {
        const { newSemester, newSemesterOfStudy, reason } = this;
        await http.post('/postponement-requests', {
          newSemester,
          newSemesterOfStudy,
          reason,
        });
        await showSuccessNotification('Verschiebung erfolgreich beantragt!');
        await this.$router.push({ name: 'InternshipModuleIndex' });
      } catch (err: any) {
        await showErrorNotification(`Fehler beim Beantragen der Verschiebung [ERROR: ${err.message}]`);
      }
    },
  },
});
</script>
