<template>
  <div class="container">
    <div class="row">
      <div class="col-12">

        <div class="row mb-3">
          <div class="col-lg-3 col-md-12">
            <select class="form-select"
                    aria-label="Sortieren nach"
                    v-model="currentSorting"
                    @change="changeSorting">
              <option selected value="">Sortieren nach...</option>
              <option value="lastName">Nachname</option>
              <option value="studentId">Matrikelnummer</option>
            </select>
          </div>
          <div class="col-lg-3 col-md-12">
            <input type="text"
                   class="form-control"
                   placeholder="Suche..."
                   aria-label="Suche"
                   aria-describedby="suche"
                   v-model="currentSearch">
            <div id="emailHelp" class="form-text">
              Matrikelnummer oder Nachname</div>
          </div>
          <div class="col-lg-3 col-md-12 reset" >
           <button @click="resetResults()">Zurücksetzen</button>
          </div>
        </div>

        <div v-if="!isLoading" class="accordion" id="listAccordion">
          <div v-for="(row, index) in postponementRequestsWithSearch"
               v-bind:key="index"
               class="accordion-item">
            <h2 class="accordion-header" v-bind:id="index">
              <button class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      v-bind:data-bs-target="'#' + row.user.studentId"
                      aria-expanded="false"
                      v-bind:aria-controls="row.user.studentId">
                <div class="container">
                  <div class="row">
                    <div class="col-2">
                      <h6 class="list-item-label">Name</h6>
                      <span class="fw-bold">
                        {{ row.user.firstName + " " + row.user.lastName }}
                      </span>
                    </div>
                    <div class="col-2">
                      <h6 class="list-item-label">Matrikelnr.</h6>
                      <span class="">{{ row.user.studentId }}</span>
                    </div>
                    <div class="col-3">
                      <h6 class="list-item-label">nach Hochschulsemester</h6>
                      <span class="">
                        {{ row.newSemesterOfStudy }}
                      </span>
                    </div>
                    <div class="col-3">
                      <h6 class="list-item-label">nach Fachsemester</h6>
                      <span class="">
                        {{ row.newSemester }}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </h2>
            <div v-bind:id="row.user.studentId"
                 class="accordion-collapse collapse"
                 aria-labelledby="headingOne"
                 data-bs-parent="#listAccordion">
              <div class="accordion-body">
                <h4>Hochschulsemester</h4>
                <p>Verschiebung auf
                  <b>{{ row.newSemesterOfStudy }}.</b>
                  Fachsemester
                </p>

                <h4>Fachsemester</h4>
                <p>Verschiebung auf
                  <b>{{ row.newSemester }}</b>
                </p>

                <h4>Grund</h4>
                <p>{{ row.reason }}</p>

                <div class="mt-3">
                  <button
                    class="btn btn-success me-3"
                    @click="() => acceptPostponementRequest(row.id)">
                    Annehmen
                  </button>

                  <button
                    class="btn btn-danger"
                    @click="() => rejectPostponementRequest(row.id)">
                    Ablehnen
                  </button>
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';
import {
  acceptPostponement, rejectPostponement, getPostponementsList, getUser,
} from '@/utils/gateways';
import Postponement from '@/models/Postponement';
import Student from '@/models/Student';

export default defineComponent({
  name: 'PostponementsList',
  data() {
    return {
      postponementRequests: [] as Postponement[],
      currentSorting: '',
      currentSearch: '',
      isLoading: false,
    };
  },
  computed: {
    postponementRequestsWithSearch(): Postponement[] {
      return this.postponementRequests.filter((postponement) => postponement
        .user.firstName.toLowerCase()
        .includes(this.currentSearch.toLowerCase())
        || postponement.user.lastName.toLowerCase()
          .includes(this.currentSearch.toLowerCase())
        || postponement.user.studentId.toLowerCase()
          .includes(this.currentSearch.toLowerCase()));
    },
  },
  mounted() {
    this.updateList();
  },
  methods: {
    async updateList() {
      this.isLoading = true;
      this.postponementRequests = [] as Postponement[];
      try {
        getPostponementsList().then((list) => {
          list.forEach((postponementRequest) => {
            getUser(postponementRequest.user._id).then((user) => {
              this.postponementRequests.push({
                id: postponementRequest._id,
                newSemester: postponementRequest.newSemester,
                newSemesterOfStudy: postponementRequest.newSemesterOfStudy,
                reason: postponementRequest.reason,
                user: {
                  id: user._id,
                  studentId: user.studentProfile.studentId,
                  firstName: user.firstName,
                  lastName: user.lastName,
                },
              });
              this.isLoading = false;
            });
          });
          this.isLoading = !(list.length === 0);
        });
      } catch (e) {
        console.log(e);
      }
    },
    async resetResults() {
      this.postponementRequests = [];
      this.currentSorting = '';
      this.currentSearch = '';
      this.updateList();
    },
    changeSorting() {
      if (this.currentSorting === 'lastName') {
        this.postponementRequests
          .sort((a, b) => a[this.currentSorting]
            .localeCompare(b[this.currentSorting]));
      } else if (this.currentSorting === 'studentId') {
        this.postponementRequests
          .sort((a, b) => a.user[this.currentSorting]
            .localeCompare(b.user[this.currentSorting]));
      }
    },
    async acceptPostponementRequest(requestId: string) {
      const userDoubleChecked = window.confirm('Verschiebungsantrag wirklich genehmigen?');
      if (userDoubleChecked) {
        const apiResponse = await acceptPostponement(requestId);
        console.log(apiResponse);
        if ('status' in apiResponse && apiResponse.status === 204) {
          this.updateList();
          await store.dispatch('addNotification', {
            text: 'Der Antrag wurde genehmigt.',
            type: 'success',
          });
        } else {
          await store.dispatch('addNotification', {
            text: 'Genehmigung fehlgeschlagen.',
            type: 'danger',
          });
        }
      } else {
        console.log('cancel');
      }
      return true;
    },
    async rejectPostponementRequest(requestId: string) {
      const userDoubleChecked = window.confirm('Verschiebungsantrag wirklich ablehnen?');
      if (userDoubleChecked) {
        const apiResponse = await rejectPostponement(requestId);
        console.log(apiResponse);
        if ('status' in apiResponse && apiResponse.status === 204) {
          this.updateList();
          await store.dispatch('addNotification', {
            text: 'Der Antrag wurde abgelehnt.',
            type: 'success',
          });
        } else {
          await store.dispatch('addNotification', {
            text: 'Ablehnung fehlgeschlagen.',
            type: 'danger',
          });
        }
      } else {
        console.log('cancel');
      }
      return true;
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

  .accordion-item .accordion-body{
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

  .reset {
    margin-top: 0.5em;
  }

  .reset > button {
    background: rgba(119, 185, 0, 1);
    color: white;
    border-style: none;
    border-radius: 3px;
    font-size: 15px;
  }

</style>
