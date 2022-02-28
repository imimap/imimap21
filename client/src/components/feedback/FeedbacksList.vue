<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <fieldset class="form-group border p-3">
          <div class="row mb-3">
            <div class="col-lg-3 col-md-12">
              <router-link
                class="btn btn-success text-white align-self-end mx-auto mt-auto"
                to="newFeedback">
                Neues Feedback
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
                Titel des Feedback
              </div>
            </div>
          </div>
          <div v-if="!isLoading" class="accordion rounded-3" id="listAccordion">
            <div v-if="feedbacksWithSearch.length === 0">
              <hr>
              <h5>
                <span class="alert alert-warning d-flex justify-content-center align-items-center">
                  Es ist die Zeit das erste Feedback Objekt zu erstellen.
                </span>
              </h5>
            </div>
            <div v-else>
              <table id="tableOfFeedbacks" class="table table-hover">
                <thead>
                <tr>
                  <th class="col-4">
                    Titel des Feedback
                  </th>
                  <th class="col-4">
                    Beschreibung
                  </th>
                  <th class="col-auto">
                    Anzahl
                  </th>
                  <th class="col-auto">
                    ist Aktiv
                  </th>
                  <th class="col-auto">
                    Aktion
                  </th>
                  <th style="display: none">feedbackId
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(feedback, index) in feedbacksWithSearch"
                    :key="feedback.id">
                  <td>
                    {{ feedback.title }}
                  </td>
                  <td>
                    {{ feedback.explanation }}
                  </td>
                  <td>
                    {{ countOnEachFeedback[index]}}
                  </td>
                  <td>
                    <input class="form-check-input" type="checkbox"
                           v-model="feedback.isFeedbackActive" disabled>
                  </td>
                  <td>
                    <router-link
                      class="btn btn-success text-white me-3"
                      :to="{ path: `editFeedback/${feedback.id}` }">
                      <a><img src="/assets/feedback/edit.png"
                              style="width: 30px;height: 30px;"/></a>
                    </router-link>
                    <button v-if="countOnEachFeedback[index] === 0"
                            type="button" class="btn btn-danger me-3"
                            id="deleteButton" @click="deleteFeedback(feedback.id)">
                      <a><img src="/assets/feedback/delete.png"
                              style="width: 30px;height: 30px;"/></a>
                    </button>
                  </td>
                  <td style="display: none">
                    {{ feedback._id }}
                  </td>
                </tr>
                </tbody>
              </table>
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
import { getFeedbacksList } from '@/utils/gateways';
import { getDateString } from '@/utils/admin';
import Feedback from '@/models/Feedback';
import store from '@/store';
import http from '@/utils/http-common';

export default defineComponent({
  name: 'FeedbacksList',
  data() {
    return {
      currentEditFeedbackIndex: 0,
      feedbacks: [] as Feedback[],
      currentSorting: '',
      currentSearch: '',
      isLoading: false,
      countOnEachFeedback: [] as any,
    };
  },
  computed: {
    feedbacksWithSearch(): Feedback[] {
      return this.feedbacks.filter((feedback) => feedback
        .title.toLowerCase()
        .includes(this.currentSearch.toLowerCase())
        || feedback.explanation.toLowerCase()
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
      getFeedbacksList()
        .then((list) => {
          const feedbacksList = [] as Feedback[];
          list.forEach((feedback, index) => {
            feedbacksList.push({
              id: feedback[0]._id,
              title: feedback[0].title,
              explanation: feedback[0].explanation,
              isFeedbackActive: feedback[0].isFeedbackActive,
              createdAt: feedback[0].createdAt,
              updatedAt: feedback[0].updatedAt,
            });
            this.countOnEachFeedback.splice(index, 0, feedback[1]);
          });
          this.feedbacks = feedbacksList;
          this.isLoading = false;
        }).catch((err) => console.log(err));
    },

    async deleteFeedback(feedbackId: string) {
      const userDoubleChecked = window.confirm('Feedback wirklich löschen?');
      if (userDoubleChecked) {
        // API call delete
        await http.delete(`/feedbacks/${feedbackId}`);
        await store.dispatch('addNotification', {
          text: 'Feedback gelöscht!',
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
        this.feedbacks
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
