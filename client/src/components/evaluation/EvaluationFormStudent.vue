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
              <div class="accordion" id="accordion">
                <div class="accordion-item">
                  <h2 class="accordion-header rounded-3"
                      style="border-color: #77b900;border-style: solid;" id="headingOne">
                    <button class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseOne"
                            aria-expanded="false"
                            aria-controls="collapseOne">
                      <a><img src="/assets/info_black.png"/></a>
                      &nbsp;&nbsp; {{ $t("evaluationFormStudent.notice.pleaseRead") }}
                    </button>
                  </h2>
                  <div id="collapseOne"
                       class="accordion-collapse collapse"
                       aria-labelledby="headingOne"
                       data-bs-parent="#accordion">
                    <div class="accordion-body">
                      <fieldset class="form-group border p-3 rounded-3">
                        <span v-html="$t('evaluationFormStudent.notice.importantToRead')"/>
                      </fieldset>
                      <fieldset class="form-group border p-3 rounded-3">
                        <span v-html="$t('evaluationFormStudent.notice.agreement')"/>
                        <fieldset class="form-group border p-3 rounded-3">
                          <input class="form-check-input" type="checkbox"
                                 style="margin-left: 15px; margin-top: 25px;"
                                 id="checkboxForPublishProfile"
                                 v-model="internship.showMyProfile"
                                 @change="saveMyAgreement($event)">
                          <label for="checkboxForPublishProfile"
                                 style="position: relative; padding-left: 20px;"
                                 v-html="$t('evaluationFormStudent.notice.checkboxExplanation')">
                          </label>
                        </fieldset>
                      </fieldset>
                    </div>
                  </div>
                </div>
                <div class="accordion-item">
                  <h2 class="accordion-header rounded-3"
                      style="border-color: #77b900;border-style: solid;" id="headingTwo">
                    <button class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseTwo"
                            aria-expanded="false"
                            aria-controls="collapseTwo">
                      <a><img src="/assets/file_download_black.png"/></a>
                      &nbsp;&nbsp; {{ $t("evaluationFormStudent.header.downloadTextFile") }}
                    </button>
                  </h2>
                  <div id="collapseTwo"
                       class="accordion-collapse collapse"
                       aria-labelledby="headingTwo"
                       data-bs-parent="#accordion">
                    <div class="accordion-body">
                      <fieldset class="form-group border p-3 rounded-3">
                        <div class="row justify-content-md-center">
                          <div class="col-auto">
                            <select class="form-select"
                                    id="languageSelection"
                                    style="width: auto">
                              <option selected value="null">
                                {{ $t("evaluationFormStudent.body.dropdownLanguage") }}
                              </option>
                              <option value="de">
                                de
                              </option>
                              <option value="en">
                                en
                              </option>
                            </select>
                          </div>
                          <div class="col-auto">
                            <button type="button"
                                    class="btn btn-primary"
                                    @click="checkDropMenus();">
                              {{ $t("evaluationFormStudent.header.downloadButton") }}
                            </button>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>
              </div>
              <hr>
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
                    <fieldset class="form-group border p-3 rounded-3">
                      <div class="row">
                    <span v-html="row.textContent">
                    </span>
                      </div>
                      <br>
                      <div v-if="!row.isAnswerReviewed">
                        <div>
                          <editor v-model="content" :model-value="row.answerTextContent"/>
                        </div>
                      </div>
                      <div v-else>
                        <hr style="height: 3px;">
                        <div>
                          <strong>
                            {{ $t("evaluationFormStudent.footer.yourAnswer") }} von
                            {{ getDateString(row.answerUpdatedAt) }}:
                          </strong>
                        </div>
                        <br>
                        <div class="row">
                        <span :id="'htmlToText'+ row.id" v-html="row.answerTextContent">
                        </span>
                        </div>
                      </div>
                      <br>
                      <div v-if="!row.isAnswerReviewed"
                           class="row">
                        <div class="col-sm-1" style="margin-right: 20px !important;">
                          <div class="col-sm-1">
                            <button class="btn btn-success btn-htw-green"
                                    type="submit"
                                    v-on:click="saveMyAnswer
                                  (row._id, row.answerTextContent, row.studentAllowsToPublish)">
                              {{ $t("evaluationFormStudent.footer.buttonPost") }}
                            </button>
                          </div>
                        </div>
                        <div class="col-md-10">
                          <input class="form-check-input" type="checkbox"
                                 id="checkboxForPublish"
                                 v-model="row.studentAllowsToPublish"
                                 @change="onCheckboxChange($event)"
                                 title="Bitte vergessen Sie nicht, den neuen Zustand zu speichern.">
                          <label>
                            &nbsp; {{ $t("evaluationFormStudent.footer.checkboxPermission") }}
                          </label>
                        </div>
                      </div>
                    </fieldset>
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
      <div hidden>
        <template-english ref="englishTemplate"></template-english>
      </div>
      <div hidden>
        <template-german ref="germanTemplate"></template-german>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getDateString } from '@/utils/admin';
