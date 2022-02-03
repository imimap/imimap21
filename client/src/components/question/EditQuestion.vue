<template>
  <div class="container">
    <div id="form">
      <h3>Edit Modus</h3>
      <br>
      <form>
        <div class="col-auto">
          <label for="isQuestionActive" class="form-label">Status</label>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="isQuestionActive"
                   v-model="isQuestionActive">
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
          <label for="textContent">Textinhalt</label>
          <textarea v-model="textContent"
                    type="text"
                    id="textContent"
                    class="form-control" rows="5" required/>
        </div>
        <br>
        <div class="row">
          <div class="col-sm-1" style="margin-right: 10px !important;">
            <router-link to="../questions">
              <button type="button"
                      class="btn btn-secondary">
                Zurück
              </button>
            </router-link>
          </div>
          <div class="col-sm-1">
            <button v-on:click.stop.prevent="updateQuestion"
                    class="btn btn-success btn-htw-green">
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
import Question from '@/models/Question';
import store from '@/store';

export default defineComponent({
  name: 'CreateQuestion',
  data() {
    return {
      // New  Props
      id: null,
      title: '',
      textContent: '',
      isQuestionActive: '',
      updatedAt: '',
      question: new Question(),
    };
  },
  mounted() {
    this.getQuestion();
  },
  methods: {
    ifSureToExit() {
      const userDoubleChecked = window.confirm('Sicher das Fenster schließen?');
      return userDoubleChecked;
    },
    async getQuestion() {
      const res = await http.get(`/questions/${this.$route.params.id}`);
      this.question = res.data;
      this.title = this.question.title;
      this.textContent = this.question.textContent;
      this.isQuestionActive = this.question.isQuestionActive;
      this.updatedAt = this.question.updatedAt;
    },
    async updateQuestion() {
      const userDoubleChecked = window.confirm('Sind Sie mit den Veränderungen sicher?');
      if (userDoubleChecked) {
        try {
          await http.patch(`/questions/${this.$route.params.id}`, {
            title: this.title,
            textContent: this.textContent,
            isQuestionActive: this.isQuestionActive.toString(),
            updatedAt: Date.now(),
          });
          await store.dispatch('addNotification', {
            text: 'Frage erfolgreich aktualisiert!',
            type: 'success',
          }).then(() => this.$router.push({ name: 'QuestionsList' }));
        } catch (err) {
          await this.$store.dispatch('addNotification', { text: `${err.response.data.error.message}`, type: 'danger' });
        }
      } else {
        console.log('cancel');
      }
      return true;
    },
  },
});
</script>

<style scoped>
</style>
