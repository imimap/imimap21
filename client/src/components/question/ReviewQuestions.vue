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
                      :value="index">
                {{ row.inSemester }} --------
                Bisher haben ({{ countOnEachEvaluation[index]}})
                Studis teilgenommen
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
                {{ row.title }} --------
                zu überprüfen ({{tmpCountNotReviewed[index]}}) --------
                zu veröffentlichen ({{tmpCountNotPublished[index]}})
              </option>
            </select>
          </div>
          <div id="errorNoAnswer" style="display: none">
            <hr>
            <h5>
                <span class="alert alert-warning d-flex justify-content-center align-items-center">
                  Es konnte keine Antworten zu dieser Frage gefunden werden.
                </span>
            </h5>
          </div>
          <div id="displayTabs" v-if="!isLoading" style="display: none">
            <hr>
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active"
                        id="allAnswers-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#allAnswers"
                        type="button" role="tab"
                        aria-controls="allAnswers" aria-selected="true">
                  Alle Antworten ({{internshipsAndQuestions.length}})
                </button>
              </li>
              <li class="nav-item" role="presentation" v-show="countNotReviewed !== 0">
                <button class="nav-link" id="notReviewed-tab"
                        data-bs-toggle="tab" data-bs-target="#notReviewed"
                        type="button" role="tab" aria-controls="notReviewed"
                        aria-selected="false">
                  Noch nicht überprüft ({{ countNotReviewed }})
                </button>
              </li>
              <li class="nav-item" role="presentation" v-show="countNotPublished !== 0">
                <button class="nav-link" id="notPublished-tab"
                        data-bs-toggle="tab" data-bs-target="#notPublished"
                        type="button" role="tab" aria-controls="notPublished"
                        aria-selected="false">
                  Noch nicht veröffentlicht ({{ countNotPublished }})
                </button>
              </li>
            </ul>
            <div class="tab-content" id="myTabContent">
              <div class="tab-pane fade show active"
                   id="allAnswers" role="tabpanel" aria-labelledby="allAnswers-tab">
                <div class="accordion rounded-3" id="listAccordion">
                  <div v-for="(row, index) in internshipsAndQuestions" v-bind:key="index"
                       class="accordion-item">
                    <h2 class="accordion-header rounded-3"
                        style="border-color: #77b900;border-style: solid;" v-bind:id="index">
                      <button class="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              v-bind:data-bs-target="'#question-all' + row[0]"
                              aria-expanded="false"
                              v-bind:aria-controls="'question-all' + row[0]">
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
                    <div v-bind:id="'question-all' + row[0]"
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
<!--                            {{ row[1].question.isAnswerReviewed }}-->
                          </label>
                        </div>
                        <div class="col-md-10">
                          <input class="form-check-input" type="checkbox"
                                 :disabled="row[1].question.studentAllowsToPublish === false"
                                 v-bind:id="'published_' + index"
                                 v-model="row[1].question.isAnswerPublished"
                                 v-on:change="saveCheckboxes(row[0], $event)">
                          <label>
                            &nbsp;&nbsp; Die Antwort kann veröffentlicht werden.
