<template>
  <div class="container">
    <div class="row justify-content-center">

      <div class="col-lg-4 col-md-6 d-flex">
        <div class="card text-center">
          <div class="card-body d-flex flex-column">
            <p class="card-text">Hier können Sie die Vorlagen der Fragen verwalten</p>
            <router-link
              class="btn btn-success text-white align-self-end mx-auto mt-auto"
              to="questions">
              Vorlagen bearbeiten
            </router-link>
          </div>
        </div>
      </div>

      <div class="col-lg-4 col-md-6 d-flex">
        <div class="card text-center">
          <div class="card-body d-flex flex-column">
            <p class="card-text">
              Hier können Sie eine neue Liste der Fragen zum neuen Semester erstellen
            </p>
            <router-link
              class="btn btn-success text-white align-self-end mx-auto mt-auto" to="evaluations">
              Neue Liste erstellen
            </router-link>
          </div>
        </div>
      </div>

      <div class="col-lg-4 col-md-6 d-flex">
        <div class="card text-center">
          <div class="card-body d-flex flex-column">
            <p class="card-text">
              Hier können Sie die Antworten der Studis auf die Fragen überprüfen.
            </p>
            <router-link
              class="btn btn-success text-white align-self-end mx-auto mt-auto" to="reviews">
              Fragen überprüfen
            </router-link>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getQuestionsList } from '@/utils/gateways';

export default defineComponent({
  name: 'AepDashboard',
  data() {
    return {
      questionsCount: 0,
      loadingQuestionsCount: false,
    };
  },
  mounted() {
    this.getQuestionsCount();
  },
  methods: {
    async getQuestionsCount() {
      this.loadingQuestionsCount = true;
      const questions = await getQuestionsList();
      this.questionsCount = questions.length;
      this.loadingQuestionsCount = false;
    },
  },
});
</script>

<style scoped>
template {
  padding: 20px;
}

.btn-success {
  background: rgba(119, 185, 0, 0.9);
  border-color: rgba(119, 185, 0, 0.9);
}

.btn-success:hover, .btn-success:active, .btn-success:focus {
  background: rgba(119, 185, 0, 1);
  border-color: rgba(119, 185, 0, 1);

}

.table-nav button {
  margin-right: 20px;
}

</style>
