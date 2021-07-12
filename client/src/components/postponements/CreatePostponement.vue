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
                <option value="WS2022">WS 21/22</option>
                <option value="SS21">SS 21</option>
                <option value="WS2021">WS 20/21</option></select>
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
import store from '@/store';

export default defineComponent({
  name: 'CreatePostponement',
  data() {
    return {
      newSemester: null,
      newSemesterOfStudy: null,
      reason: '',
    };
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
        await store.dispatch('addNotification', { text: 'Verschiebung erfolgreich beantragt!', type: 'success' });
        await this.$router.push({ name: 'PostponementsIndex' });
      } catch (err) {
        await store.dispatch('addNotification', { text: err.message, type: 'danger' });
      }
    },
  },
});
</script>

<style lang="scss">

</style>
