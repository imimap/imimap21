<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <fieldset class="form-group border p-3">
          <div v-if="!isLoading" class="accordion rounded-3" id="listAccordion">
            <div v-if="internshipsAndQuestions.length == 1">
              <h5>
                <span class="alert alert-warning d-flex justify-content-center align-items-center">
                  {{ $t("showEvaluationsToStudent.notice.notFound") }}
                </span>
              </h5>
            </div>
            <div v-else v-for="(row, index) in internshipsAndQuestions" v-bind:key="index"
                 class="accordion-item">
              <h2 class="accordion-header rounded-3"
                  style="border-color: #77b900;border-style: solid;" v-bind:id="index">
                <button class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        v-bind:data-bs-target="'#question-' + row[0]"
                        aria-expanded="false"
                        v-bind:aria-controls="'question-' + row[0]">
                  <div class="container rounded-4">
                    <div class="row">
                      <div class="col-5">
                        <h6 class="list-item-label">Student/in</h6>
                        <span v-if="row[1].internshipOwner == null">
                          In <b>{{ row[1].inSemester }}</b>
                          {{ $t("showEvaluationsToStudent.header.anonymSaid") }}
                        </span>
                        <span v-else>
                          <b>{{ row[1].internshipOwner.firstName }}</b>
                          {{ $t("showEvaluationsToStudent.header.userSaid") }}
                          <b>{{ row[1].inSemester }}</b>
                          {{ $t("showEvaluationsToStudent.header.userSaidEnd") }}
                        </span>
                      </div>
                      <div class="col-8" v-if="row[1].internshipOwner != null">
                        <h6 class="list-item-label">Contact</h6>
                        {{ row[1].internshipOwner.firstName }}
                        {{ $t("showEvaluationsToStudent.header.writeEmail") }}
                        {{ row[1].internshipOwner.emailAddress }}
                      </div>
                    </div>
                  </div>
                </button>
              </h2>
              <div v-bind:id="'question-' + row[0]"
                   class="accordion-collapse collapse"
                   aria-labelledby="headingOne"
                   data-bs-parent="#listAccordion">
                <div class="accordion-body">
                  <table id="tableOfQuestions" class="table table-hover">
                    <tbody>
                    <tr v-for="question in row[1].questions"
                        :key="question.id">
                      <td>
                        {{ question.title }}
                      </td>
                      <td style="display: none">
                        {{ question._id }}
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="d-flex justify-content-center">
            <div class="spinner-border text-htw" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getDateString } from '@/utils/admin';
import Evaluation from '@/models/Evaluation';
import Question from '@/models/Question';
import http from '@/utils/http-common';

export default defineComponent({
  name: 'ShowEvaluationsToStudent',
  data() {
    return {
      evaluations: [] as Evaluation[],
      questions: [] as Question[],
      currentSemester: '-1',
      currentQuestion: '-1',
      currentSearch: '',
      isLoading: false,
      inSemester: '',
      internshipsAndQuestions: [],
      isAnswerReviewed: [],
      isAnswerPublished: [],
    };
  },
  mounted() {
    this.getUsersAndEvaluations();
  },

  methods: {
    getDateString,
    async getUsersAndEvaluations() {
      try {
        const res = await http.get(`/internships/company/${this.$route.params.id}`);
        this.internshipsAndQuestions = res.data;
        console.log(this.internshipsAndQuestions);
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `Konnte keine Information über dieses Praktikum gefunden werden. [ERROR: ${err.message}]`,
          type: 'danger',
        });
      }
      this.isLoading = false;
    },
  },
});
</script>

<style scoped>
template {
  padding: 20px;
}

.table-nav button {
  margin-right: 20px;
}

.accordion-item .accordion-body {
  background: #eee;
}

.accordion-header button {
  color: #000000;
}

.list-item-label {
  font-size: 0.8rem;
  color: #666666;
  text-transform: uppercase;
}

.text-htw {
  color: rgba(119, 185, 0, 1);
  width: 3rem;
  height: 3rem;
}
</style>