<!--                            {{ row[1].question.isAnswerPublished }}-->
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane fade"
                   id="notReviewed" role="tabpanel" aria-labelledby="notReviewed-tab"
                   v-show="countNotReviewed !== 0">
                <div class="accordion rounded-3" id="listAccordionNotReviewed">
                  <div v-for="(row, index) in internshipsAndQuestions" v-bind:key="index"
                       class="accordion-item">
                    <div v-show="row[1].question.isAnswerReviewed !== true &&
                    row[1].question.isAnswerPublished !== true &&
                    countNotReviewed !== 0">
                      <h2 class="accordion-header rounded-3"
                          style="border-color: #77b900;border-style: solid;" v-bind:id="index">
                        <button class="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                v-bind:data-bs-target="'#question-review' + row[0]"
                                aria-expanded="false"
                                v-bind:aria-controls="'question-review' + row[0]">
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
                      <div v-bind:id="'question-review' + row[0]"
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
                </div>
              </div>
              <div class="tab-pane fade"
                   id="notPublished" role="tabpanel" aria-labelledby="notPublished-tab"
                   v-show="countNotPublished !== 0">
                <div class="accordion rounded-3" id="listAccordionNotPublished">
                  <div v-for="(row, index) in internshipsAndQuestions" v-bind:key="index"
                       class="accordion-item">
                    <div id="tabReview"
                         v-show="row[1].question.isAnswerPublished !== true &&
                         row[1].question.isAnswerReviewed === true &&
                         row[1].question.studentAllowsToPublish === true &&
                         countNotPublished !== 0">
                      <h2 class="accordion-header rounded-3"
                          style="border-color: #77b900;border-style: solid;" v-bind:id="index">
                        <button class="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                v-bind:data-bs-target="'#question-publish' + row[0]"
                                aria-expanded="false"
                                v-bind:aria-controls="'question-publish' + row[0]">
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
                      <div v-bind:id="'question-publish' + row[0]"
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
<!--                              {{ row[1].question.isAnswerReviewed }}-->
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
<!--                              {{ row[1].question.isAnswerPublished }}-->
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
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
      answerNotReviewed: [],
      answerNotPublished: [],
      isAnswerReviewed: [],
      isAnswerPublished: [],
      countOnEachEvaluation: [] as any[],
      countNotReviewed: 0,
      countNotPublished: 0,
      tmpCountNotReviewed: [] as number[],
      tmpCountNotPublished: [] as number[],
      notReviewed: 0,
      notPublished: 0,
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
          list.forEach((evaluation, index) => {
            evaluationsList.push({
              id: evaluation[0]._id,
              inSemester: evaluation[0].inSemester,
              questions: evaluation[0].questions,
              isPublished: evaluation[0].isPublished,
              createdAt: evaluation[0].createdAt,
              updatedAt: evaluation[0].updatedAt,
            });
            this.countOnEachEvaluation.splice(index, 0, evaluation[1]);
          });
          this.evaluations = evaluationsList;
          this.isLoading = false;
        }).catch((err) => console.log(err));
    },

    showQuestions() {
      const questionsDropdown = document.getElementById('questionsDropdown');
      const errorNoAnswer = document.getElementById('errorNoAnswer');

      errorNoAnswer!.style.display = 'none';
      if (this.currentSemester !== '-1' && this.countOnEachEvaluation[this.currentSemester] !== 0) {
        this.currentQuestion = '-1';
        this.inSemester = this.evaluations[this.currentSemester].inSemester;
        this.questions = this.evaluations[this.currentSemester].questions;
        questionsDropdown!.style.display = 'block';
        this.countAnswers();
      } else {
        this.currentQuestion = '-1';
        questionsDropdown!.style.display = 'none';
      }
    },

    async countAnswers() {
      this.tmpCountNotPublished = [];
      this.tmpCountNotReviewed = [];
      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < this.evaluations[this.currentSemester].questions.length; i += 1) {
        this.notReviewed = 0;
        this.notPublished = 0;
        try {
          const res = await http.get('/internships/internshipsWithEvaluation', {
            params: {
              semester: this.inSemester,
              questionId: this.evaluations[this.currentSemester].questions[i]._id,
            },
          });
          const tempInternshipsAndQuestions = await res.data;
          for (let j = 0; j < tempInternshipsAndQuestions.length; j += 1) {
            const myTempMap = new Map(Object.entries(tempInternshipsAndQuestions[j][1]));
            if (!(myTempMap.get('question') as Question).isAnswerReviewed) this.notReviewed += 1;
            this.tmpCountNotReviewed.splice(i, 0, this.notReviewed);
            if (!(myTempMap.get('question') as Question).isAnswerPublished
              && (myTempMap.get('question') as Question).isAnswerReviewed
              && (myTempMap.get('question') as Question).studentAllowsToPublish) this.notPublished += 1;
            this.tmpCountNotPublished.splice(i, 0, this.notPublished);
          }
        } catch (err) {
          await this.$store.dispatch('addNotification', {
            text: `${{ errorMessage: err.message }}`,
            type: 'danger',
          });
        }
      }
      /* eslint-enable no-await-in-loop */
    },

    async showAnswersToQuestion() {
      const displayTabs = document.getElementById('displayTabs');
      this.countNotReviewed = 0;
      this.countNotPublished = 0;
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
          for (let i = 0; i < this.internshipsAndQuestions.length; i += 1) {
            const myMap = new Map(Object.entries(this.internshipsAndQuestions[i][1]));
            if (!(myMap.get('question') as Question).isAnswerReviewed) this.countNotReviewed += 1;
            if (!(myMap.get('question') as Question).isAnswerPublished
              && (myMap.get('question') as Question).isAnswerReviewed
              && (myMap.get('question') as Question).studentAllowsToPublish) this.countNotPublished += 1;
          }
          this.isLoading = false;
        } catch (err) {
          await this.$store.dispatch('addNotification', {
            text: `${err.response.data.error.message}`,
            type: 'danger',
          });
        }
        if (this.internshipsAndQuestions.length !== 0) {
          errorNoAnswer!.style.display = 'none';
          displayTabs!.style.display = 'block';
          const allAnswersTab = document.getElementById('allAnswers-tab');
          if (this.countNotReviewed === 0 || this.countNotPublished === 0) {
            allAnswersTab!.click();
          }
        } else {
          errorNoAnswer!.style.display = 'block';
          displayTabs!.style.display = 'none';
        }
      } else {
        errorNoAnswer!.style.display = 'none';
        displayTabs!.style.display = 'none';
      }
    },

    async saveCheckboxes(internshipId, event) {
      const checkboxId = event.target.id;
      let answerReviewed;
      let answerPublished;
      if (checkboxId.includes('reviewed_')) {
        answerReviewed = document.getElementById(checkboxId);
        const rowNumber = checkboxId.replace('reviewed_', '');
        const myMap = new Map(Object.entries(this.internshipsAndQuestions[rowNumber][1]));
        answerPublished = document.getElementById(`published_${rowNumber}`);
        if (answerReviewed.checked) {
          if (this.countNotReviewed !== 0) this.countNotReviewed -= 1;
          if ((myMap.get('question') as Question).studentAllowsToPublish) {
            this.countNotPublished += 1;
          }
        } else {
          this.countNotReviewed += 1;
          if (answerPublished.checked) {
            answerPublished.checked = false;
          }
        }
      } else if (checkboxId.includes('published_')) {
        answerPublished = document.getElementById(checkboxId);
        const rowNumber = checkboxId.replace('published_', '');
        const myMap = new Map(Object.entries(this.internshipsAndQuestions[rowNumber][1]));
        answerReviewed = document.getElementById(`reviewed_${rowNumber}`);
        if (answerPublished.checked) {
          answerReviewed.checked = true;
          if (this.countNotReviewed !== 0) this.countNotReviewed -= 1;
          if (this.countNotPublished !== 0) this.countNotPublished -= 1;
        } else if ((myMap.get('question') as Question).studentAllowsToPublish) {
          this.countNotPublished += 1;
        }
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
        await this.showAnswersToQuestion();
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

.tab-content {
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  padding: 10px;
}

.nav-tabs {
  margin-bottom: 0;
}

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
