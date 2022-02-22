<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <fieldset class="form-group border p-3">
          <div v-if="!isLoading" class="accordion rounded-3" id="listAccordion">
            <div v-if="internshipsAndQuestions.length === 0">
              <h5>
                <span class="alert alert-warning d-flex justify-content-center align-items-center">
                  {{ $t("showEvaluationsToStudent.notice.notFound") }}
                </span>
              </h5>
            </div>
            <div v-else>
              <div class="accordion" id="accordionInformation">
                <div class="accordion-item">
                  <h2 class="accordion-header rounded-3" id="headingOne"
                      style="border-color: #77b900;border-style: solid;">
                    <button class="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseOne"
                            aria-expanded="true"
                            aria-controls="collapseOne">
                      <a><img src="/assets/info_black.png"/></a>
                      &nbsp;&nbsp; {{ $t("showEvaluationsToStudent.notice.pleaseRead") }}
                    </button>
                  </h2>
                  <div id="collapseOne"
                       class="accordion-collapse collapse show"
                       aria-labelledby="headingOne"
                       data-bs-parent="#accordionInformation">
                    <div class="accordion-body">
                      <span v-html="$t('showEvaluationsToStudent.notice.goodToRead')"/>
                    </div>
                  </div>
                </div>
              </div>
              <hr>
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
                        <div class="col-5">
                          <h6 class="list-item-label">Student/in</h6>
                          <span v-if="row[1].internshipOwner == null">
                          In <b>{{ row[1].inSemester }}</b>
                          {{ $t("showEvaluationsToStudent.header.anonymSaid") }}
                        </span>
                          <span v-else>
                          <b>{{ row[1].internshipOwner.firstName }}</b>
                          {{ $t("showEvaluationsToStudent.header.userSaid") }}
                          <b>{{ row[1].inSemester }}</b>
                          {{ $t("showEvaluationsToStudent.header.userSaidEnd") }}
                        </span>
                        </div>
                        <div class="col-4" v-if="row[1].internshipOwner != null">
                          <h6 class="list-item-label">
                            {{ $t("showEvaluationsToStudent.header.writeEmail") }}
                            {{ row[1].internshipOwner.firstName }}
                          </h6>
                          <a :href="`mailto:${ row[1].internshipOwner.emailAddress }`">
                            {{ row[1].internshipOwner.emailAddress }}
                          </a>
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
                    <table id="tableOfQuestions" class="table table-hover">
                      <tbody>
                      <tr v-for="(question, qIndex) in row[1].questions" v-bind:key="qIndex"
                          @click="sendIdToModal(qIndex, question)"
                          data-bs-toggle="modal"
                          data-id="qIndex"
                          data-bs-target="#evaluationModal" title="Click"
                          style="cursor: pointer;">
                        <td>
                          <u>
                            {{ question.title }}
                          </u>
                        </td>
                      </tr>
                      </tbody>
                    </table>
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
<!--  Here comes the modal to show question and answer to student,
student has only to click on the desired QA on the table-->
  <div class="modal fade" id="evaluationModal"
       tabindex="-1" role="dialog"
       aria-labelledby="showEvaluationModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-notify modal-success">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="showEvaluationModalLabel">
            {{ title }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"
                  aria-label="Close">
          </button>
        </div>
        <div class="modal-body" id="body">
          <fieldset class="form-group border p-4">
            <legend class="float-none w-auto px-3">Q</legend>
            <span v-html="textContent"/>
          </fieldset>
          <br>
          <fieldset class="form-group border p-4">
            <legend class="float-none w-auto px-3">A</legend>
            <span v-html="answerTextContent"/>
          </fieldset>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getDateString } from '@/utils/admin';
import http from '@/utils/http-common';

export default defineComponent({
  name: 'ShowEvaluationsToStudent',
  data() {
    return {
      isLoading: false,
      internshipsAndQuestions: [],
      currentId: -1,
      title: '',
      textContent: '',
      answerTextContent: '',
    };
  },
  mounted() {
    this.getUsersAndEvaluations();
  },

  methods: {
    getDateString,
    sendIdToModal(givenQuestionId, question) {
      this.title = question.title;
      this.textContent = question.textContent;
      this.answerTextContent = question.answerTextContent;
    },
    async getUsersAndEvaluations() {
      try {
        const res = await http.get(`/internships/company/${this.$route.params.id}`);
        this.internshipsAndQuestions = res.data;
        console.log(this.internshipsAndQuestions);
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `Konnte keine Information über dieses Praktikum gefunden werden. [ERROR: ${err.message}]`,
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

.table-nav button {
  margin-right: 20px;
}

.accordion-item .accordion-body {
  background: #fff;
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

.modal-header{
  background-color: rgba(119, 185, 0, 1);
}
.modal-content {
  overflow:hidden;
}
</style>
