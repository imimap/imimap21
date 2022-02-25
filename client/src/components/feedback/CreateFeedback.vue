<template>
  <div class="container">
    <div id="form">
      <h3>Eine neues Feedback erstellen</h3>
      <br>
      <form @submit.prevent="createFeedback">
        <div class="col-auto">
          <label for="isFeedbackActive" class="form-label">
            Status (Ob Feedback sichtbar werden soll)
          </label>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="isFeedbackActive"
                   v-model="isFeedbackActive">
          </div>
        </div>
        <br>
        <div class="col-auto">
          <label for="title">Titel</label>
          <input v-model="title"
                 type="text"
                 id="title"
                 style="max-width: unset;"
                 class="form-control" required/>
        </div>
        <br>
        <div class="col-auto">
          <div>
            <textarea v-model="explanation"
                      class="form-control"
                      id="explanationTextarea"
                      title="Eine kurze Erklärung oder ein Link zur Website wäre schön.
                      Dieser wird später den Studis gezeigt"
                      rows="3"></textarea>
          </div>
        </div>
        <br>
        <div class="row">
          <div class="col-sm-1" style="margin-right: 10px !important;">
            <router-link to="../admin/feedbacks">
              <button type="button"
                      class="btn btn-secondary">
                Zurück
              </button>
            </router-link>
          </div>
          <div class="col-sm-1">
            <button class="btn btn-success btn-htw-green" type="submit">
              Speichern
            </button>
          </div>
        </div>

      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import http from '@/utils/http-common';

export default defineComponent({
  name: 'CreateFeedback',
  data() {
    return {
      // New  Props
      id: null,
      title: null,
      explanation: null,
      isFeedbackActive: false,
    };
  },
  methods: {
    async createFeedback() {
      console.log('here');
      try {
        await http.post('/feedbacks', {
          title: this.title,
          explanation: this.explanation,
          isFeedbackActive: this.isFeedbackActive,
        });
        await this.$store.dispatch('addNotification', {
          text: 'Feedback erfolgreich angelegt!',
          type: 'success',
        }).then(() => this.$router.push({ name: 'FeedbacksList' }));
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `${err.response.data.error.message}`,
          type: 'danger',
        });
      }
    },
  },
});
</script>

<style scoped>
</style>
