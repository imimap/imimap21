<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <fieldset class="form-group border p-3">
          <div class="row mb-3">
            <div class="col-lg-3 col-md-12">
              <router-link
                class="btn btn-success text-white align-self-end mx-auto mt-auto"
                to="newQuestion">
                Neue Frage
              </router-link>
            </div>
          </div>
          <hr>
          <br>
          <div class="row mb-3">
            <div class="col-lg-3 col-md-12">
              <select class="form-select"
                      aria-label="Sortieren nach"
                      v-model="currentSorting"
                      @change="changeSorting">
                <option selected value="">Sortieren nach...</option>
                <option value="title">Titel</option>
                <option value="isQuestionActive">Ist Aktiv</option>
                <option value="createdAt">Zeit der Erstellung</option>
                <option value="updatedAt">Letzte Aktualisierung</option>
              </select>
            </div>
            <div class="col-lg-3 col-md-12">
              <input type="text"
                     class="form-control"
                     placeholder="Suche..."
                     aria-label="Suche"
                     aria-describedby="suche"
                     v-model="currentSearch">
              <div class="form-text">
                Titel der Frage
              </div>
            </div>
          </div>
          <div v-if="!isLoading" class="accordion rounded-3" id="listAccordion">
            <div v-if="questionsWithSearch.length === 0">
              <hr>
              <h5>
                <span class="alert alert-warning d-flex justify-content-center align-items-center">
                  Es ist die Zeit die erste Frage zu stellen.
                </span>
              </h5>
            </div>
              <div v-for="(row, index) in questionsWithSearch" v-bind:key="index"
                   class="accordion-item">
                <h2 class="accordion-header rounded-3"
                    style="border-color: #77b900;border-style: solid;" v-bind:id="index">
                  <button class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          v-bind:data-bs-target="'#question-' + row.id"
                          aria-expanded="false"
                          v-bind:aria-controls="'question-' + row.id">
                    <div class="container rounded-3">
                      <div class="row">
                        <div class="col-7">
                          <h6 class="list-item-label">Titel der Frage</h6>
                          <span class="fw-bold">{{ row.title }}</span>
                        </div>
                        <div class="col-1">
                          <h6 class="list-item-label">Aktiv</h6>
                          <div v-if="row.isQuestionActive === true">
                            <span class="fw-bold">Ja</span>
                          </div>
                          <div v-else-if="row.isQuestionActive === false">
                            <span class="fw-bold">Nein</span>
                          </div>
                        </div>
                        <div class="col-2">
                          <h6 class="list-item-label">Erstellt am</h6>
                          <span class="fw-bold">{{ getDateString(row.createdAt) }}</span>
                        </div>
                        <div class="col-2">
                          <h6 class="list-item-label">Letzt Aktualisiert am</h6>
                          <span class="fw-bold">{{ getDateString(row.updatedAt) }}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                </h2>
                <div v-bind:id="'question-' + row.id"
                     class="accordion-collapse collapse"
                     aria-labelledby="headingOne"
                     data-bs-parent="#listAccordion">
                  <div class="accordion-body">
                  <span v-html="row.textContent"/>
                    <br>
                    <hr>
                    <div class="row">
                      <div class="col-sm-1" style="margin-right: 20px !important;">
                        <router-link
                          class="btn btn-success text-white me-3"
                          :to="{ path: `editQuestion/${row.id}` }">
                          Bearbeiten
                        </router-link>
                      </div>
                      <div class="col-md-10">
                        <button type="button" class="btn btn-danger me-3"
                                id="deleteButton" @click="deleteQuestion(row.id)">
                          Löschen
                        </button>
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
import { getQuestionsList } from '@/utils/gateways';
import { getDateString } from '@/utils/admin';
import Question from '@/models/Question';
import store from '@/store';
import http from '@/utils/http-common';

export default defineComponent({
  name: 'QuestionsList',
  data() {
    return {
      currentEditQuestionIndex: 0,
      questions: [] as Question[],
      currentSorting: '',
      currentSearch: '',
      isLoading: false,
    };
  },
  computed: {
    questionsWithSearch(): Question[] {
      return this.questions.filter((question) => question
        .title.toLowerCase()
        .includes(this.currentSearch.toLowerCase()));
    },
  },
  mounted() {
    this.updateList();
  },

  methods: {
    getDateString,

    updateList() {
      this.isLoading = true;
      getQuestionsList()
        .then((list) => {
          const questionsList = [] as Question[];
          list.forEach((question) => {
            questionsList.push({
              id: question._id,
              title: question.title,
              textContent: question.textContent,
              isQuestionActive: question.isQuestionActive,
              createdAt: question.createdAt,
              updatedAt: question.updatedAt,
              answerTextContent: '',
              answerUpdatedAt: '',
              dateToPublishQuestion: '',
              isAnswerPublished: '',
              isAnswerReviewed: '',
              studentAllowsToPublish: '',
            });
          });
          this.questions = questionsList;
          this.isLoading = false;
        }).catch((err) => console.log(err));
    },

    async deleteQuestion(questionId: string) {
      const userDoubleChecked = window.confirm('Question wirklich löschen?');
      if (userDoubleChecked) {
        // API call delete
        await http.delete(`/questions/${questionId}`);
        await store.dispatch('addNotification', {
          text: 'Question gelöscht!',
          type: 'success',
        });
        this.updateList();
      } else {
        console.log('cancel');
      }
      return true;
    },

    changeSorting() {
      if (this.currentSorting === 'title') {
        this.questions
          .sort((a, b) => a[this.currentSorting]
            .localeCompare(b[this.currentSorting]));
      } else if (this.currentSorting === 'createdAt' || this.currentSorting === 'updatedAt') {
        this.questions
          .sort((a, b) => a[this.currentSorting]
            .localeCompare(b[this.currentSorting]));
      } else if (this.currentSorting === 'isQuestionActive') {
        this.questions
          .sort((a, b) => (a[this.currentSorting] - b[this.currentSorting]));
      }
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

.accordion-item .accordion-body {
  background: #eee;
}

.accordion-header button {
  color: #000000;
}

.accordion .accordion-body {
  background-color: #FFFFFF;
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
