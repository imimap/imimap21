<template>
  <div class="container">
    <fieldset class="form-group border p-3">
      <div>
        <select class="form-select"
                aria-label="Semester"
                v-model="currentOption"
                @change="getUsersAndFeedbacks">
          <option value="" selected>
            Wählen Sie eine Option...
          </option>
          <option value="false">
            Feedbacks nicht überprüft
          </option>
          <option value="true">
            Feedbacks schon überprüft
          </option>
          <option value="showAll">
            Feedbacks der gesamte Zeit
          </option>
        </select>
      </div>
      <br>
      <hr>
      <div v-if="!isLoading" class="accordion rounded-3"
           id="listAccordion" style="display: none">
        <div v-if="internshipsAndFreeFeedbacks.length === 0">
          <h5>
            <span class="alert alert-warning d-flex justify-content-center align-items-center">
             Keine Kommentare nach Ihrer Bedingung gefunden!
            </span>
          </h5>
        </div>
        <div v-else>
          <div v-for="(row, index) in internshipsAndFreeFeedbacks" v-bind:key="index"
               class="accordion-item">
            <h2 class="accordion-header rounded-3"
                style="border-color: #77b900;border-style: solid;" v-bind:id="index">
              <button class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      v-bind:data-bs-target="'#freeFeedback-' + row[0]._id"
                      aria-expanded="false"
                      v-bind:aria-controls="'freeFeedback-' + row[0]._id">
                <div class="container rounded-4">
                  <div class="row">
                    <div class="col-3">
                      <h6 class="list-item-label">Student/in</h6>
                      {{ row[1].firstName }} {{ row[1].lastName }}
                    </div>
                    <div class="col-3">
                      <h6 class="list-item-label">Mail</h6>
                      <a :href="`mailto:${ row[1].emailAddress }`">
                        {{ row[1].emailAddress }}
                      </a>
                    </div>
                    <div class="col-3">
                      <h6 class="list-item-label">Start des Praktikums</h6>
                      {{ getDateString(row[0].startDate) }}
                    </div>
                    <div class="col-3">
                      <h6 class="list-item-label">Wurde das feedback geprüft</h6>
                      <div v-if="row[0].isFreetextFeedbackReviewed">
                        Ja
                      </div>
                      <div v-else>
                        Nein
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </h2>
            <div v-bind:id="'freeFeedback-' + row[0]._id"
                 class="accordion-collapse collapse"
                 aria-labelledby="headingOne"
                 data-bs-parent="#listAccordion">
              <div class="accordion-body">
                <span>
                  {{ row[0].freetextFeedback }}
                </span>
                <hr>
                <div style="margin-right: 20px !important;">
                  <input class="form-check-input" type="checkbox"
                         v-bind:id="'reviewed_' + index"
                         v-model="row[0].isFreetextFeedbackReviewed"
                         v-on:change="saveCheckbox(row[0]._id, $event)">
                  <label>
                    &nbsp;&nbsp; Die Antwort wurde geprüft.
                    {{ row[1].isFreetextFeedbackReviewed }}
                  </label>
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getDateString } from '@/utils/admin';
import http from '@/utils/http-common';
import Question from '@/models/Question';
import store from '@/store';

export default defineComponent({
  name: 'ShowFreeFeedbacksAdmin',
  data() {
    return {
      isLoading: false,
      internshipsAndFreeFeedbacks: [],
      currentOption: '',
      filteredArray: [],
    };
  },
  mounted() {
    this.getUsersAndFeedbacks();
  },

  methods: {
    getDateString,
    async getUsersAndFeedbacks() {
      const displayAccordion = document.getElementById('listAccordion');
      if (this.currentOption !== '') {
        try {
          const res = await http.get('/internships/freeFeedbacks', {
            params: {
              isFreetextFeedbackReviewed: this.currentOption,
            },
          });
          this.internshipsAndFreeFeedbacks = res.data;
          console.log(this.internshipsAndFreeFeedbacks);
        } catch (err) {
          await this.$store.dispatch('addNotification', {
            text: `Konnte keine freie Kommentare gefunden werden. [ERROR: ${err.message}]`,
            type: 'danger',
          });
        }
        displayAccordion!.style.display = 'block';
        this.isLoading = false;
      } else {
        displayAccordion!.style.display = 'none';
      }
    },
    async saveCheckbox(internshipId, event) {
      console.log(internshipId);
      const checkboxId = event.target.id;
      const checkbox = document.getElementById(checkboxId) as HTMLInputElement;
      console.log(checkbox.checked);
      try {
        await http.patch(`/internships/${internshipId}/updateFreeFeedback`, null, {
          params: {
            isFreetextFeedbackReviewed: checkbox.checked,
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

</style>