import http from '@/utils/http-common';
import Evaluation from '@/models/Evaluation';
import Internship from '@/models/Internship';
import Company from '@/models/Company';
import { mapState } from 'vuex';
import TemplateEnglish from '@/components/form/templateEnglish.vue';
import TemplateGerman from '@/components/form/templateGerman.vue';
import Editor from '../Editor.vue';

export default defineComponent({
  name: 'evaluationFormStudent',
  data() {
    return {
      startDate: '',
      endDate: '',
      evaluationFile: new Evaluation(),
      studentAllowsToPublish: true,
      isLoading: false,
      iChanged: '',
      content: '',
      elapsedTime: '',
      internship: new Internship(),
      company: new Company(),
    };
  },
  computed: mapState(['userProfile']),
  components: {
    TemplateEnglish,
    TemplateGerman,
    Editor,
  },
  mounted() {
    this.getInternship();
  },
  methods: {
    getDateString,
    onCheckboxChange(event) {
      this.studentAllowsToPublish = event.target.checked;
      if (this.iChanged === 'changed') {
        this.iChanged = '';
      } else {
        this.iChanged = 'changed';
      }
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
        this.internship = res.data;
        this.evaluationFile = res.data.evaluationFile;
        this.company = res.data.company;
        await this.setValuesToTemplateGerman();
        await this.setValuesToTemplateEnglish();
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `Konnte kein Praktikum gefunden werden. [ERROR: ${err.message}]`,
          type: 'danger',
        });
      }
      this.isLoading = false;
    },
    async saveMyAnswer(questionId, answerText, isAnswerChecked) {
      const sampleText = 'Share your experiences with your fellow students.';
      const sampleTextHTML = '<p>Share your experiences with your fellow students.</p>';

      const sampleTextNoSpace = sampleText.toLowerCase().split(' ').join('');
      const sampleTextHTMLNoSpace = sampleTextHTML.toLowerCase().split(' ').join('');
      const answerTextNoSpace = answerText.toLowerCase().split(' ').join('');
      if ((this.content === '' && answerTextNoSpace === sampleTextNoSpace)
        || (this.content === '' && answerTextNoSpace === sampleTextHTMLNoSpace)
        || this.content.toLowerCase().split(' ').join('') === sampleTextNoSpace
        || this.content.toLowerCase().split(' ').join('') === sampleTextHTMLNoSpace
        || this.content === String('<p></p>') || (this.content === '' && this.iChanged === '')) {
        await this.$store.dispatch('addNotification', {
          text: 'Bitte erzählen Sie etwas über Ihr Praktikum! Wir sehen keine Veränderungen zu speichern.',
          type: 'danger',
        });
        return;
      }
      // eslint-disable-line no-alert
      const userDoubleChecked = window.confirm('Sind Sie mit Ihrer Antwort sicher?');
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
              studentAllowsToPublish: isAnswerChecked,
            },
          });
          await this.$store.dispatch('addNotification', {
            text: 'Ihre Antwort wurde erfolgreich gespeichert!',
            type: 'success',
          }).then(() => {
            this.content = '';
            this.iChanged = '';
            window.location.reload();
          });
        } catch (err) {
          await this.$store.dispatch('addNotification', {
            text: `${err.response.data.error.message}`,
            type: 'danger',
          });
        }
      }
    },
    async saveMyAgreement(iAgree) {
      const myAgreement = document.getElementById(iAgree.target.id) as HTMLInputElement;
      try {
        await http.patch(`/internships/${this.$route.params.id}/agreementToUpdate`, null, {
          params: {
            showMyProfile: myAgreement.checked,
          },
        });
        await this.$store.dispatch('addNotification', {
          text: 'Neuer Status zu Ihrem Einverständnis erfolgreich abgespeichert',
          type: 'success',
        });
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `${err.response.data.error.message}`,
          type: 'danger',
        });
      }
    },
    async checkDropMenus() {
      const selectedLanguage = document.getElementById('languageSelection') as HTMLSelectElement;
      let pageContent = null;
      if (selectedLanguage.value !== 'null') {
        console.log(selectedLanguage.value);
        if (selectedLanguage.value === 'de') {
          pageContent = (this.$refs.germanTemplate as any).$el.parentElement.innerHTML;
        }
        if (selectedLanguage.value === 'en') {
          pageContent = (this.$refs.englishTemplate as any).$el.parentElement.innerHTML;
        }
        this.exportHTML(pageContent, selectedLanguage);
      } else {
        await this.$store.dispatch('addNotification', {
          text: 'Bitte die beide Dropdown Menus überprüfen',
          type: 'danger',
        });
      }
    },
    exportHTML(pageContent, selectedLanguage) {
      const fileDownload = document.createElement('a');
      let header = '';
      let sourceHTML;
      const footer = '</body></html>';

      header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "
        + "xmlns:w='urn:schemas-microsoft-com:office:word' "
        + "xmlns='http://www.w3.org/TR/REC-html40'>"
        + "<head><meta charset='utf-8'></head><body>";
      const hrefToAdd = 'data:application/vnd.ms-word;charset=utf-8';

      sourceHTML = header;
      sourceHTML += pageContent;
      sourceHTML += '<p style="page-break-after: always;">&nbsp;</p>\n';
      this.evaluationFile.questions.forEach((question) => {
        if (question.answerUpdatedAt !== 'undefined') {
          const answerBlock = `<u><b>Title:</b> ${question.title}</u><br><br>${question.answerTextContent}<br><hr>`;
          sourceHTML += answerBlock;
        }
      });
      sourceHTML += footer;
      document.body.appendChild(fileDownload);
      // Tutorial https://phppot.com/javascript/how-to-export-html-to-word-document-with-javascript/
      const source = `${hrefToAdd},${encodeURIComponent(sourceHTML)}`;
      fileDownload.href = source;
      fileDownload.download = `${this.evaluationFile.inSemester}_${this.company.companyName}_${selectedLanguage.value}.doc`;
      fileDownload.click();
      document.body.removeChild(fileDownload);
    },
    async setValuesToTemplateEnglish() {
      (this.$refs.englishTemplate as any).inSemester = this.evaluationFile.inSemester;
      (this.$refs.englishTemplate as any).startDate = this.startDate;
      (this.$refs.englishTemplate as any).endDate = this.endDate;
      (this.$refs.englishTemplate as any).firstName = this.userProfile.firstName;
      (this.$refs.englishTemplate as any).lastName = this.userProfile.lastName;
      (this.$refs.englishTemplate as any).matriculation = this.userProfile.studentProfile.studentId
        .substring(2, this.userProfile.studentProfile.studentId.length);
      (this.$refs.englishTemplate as any).emailStudent = this.userProfile.emailAddress;
      console.log(this.company.companyName);
      (this.$refs.englishTemplate as any).companyName = this.company.companyName;
      (this.$refs.englishTemplate as any).operationalArea = this.internship.operationalArea;
      (this.$refs.englishTemplate as any).address = `${this.company.address.street} ${this.company.address.streetNumber},
      ${this.company.address.zip}, ${this.company.address.city} ${this.company.address.country}`;
      (this.$refs.englishTemplate as any).supervisor = (this.internship.supervisor as any)
        .fullName;
      (this.$refs.englishTemplate as any).emailSupervisor = (this.internship.supervisor as any)
        .emailAddress;
    },
    async setValuesToTemplateGerman() {
      (this.$refs.germanTemplate as any).inSemester = this.evaluationFile.inSemester;
      (this.$refs.germanTemplate as any).startDate = this.startDate;
      (this.$refs.germanTemplate as any).endDate = this.endDate;
      (this.$refs.germanTemplate as any).firstName = this.userProfile.firstName;
      (this.$refs.germanTemplate as any).lastName = this.userProfile.lastName;
      (this.$refs.germanTemplate as any).matriculation = this.userProfile.studentProfile.studentId
        .substring(2, this.userProfile.studentProfile.studentId.length);
      (this.$refs.germanTemplate as any).emailStudent = this.userProfile.emailAddress;
      console.log(this.company.companyName);
      (this.$refs.germanTemplate as any).companyName = this.company.companyName;
      (this.$refs.germanTemplate as any).operationalArea = this.internship.operationalArea;
      (this.$refs.germanTemplate as any).address = `${this.company.address.street} ${this.company.address.streetNumber},
      ${this.company.address.zip}, ${this.company.address.city} ${this.company.address.country}`;
      (this.$refs.germanTemplate as any).supervisor = (this.internship.supervisor as any)
        .fullName;
      (this.$refs.germanTemplate as any).emailSupervisor = (this.internship.supervisor as any)
        .emailAddress;
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
