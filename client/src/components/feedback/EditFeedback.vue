<template>
  <div class="container">
    <div id="form">
      <h3>Edit Modus</h3>
      <br>
      <form @submit.prevent="updateFeedback">
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
                 class="form-control" required/>
        </div>
        <br>
        <div class="col-auto">
          <textarea v-model="explanation"
                    class="form-control"
                    id="explanationTextarea"
                    rows="3">
          </textarea>
        </div>
        <br>
        <div class="row">
          <div class="col-sm-1" style="margin-right: 10px !important;">
            <router-link to="../feedbacks">
              <button type="button"
                      class="btn btn-secondary">
                Zurück
              </button>
            </router-link>
          </div>
          <div class="col-sm-1">
            <button class="btn btn-success btn-htw-green" type="submit">
              Aktualisieren
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
import Feedback from '@/models/Feedback';
import store from '@/store';

export default defineComponent({
  name: 'CreateFeedback',
  data() {
    return {
      // New  Props
      id: null,
      title: '',
      explanation: '',
      isFeedbackActive: '',
      updatedAt: '',
      feedback: new Feedback(),
      content: '',
    };
  },
  mounted() {
    this.getFeedback();
  },
  methods: {
    async getFeedback() {
      const res = await http.get(`/feedbacks/${this.$route.params.id}`);
      this.feedback = res.data;
      this.title = this.feedback.title;
      this.explanation = this.feedback.explanation;
      this.isFeedbackActive = this.feedback.isFeedbackActive;
      this.updatedAt = this.feedback.updatedAt;
    },
    async updateFeedback() {
      // eslint-disable-line no-alert
      const userDoubleChecked = window.confirm('Sind Sie mit den Veränderungen sicher?');
      if (userDoubleChecked) {
        try {
          await http.patch(`/feedbacks/${this.$route.params.id}`, {
            title: this.title,
            explanation: this.explanation,
            isFeedbackActive: this.isFeedbackActive.toString(),
            updatedAt: Date.now(),
          });
          await store.dispatch('addNotification', {
            text: 'Feedback erfolgreich aktualisiert!',
            type: 'success',
          }).then(() => this.$router.push({ name: 'FeedbacksList' }));
        } catch (err) {
          await this.$store.dispatch('addNotification', { text: `${err.response.data.error.message}`, type: 'danger' });
        }
      } else {
        console.log('canceled');
      }
      return true;
    },
  },
});
</script>

<style scoped>
</style>
