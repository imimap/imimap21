<template>
  <div class="container">
    <fieldset class="form-group border p-3 rounded-3">
      <table class="table table-hover">
        <tbody>
        <tr>
        </tr>
        <tr>
          <td>
            Die Vorlagen der Fragen verwalten.
          </td>
          <td>
            <router-link
              style="width: 300px; float: right"
              class="btn btn-success text-white align-self-end mx-auto mt-auto"
              to="questions">
              Fragen verwalten
            </router-link>
          </td>
        </tr>
        <tr>
          <td>
            Eine neue Evaluationsliste zum neuen Semester erstellen.
          </td>
          <td>
            <router-link
              style="width: 300px; float: right"
              class="btn btn-success text-white align-self-end mx-auto mt-auto" to="evaluations">
              Evaluationsliste verwalten
            </router-link>
          </td>
        </tr>
        <tr>
          <td>
            Die Antworten der Studis auf die Fragen überprüfen.
          </td>
          <td>
            <router-link
              style="width: 300px; float: right"
              class="btn btn-success text-white align-self-end mx-auto mt-auto" to="reviews">
              Antworten überprüfen
            </router-link>
          </td>
        </tr>
        <tr>
          <td>
            Die Vorlagen der Feedbacks verwalten.
          </td>
          <td>
            <router-link
              style="width: 300px; float: right"
              class="btn btn-success text-white align-self-end mx-auto mt-auto" to="feedbacks">
              Feedbacks verwalten
            </router-link>
          </td>
        </tr>
        <tr>
          <td>
            Die Rückmeldungen von Studierenden als freie Kommentare einsehen.
          </td>
          <td>
            <router-link
              style="width: 300px; float: right"
              class="btn btn-success text-white align-self-end mx-auto mt-auto"
              to="ShowFreeFeedbacksAdmin">
              Feedbacks überprüfen
            </router-link>
          </td>
        </tr>
        </tbody>
      </table>
    </fieldset>
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
