<template>
  <div class="container">
    <div id="form">
      <h3>Eine neue Frage Vorlage erstellen</h3>
      <br>
      <form @submit.prevent="createQuestion">
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
              <router-link to="../admin/questions">
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
  name: 'CreateQuestion',
  data() {
    return {
      // New  Props
      id: null,
      title: null,
      textContent: null,
      isQuestionActive: false,
    };
  },
  methods: {
    async createQuestion() {
      try {
        await http.post('/questions', {
          title: this.title,
          textContent: this.textContent,
          isQuestionActive: this.isQuestionActive,
        });
        await this.$store.dispatch('addNotification', {
          text: 'Question erfolgreich angelegt!',
          type: 'success',
        }).then(() => this.$router.push({ name: 'QuestionsList' }));
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
