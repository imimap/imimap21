<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <fieldset class="form-group border p-3">
          <div class="row mb-3">
            <div class="col-lg-3 col-md-12">
              <router-link
                class="btn btn-success text-white align-self-end mx-auto mt-auto"
                to="newEvaluation">
                Neue Vorlage
              </router-link>
            </div>
          </div>
          <hr>
          <br>
          <div class="row mb-3">
            <div class="col-lg-3 col-md-12">
              <input type="text"
                     class="form-control"
                     placeholder="Suche..."
                     aria-label="Suche"
                     aria-describedby="suche"
                     v-model="currentSearch">
              <div class="form-text">
                Titel des Semesters
              </div>
            </div>
          </div>
          <div v-if="!isLoading" class="accordion rounded-3" id="listAccordion">
            <div v-if="evaluationsWithSearch.length == 0">
              <hr>
              <h5>
                <span class="alert alert-warning d-flex justify-content-center align-items-center">
                  Es ist Zeit die erste Evaluationsliste zu erstellen.
                </span>
              </h5>
            </div>
            <div v-for="(row, index) in evaluationsWithSearch" v-bind:key="index"
                 class="accordion-item">
              <h2 class="accordion-header rounded-3"
                  style="border-color: #77b900;border-style: solid;" v-bind:id="index">
                <button class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        v-bind:data-bs-target="'#evaluation-' + row.id"
                        aria-expanded="false"
                        v-bind:aria-controls="'evaluation-' + row.id">
                  <div class="container rounded-3">
                    <div class="row">
                      <div class="col-auto">
                        <h6 class="list-item-label">In Semester</h6>
                        <span class="fw-bold">{{ row.inSemester }}</span>
                      </div>
                      <div class="col-3">
                        <h6 class="list-item-label">Veröffentlicht an Studis</h6>
                        <div v-if="row.isPublished == true">
                          <span class="fw-bold">Ja</span>
                        </div>
                        <div v-else-if="row.isPublished == false">
                          <span class="fw-bold">Nein</span>
                        </div>
                      </div>
                      <div class="col-2">
                        <h6 class="list-item-label">Erstellt am</h6>
                        <span class="fw-bold">{{ getDateString(row.createdAt) }}</span>
                      </div>
                      <div class="col-3">
                        <h6 class="list-item-label">Liste letzt Aktualisiert am</h6>
                        <span class="fw-bold">{{ getDateString(row.updatedAt) }}</span>
                      </div>
                      <div class="col-2">
                        <h6 class="list-item-label">Kopien davon bei Studis erzeugt</h6>
                        <span class="fw-bold">
                          {{ countOnEachEvaluation[index]}}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </h2>
              <div v-bind:id="'evaluation-' + row.id"
                   class="accordion-collapse collapse"
                   aria-labelledby="headingOne"
                   data-bs-parent="#listAccordion">
                <div class="accordion-body">
                  <div class="row">
                    <table class="table table-hover">
                      <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Titel der Frage</th>
                        <th scope="col">Frage letzt Aktualisiert am</th>
                        <th scope="col">Frage wird veröffentlicht am</th>
                      </tr>
                      </thead>
                      <tbody>
                            <tr v-for="(question, index1) in row.questions" v-bind:key="index1">
                              <td>{{ index1+ 1 }}</td>
                              <td>{{question.title}}</td>
                            <td>{{ getDateString(question.updatedAt) }}</td>
                              <td>{{ getDateString(question.dateToPublishQuestion) }}</td>
                            </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="row">
                    <div class="col-md-10">
                      <button v-if="countOnEachEvaluation[index] === 0"
                              type="button" class="btn btn-danger me-3"
                              id="deleteButton" @click="deleteEvaluation(row.id)">
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
import { getEvaluationsList } from '@/utils/gateways';
import { getDateString } from '@/utils/admin';
import Evaluation from '@/models/Evaluation';
import store from '@/store';
import http from '@/utils/http-common';

export default defineComponent({
  name: 'EvaluationsList',
  data() {
    return {
      currentEditEvaluationIndex: 0,
      evaluations: [] as Evaluation[],
      currentSorting: '',
      currentSearch: '',
      isLoading: false,
      countOnEachEvaluation: [] as any,
    };
  },
  computed: {
    evaluationsWithSearch(): Evaluation[] {
      return this.evaluations.filter((evaluation) => evaluation
        .inSemester.toLowerCase()
        .includes(this.currentSearch.toLowerCase())
        || evaluation.updatedAt
          .includes(this.currentSearch.toLowerCase()));
    },
  },
  mounted() {
    this.updateList();
  },

  methods: {
    getDateString,

    ifSureToExit() {
      const userDoubleChecked = window.confirm('Sicher das Fenster schließen?');
      return userDoubleChecked;
    },
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

    async deleteEvaluation(evaluationId: string) {
      const userDoubleChecked = window.confirm('Evaluation wirklich löschen?');
      if (userDoubleChecked) {
        // API call delete
        await http.delete(`/evaluations/${evaluationId}`);
        await store.dispatch('addNotification', {
          text: 'Evaluation gelöscht!',
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
        this.evaluations
          .sort((a, b) => a[this.currentSorting]
            .localeCompare(b[this.currentSorting]));
      } else if (this.currentSorting === 'createdAt' || this.currentSorting === 'updatedAt') {
        this.evaluations
          .sort((a, b) => a[this.currentSorting]
            .localeCompare(b[this.currentSorting]));
      } else if (this.currentSorting === 'isQuestionActive') {
        this.evaluations
          .sort((a, b) => a[this.currentSorting]
            .localeCompare(b[this.currentSorting]));
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
