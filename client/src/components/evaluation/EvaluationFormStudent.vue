<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <fieldset class="form-group border p-3">
          <div v-if="!isLoading" class="accordion rounded-3" id="listAccordion">
            <div v-if="evaluationFile.questions.length == 0">
              <hr>
              <h5>
                <span class="alert alert-warning d-flex justify-content-center align-items-center">
                  {{ $t("evaluationFormStudent.notice.notFound") }}
                </span>
              </h5>
            </div>
            <div v-for="(row, index) in evaluationFile.questions" v-bind:key="index"
                 class="accordion-item">
              <h2 class="accordion-header rounded-3"
                  style="border-color: #77b900;border-style: solid;" v-bind:id="index">
                <button class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        v-bind:data-bs-target="'#question-' + row._id"
                        aria-expanded="false"
                        v-bind:aria-controls="'question-' + row._id">
                  <div class="container rounded-3">
                    <div class="row">
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
                        <div v-if="row.isAnswerReviewed == true">
                          <span class="fw-bold">
                            {{ $t("evaluationFormStudent.body.yes") }}
                          </span>
                        </div>
                        <div v-else-if="row.isAnswerReviewed == false">
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
                  </div>
                </button>
              </h2>
              <div v-bind:id="'question-' + row._id"
                   class="accordion-collapse collapse"
                   aria-labelledby="headingOne"
                   data-bs-parent="#listAccordion">
                <div class="accordion-body">
                  <textarea type="text"
                            id="textContent"
                            class="form-control" rows="10"
                            v-model="row.textContent" readonly/>
                  <br>
                  <div class="row">
                    <div class="col-sm-1" style="margin-right: 20px !important;">
                      <router-link
                        class="btn btn-success text-white me-3"
                        :to="{ path: `editQuestion/${row._id}` }">
                        Bearbeiten
                      </router-link>
                    </div>
<!--                    <div class="col-md-10">-->
<!--                      <button type="button" class="btn btn-danger me-3"-->
<!--                              id="deleteButton" @click="deleteQuestion(row.id)">-->
<!--                        Löschen-->
<!--                      </button>-->
<!--                    </div>-->
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
import { getDateString } from '@/utils/admin';
import http from '@/utils/http-common';
import Evaluation from '@/models/Evaluation';

export default defineComponent({
  name: 'evaluationFormStudent',
  data() {
    return {
      startDate: '',
      endDate: '',
      inSemester: '',
      evaluationFile: new Evaluation(),
      isLoading: false,
    };
  },
  mounted() {
    this.getInternship();
  },
  methods: {
    switchLocale(locale: string) {
      this.$i18n.locale = locale;
      this.$router.push({ params: { locale } });
    },
    getDateString,
    // switchLocale(locale: string) {
    //   this.$i18n.locale = locale;
    //   this.$router.push({ params: { locale } });
    // },
    async getInternship() {
      console.log('0');
      try {
        const res = await http.get(`/internships/${this.$route.params.id}`);
        this.startDate = new Date(res.data.startDate).toISOString().split('T')[0].toString();
        this.endDate = new Date(res.data.endDate).toISOString().split('T')[0].toString();
        this.evaluationFile = res.data.evaluationFile;
        console.log(this.evaluationFile.questions);
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `Konnte kein Praktikum gefunden werden. [ERROR: ${err.message}]`,
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
