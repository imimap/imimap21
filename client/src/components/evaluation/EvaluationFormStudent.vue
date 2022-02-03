<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <fieldset class="form-group border p-3">
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
                      <div class="col-3">
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
                      <div class="col-3">
                        <h6 class="list-item-label">Erstellt am</h6>
                        <span class="fw-bold">{{ getDateString(row.createdAt) }}</span>
                      </div>
                      <div class="col-3">
                        <h6 class="list-item-label">Liste letzt Aktualisiert am</h6>
                        <span class="fw-bold">{{ getDateString(row.updatedAt) }}</span>
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
                        <th scope="col"></th>
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
                    <div class="col-sm-1" style="margin-right: 20px !important;">
                      <router-link
                        class="btn btn-success text-white me-3"
                        :to="{ path: `editEvaluation/${row.id}` }">
                        Bearbeiten
                      </router-link>
                    </div>
                    <div class="col-md-10">
                      <button type="button" class="btn btn-danger me-3"
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
    };
  },
  computed: {

  },
  mounted() {
  },

  methods: {
    getDateString,

    ifSureToExit() {
      const userDoubleChecked = window.confirm('Sicher das Fenster schließen?');
      return userDoubleChecked;
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
