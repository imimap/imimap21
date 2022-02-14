<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <fieldset class="form-group border p-3">
          <div v-if="!isLoading" class="accordion rounded-3" id="listAccordion">
            <div v-if="evaluationFile === undefined || evaluationFile.questions.length === 0">
              <h5>
                <span class="alert alert-warning d-flex justify-content-center align-items-center">
                  {{ $t("evaluationFormStudent.notice.notFound") }}
                </span>
              </h5>
            </div>
            <div v-else>
              <div v-for="(row, index) in evaluationFile.questions" v-bind:key="index"
                   class="accordion-item">
                <!--              <div v-if="compareDates(row.dateToPublishQuestion)">-->
                <h2 class="accordion-header rounded-3"
                    style="border-color: #77b900;border-style: solid;" v-bind:id="index">
                  <button class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          v-bind:data-bs-target="'#question-' + row._id"
                          aria-expanded="false"
                          v-bind:aria-controls="'question-' + row._id">
                    <div class="row container rounded-3">
                      <div class="col-8">
                        <h6 class="list-item-label">
                          {{ $t("evaluationFormStudent.header.title") }}
                        </h6>
                        <span class="fw-bold">{{ row.title }}</span>
                      </div>
                      <div class="col-2">
                        <h6 class="list-item-label">
                          {{ $t("evaluationFormStudent.body.answerReviewed") }}
                        </h6>
                        <div v-if="row.isAnswerReviewed === true">
                          <span class="fw-bold">
                            {{ $t("evaluationFormStudent.body.yes") }}
                          </span>
                        </div>
                        <div v-else-if="row.isAnswerReviewed === false">
                          <span class="fw-bold">
                            {{ $t("evaluationFormStudent.body.no") }}
                          </span>
                        </div>
                      </div>
                      <div class="col-2">
                        <h6 class="list-item-label">
                          {{ $t("evaluationFormStudent.body.publishedOn") }}
                        </h6>
                        <span class="fw-bold">{{ getDateString(row.dateToPublishQuestion) }}</span>
                      </div>
                    </div>
                  </button>
                </h2>
                <div v-bind:id="'question-' + row._id"
                     class="accordion-collapse collapse"
                     aria-labelledby="headingOne"
                     data-bs-parent="#listAccordion">
                  <div class="accordion-body">
                    <div class="row">
                    <span v-html="row.textContent">
                    </span>
                    </div>
                    <br>
                    <div v-if="ifEditPossible(row.answerUpdatedAt)">
                      <div>
                        <editor v-model="content" :model-value="row.answerTextContent"/>
                      </div>
                    </div>
                    <div v-else>
                      <hr>
                      <div>
                        {{ $t("evaluationFormStudent.footer.yourAnswer") }} von
                        {{ getDateString(row.answerUpdatedAt) }}:
                      </div>
                      <br>
                      <div class="row">
                    <span v-html="row.answerTextContent">
                    </span>
                      </div>
                    </div>
                    <br>
                    <div v-if="ifEditPossible(row.answerUpdatedAt)" class="row">
                      <div class="col-sm-1" style="margin-right: 20px !important;">
                        <div class="col-sm-1">
                          <button class="btn btn-success btn-htw-green"
                                  type="submit"
                                  v-on:click="saveMyAnswer
                                  (row._id, row.answerTextContent, row.isAnswerPublished)">
                            {{ $t("evaluationFormStudent.footer.buttonPost") }}
                          </button>
                        </div>
                      </div>
                      <div class="col-md-10">
                        <input class="form-check-input" type="checkbox"
                               id="checkboxForPublish"
                               v-model="row.isAnswerPublished"
                               @change="onCheckboxChange($event)"
                               title="Bitte vergessen Sie nicht, den neuen Zustand zu speichern.">
                        <label>
                          &nbsp; {{ $t("evaluationFormStudent.footer.checkboxPermission") }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <!--              </div>-->
                <!--              <div v-else>-->
                <!--                <h6>-->
                <!--                  Die Frage wird erst ab-->
                <!--                  {{ getDateString(row.dateToPublishQuestion) }}-->
                <!--                  freigeschaltet.-->
                <!--                </h6>-->
                <!--              </div>-->
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
import http from '@/utils/http-common';
import Evaluation from '@/models/Evaluation';
import Editor from '../Editor.vue';

export default defineComponent({
  name: 'evaluationFormStudent',
  data() {
    return {
      startDate: '',
      endDate: '',
      inSemester: '',
      evaluationFile: new Evaluation(),
      isAnswerPublished: false,
      isLoading: false,
      iChanged: '',
      content: '',
    };
  },
  components: {
    Editor,
  },
  mounted() {
    this.getInternship();
  },
  methods: {
    getDateString,
    onCheckboxChange(event) {
      this.isAnswerPublished = event.target.checked;
      if (this.iChanged === 'changed') {
        this.iChanged = '';
      } else {
        this.iChanged = 'changed';
      }
    },
    /**
     *
     * @param answerUpdatedAt
     * this disables the edit button after two hours of posting an answer
     */
    ifEditPossible(answerUpdatedAt) {
      const timeOut = 7200000;
      if (answerUpdatedAt !== undefined) {
        const dateInMS = new Date(answerUpdatedAt).getTime();
        const elapsedTime = new Date().getTime() - dateInMS;
        return (timeOut >= elapsedTime);
      }
      return true;
    },
    compareDates(date) {
      const receivedDate = new Date(date);
      const receivedDateInMs = receivedDate.getTime();
      const getDateNow = Date.now();
      return (receivedDateInMs - getDateNow) <= 0;
    },
    async getInternship() {
      try {
        const res = await http.get(`/internships/${this.$route.params.id}`);
        this.startDate = new Date(res.data.startDate).toISOString().split('T')[0].toString();
        this.endDate = new Date(res.data.endDate).toISOString().split('T')[0].toString();
        this.evaluationFile = res.data.evaluationFile;
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `Konnte kein Praktikum gefunden werden. [ERROR: ${err.message}]`,
          type: 'danger',
        });
      }
      this.isLoading = false;
    },

    async saveMyAnswer(questionId, answerText, isAnswerChecked) {
      if ((this.content === '' || this.content === String('<p></p>')) && this.iChanged === '') {
        await this.$store.dispatch('addNotification', {
          text: 'Bitte erzählen Sie etwas über Ihr Praktikum! Wir sehen keine Veränderungen zu speichern.',
          type: 'danger',
        });
        return;
      }
      // eslint-disable-line no-alert
      const userDoubleChecked = window.confirm('Sind Sie mit Ihrer Antwort sicher? Sie haben noch 2 Stunden Zeit, Ihre Antwort zu bearbeiten, danach ist es nicht mehr möglich.');
      if (userDoubleChecked) {
        try {
          if (this.content === '') {
            console.log(answerText);
            this.content = answerText;
          }
          await http.patch(`/internships/${this.$route.params.id}/answerToUpdate`, null, {
            params: {
              answerTextContent: this.content,
              id: questionId,
              isAnswerPublished: isAnswerChecked,
            },
          });
          await this.$store.dispatch('addNotification', {
            text: 'Ihre Antwort wurde erfolgreich gespeichert!',
            type: 'success',
          }).then(() => window.location.reload());
        } catch (err) {
          await this.$store.dispatch('addNotification', {
            text: `${err.response.data.error.message}`,
            type: 'danger',
          });
        }
      } else {
        console.log('canceled');
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
