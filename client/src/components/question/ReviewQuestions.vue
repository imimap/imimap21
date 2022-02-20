<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <fieldset class="form-group border p-3">
          <br>
          <div>
            <select class="form-select"
                    aria-label="Semester"
                    v-model="currentSemester"
                    @change="showQuestions">
              <option value="-1" selected>Ich möchte unter folgende Semester schauen</option>
              <option v-for="(row, index) in evaluations"
                      :key="index"
                      :value="index">{{ row.inSemester }}
              </option>
            </select>
          </div>
          <div id="questionsDropdown" style="display: none">
            <hr>
            <select class="form-select"
                    aria-label="Sortieren nach"
                    v-model="currentQuestion"
                    @change="showAnswersToQuestion">
              <option selected value="-1">Zeig mir die Antworten zur folgende Frage</option>
              <option v-for="(row, index) in questions"
                      :key="index"
                      :value="index">
                {{ row.title }} -- veröffentlicht am: {{ getDateString(row.dateToPublishQuestion) }}
              </option>
            </select>
            <br>
          </div>
          <div id="errorNoAnswer" style="display: none">
            <hr>
            <h5>
                <span class="alert alert-warning d-flex justify-content-center align-items-center">
                  Es konnte keine Antworten zu dieser Frage gefunden werden.
                </span>
            </h5>
          </div>
          <div v-if="!isLoading"
               class="accordion rounded-3"
               id="listAccordion"
               style="display: none">
            <div v-for="(row, index) in internshipsAndQuestions" v-bind:key="index"
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
                      <div class="col-2">
                        <h6 class="list-item-label">Student/in</h6>
                        <span class="fw-bold">
                          {{ row[1].student.lastName }}, {{ row[1].student.firstName }}
                        </span>
                      </div>
                      <div class="col-3">
                        <h6 class="list-item-label">Student/in</h6>
                        <span class="fw-bold">
                          <a :href="`mailto:${ row[1].student.emailAddress }`">
                            {{ row[1].student.emailAddress }}
                          </a>
                        </span>
                      </div>
                      <div class="col-4">
                        <h6 class="list-item-label">Antwort darf veröffentlicht werden</h6>
                        <div v-if="row[1].question.studentAllowsToPublish === true">
                          <span class="fw-bold">Ja</span>
                        </div>
                        <div v-else-if="row[1].question.studentAllowsToPublish === false">
                          <span class="fw-bold">Nein</span>
                        </div>
                      </div>
                      <div class="col-2">
                        <h6 class="list-item-label">Beantwortet am</h6>
                        <span class="fw-bold">
                          {{ getDateString(row[1].question.answerUpdatedAt) }}
                        </span>
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
                  <span v-html="row[1].question.answerTextContent"/>
                  <hr>
                  <div style="margin-right: 20px !important;">
                    <input class="form-check-input" type="checkbox"
                           v-bind:id="'reviewed_' + index"
                           v-model="row[1].question.isAnswerReviewed"
                           v-on:change="saveCheckboxes(row[0], $event)">
                    <label>
                      &nbsp;&nbsp; Die Antwort wurde geprüft.
                      {{ row[1].question.isAnswerReviewed }}
                    </label>
                  </div>
                  <div class="col-md-10">
                    <input class="form-check-input" type="checkbox"
                           :disabled="row[1].question.studentAllowsToPublish===false"
                           v-bind:id="'published_' + index"
                           v-model="row[1].question.isAnswerPublished"
                           v-on:change="saveCheckboxes(row[0], $event)">
                    <label>
                      &nbsp;&nbsp; Die Antwort kann veröffentlicht werden.
                      {{ row[1].question.isAnswerPublished }}
                    </label>
                  </div>
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
import { getEvaluationsList } from '@/utils/gateways';
import { getDateString } from '@/utils/admin';
import Evaluation from '@/models/Evaluation';
import Question from '@/models/Question';
import http from '@/utils/http-common';
import store from '@/store';

export default defineComponent({
  name: 'ReviewQuestions',
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
    this.updateList();
  },

  methods: {
    getDateString,

    updateList() {
      this.isLoading = true;
      getEvaluationsList()
        .then((list) => {
          const evaluationsList = [] as Evaluation[];
          list.forEach((evaluation) => {
            evaluationsList.push({
              id: evaluation._id,
              inSemester: evaluation.inSemester,
              questions: evaluation.questions,
              isPublished: evaluation.isPublished,
              createdAt: evaluation.createdAt,
              updatedAt: evaluation.updatedAt,
            });
          });
          this.evaluations = evaluationsList;
          this.isLoading = false;
        }).catch((err) => console.log(err));
    },

    showQuestions() {
      const questionsDropdown = document.getElementById('questionsDropdown');
      const listAccordion = document.getElementById('listAccordion');
      const errorNoAnswer = document.getElementById('errorNoAnswer');

      listAccordion!.style.display = 'none';
      errorNoAnswer!.style.display = 'none';
      if (this.currentSemester !== '-1') {
        this.currentQuestion = '-1';
        this.inSemester = this.evaluations[this.currentSemester].inSemester;
        this.questions = this.evaluations[this.currentSemester].questions;
        questionsDropdown!.style.display = 'block';
      } else {
        this.currentQuestion = '-1';
        questionsDropdown!.style.display = 'none';
        listAccordion!.style.display = 'none';
      }
    },

    async showAnswersToQuestion() {
      const listAccordion = document.getElementById('listAccordion');
      const errorNoAnswer = document.getElementById('errorNoAnswer');

      if (this.currentQuestion !== '-1') {
        try {
          const res = await http.get('/internships/internshipsWithEvaluation', {
            params: {
              semester: this.inSemester,
              questionId: this.evaluations[this.currentSemester].questions[this.currentQuestion]
                ._id,
            },
          });
          this.internshipsAndQuestions = await res.data;
          console.log(this.internshipsAndQuestions);
          this.isLoading = false;
        } catch (err) {
          await this.$store.dispatch('addNotification', {
            text: `${err.response.data.error.message}`,
            type: 'danger',
          });
        }
        if (this.internshipsAndQuestions.length !== 0) {
          errorNoAnswer!.style.display = 'none';
          listAccordion!.style.display = 'block';
        } else {
          errorNoAnswer!.style.display = 'block';
          listAccordion!.style.display = 'none';
        }
      } else {
        errorNoAnswer!.style.display = 'none';
        listAccordion!.style.display = 'none';
      }
    },

    async saveCheckboxes(internshipId, event) {
      const checkboxId = event.target.id;
      let answerReviewed;
      let answerPublished;
      if (checkboxId.includes('reviewed_')) {
        answerReviewed = document.getElementById(checkboxId);
        const rowNumber = checkboxId.replace('reviewed_', '');
        answerPublished = document.getElementById(`published_${rowNumber}`);
      } else if (checkboxId.includes('published_')) {
        answerPublished = document.getElementById(checkboxId);
        const rowNumber = checkboxId.replace('published_', '');
        answerReviewed = document.getElementById(`reviewed_${rowNumber}`);
      }
      try {
        await http.patch(`/internships/${internshipId}/updateAnswerToPublish`, null, {
          params: {
            questionId: this.questions[this.currentQuestion]._id,
            isAnswerReviewed: answerReviewed.checked,
            isAnswerPublished: answerPublished.checked,
          },
        });
        await store.dispatch('addNotification', {
          text: 'checkbox aktualisiert',
          type: 'success',
        });
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
