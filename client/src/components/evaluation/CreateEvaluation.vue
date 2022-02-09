<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div>
          <fieldset class="form-group border p-3">
            <h3>Evaluierungsbogen erstellen</h3>
            <br>
            <form id="createEvaluation" @submit.prevent="checkForm">
              <div>
                <select class="form-select" aria-label="showPossibleSemesters"
                        @change="switchSelect($event)">
                  <option selected v-bind:value=null>
                    In welchem Semester muss die Liste veröffentlicht werden?
                  </option>
                  <option v-for="semester in semesters"
                          :key="semester.id" v-bind:value="semester">
                    {{ semester }}
                  </option>
                </select>
              </div>
              <br>
              <div id="tblQue" style="display: none">
                <div v-if="questionsToShow.length == 0">
                  <fieldset class="alert alert-warning form-group border p-3">
                    <h5>
                      <span class="d-flex justify-content-center align-items-center">
                        Wir konnten keine Frage mit dem Status aktiv finden, stellen Sie sicher,
                        dass sie alle gewünschten den aktiven Status haben.
                      </span>
                    </h5>
                  </fieldset>
                  <br>
                </div>
                <fieldset class="form-group border p-3">
                  <div v-if="counterQuestion==0">
                    <h6>Sie haben noch keine Fragen ausgewählt.</h6>
                  </div>
                  <div v-else>
                    <h6>Sie haben {{ counterQuestion }} Fragen ausgewählt.</h6>
                  </div>
                </fieldset>
                <br>
                <fieldset class="form-group border p-3" title="Bitte erst eine Frage auswählen.">
                  <div><input class="form-check-input" type="checkbox"
                              id="checkboxOrder"
                              value="0" v-on:change="enableOrder" disabled>
                    <label for="checkboxOrder">
                      &nbsp;&nbsp; Ich möchte, dass die Fragen in der gewünschten Reihenfolge
                      ab Anfang des Semesters angezeigt werden.</label>
                  </div>
                  <div></div>
                </fieldset>
                <br>
                <fieldset class="form-group border p-3">
                   <table id="tableOfQuestions" class="table table-hover">
                      <thead>
                      <tr>
                        <th class="col-1">
                          Add
                        </th>
                        <th>
                          Reihenfolge
                        </th>
                        <th>
                          Titel der Frage
                        </th>
                        <th class="col-2">
                          Zeit zum Publish
                        </th>
                        <th style="display: none">questionId
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="question in questionsToShow"
                          :key="question.id">
                        <td>
                          <input class="form-check-input" type="checkbox"
                                 value="0" v-on:change="getCountQuestion(); enableButtons();">
                        </td>
                        <td>
                          <input type="number" min="1" max="100" required
                                 title="Bitte doppelte Reihenfolge vermeiden" name="order" disabled>
                        </td>
                        <td>
                          {{ question.title }}
                        </td>
                        <td>
                          <input type="date"
                                 class="form-control"
                                 required disabled/>
                        </td>
                        <td style="display: none">
                          {{ question._id }}
                        </td>
                      </tr>
                      </tbody>
                    </table>
                </fieldset>
              </div>
              <br>
              <div class="row">
                <div class="col-sm-1" style="margin-right: 10px !important;">
                  <router-link to="../admin/evaluations">
                    <button type="button"
                            class="btn btn-secondary">
                      Zurück
                    </button>
                  </router-link>
                </div>
                <div class="col-sm-1" id="btnSave" style="display: none">
                  <button class="btn btn-success btn-htw-green"
                          id="submitButton" type="submit" disabled>
                    Validieren
                  </button>
                  <button class="btn btn-success btn-htw-green"
                          data-bs-toggle="modal"
                          data-bs-target="#showConfirmationModal"
                          id="validate" type="submit" @click="createConfirmation" hidden>
                    Speichern
                  </button>
                </div>
              </div>
            </form>
          </fieldset>
        </div>
      </div>
    </div>
  </div>
  <!--  Confirmation Modal-->
  <div class="modal fade" id="showConfirmationModal"
       tabindex="-1" role="dialog"
       aria-labelledby="showConfirmationModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="showConfirmationModalLabel">
            Bitte überprüfen Sie die Reihenfolge sowie das Datum zu jeder Frage.
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"
                  aria-label="Close">
          </button>
        </div>
        <div class="modal-body" id="body">
<!--          here comes the table created with the method createConfirmation -->
        </div>
        <div class="modal-footer">
          <div class="row">
            <div class="col" style="float: left">
              <input class="form-check-input" type="checkbox"
                     value="0" id="checkboxForPublish" v-model="isPublished">
              <label for="checkboxForPublish">
                &nbsp;&nbsp;Die Liste nach dem Speichern an Studis frei setzen.
              </label>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col">
              <button type="button" class="btn btn-secondary"
                      data-bs-dismiss="modal">Schließen</button>
            </div>
            <div class="col">
              <button type="button"
                      class="btn btn-success"
                      aria-label="close"
                      data-bs-dismiss="modal"
                      @click="createEvaluation"
              >Speichern</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getDateString } from '@/utils/admin';
import http from '@/utils/http-common';
import Question from '@/models/Question';

export default defineComponent({
  name: 'CreateEvaluation',
  data() {
    return {
      // New  Props
      id: null,
      inSemester: '',
      questions: [] as Question[],
      semesters: [],
      questionsToShow: [],
      counterQuestion: 0,
      semesterStart: '',
      semesterEnd: '',
      isPublished: false,
    };
  },
  mounted() {
    this.getPossibleSemesters();
    this.getQuestionsList();
    this.getCountQuestion();
  },
  methods: {
    getDateString,
    enableOrder() {
      const tbl: any = document.getElementById('tableOfQuestions');
      const inputs = tbl.getElementsByTagName('input');
      const checkboxOrder = document.querySelector('input[id="checkboxOrder"]') as HTMLInputElement;

      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < inputs.length; i += 1) {
        if (inputs[i].type === 'checkbox') {
          if (inputs[i].checked) {
            if (checkboxOrder.checked) {
              const row = inputs[i].parentNode.parentNode;
              const order = row.cells[1].children[0];
              const calender = row.cells[3].children[0];
              order.disabled = false;
              calender.disabled = true;
              calender.value = this.semesterStart;
            } else {
              const row = inputs[i].parentNode.parentNode;
              const order = row.cells[1].children[0];
              const calender = row.cells[3].children[0];
              order.disabled = true;
              calender.disabled = false;
              calender.value = '';
              order.value = '';
            }
          } else {
            const row = inputs[i].parentNode.parentNode;
            const order = row.cells[1].children[0];
            const calender = row.cells[3].children[0];
            order.disabled = true;
            calender.disabled = true;
          }
        }
      }
    },
    checkForm() {
      const form = document.getElementById('createEvaluation') as HTMLInputElement;
      if (form!.checkValidity()) {
        const button = form.querySelector('#validate') as HTMLInputElement;
        button!.click();
      }
    },
    enableButtons() {
      // document.getElementById('checkboxOrder') as HTMLInputElement;
      const tbl: any = document.getElementById('tableOfQuestions');
      const inputs = tbl.getElementsByTagName('input');
      const checkboxOrder = document.querySelector('input[id="checkboxOrder"]') as HTMLInputElement;

      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < inputs.length; i += 1) {
        if (inputs[i].type === 'checkbox') {
          if (inputs[i].checked) {
            const row = inputs[i].parentNode.parentNode;
            const calender = row.cells[3].children[0];
            const order = row.cells[1].children[0];
            calender.disabled = false;
            if (checkboxOrder.checked) {
              order.disabled = false;
              calender.disabled = true;
              calender.value = this.semesterStart;
            } else {
              order.disabled = true;
              order.value = '';
              calender.disabled = false;
            }
          } else {
            const row = inputs[i].parentNode.parentNode;
            const order = row.cells[1].children[0];
            const calender = row.cells[3].children[0];
            order.disabled = true;
            calender.disabled = true;
            order.value = '';
            calender.value = '';
          }
        }
      }
      const button = document.getElementById('submitButton') as HTMLButtonElement;
      if (this.counterQuestion === 0) {
        button!.disabled = true;
        if (checkboxOrder) {
          checkboxOrder.checked = false;
        }
        checkboxOrder.disabled = true;
      } else {
        button!.disabled = false;
        checkboxOrder.disabled = false;
      }
    },
    getCountQuestion() {
      const tbl: any = document.getElementById('tableOfQuestions');
      const checkBoxes = tbl.getElementsByTagName('INPUT');
      this.counterQuestion = 0;
      for (let i = 0; i < checkBoxes.length; i += 1) {
        if (checkBoxes[i].checked) {
          this.counterQuestion += 1;
        }
      }
    },
    switchSelect(event) {
      this.inSemester = event.target.value;
      const showOptions = document.getElementById('tblQue');
      const btnSave = document.getElementById('btnSave');
      if (event.target.value === '') {
        showOptions!.style.display = 'none';
        btnSave!.style.display = 'none';
      } else {
        showOptions!.style.display = 'block';
        btnSave!.style.display = 'block';
      }
      let minDate;
      let maxDate;
      if (this.inSemester.includes('WS')) {
        const year = this.inSemester.replace('WS', '');
        let nextYear = parseInt(year, 10);
        nextYear += 1;
        minDate = `${year}-10-01`;
        maxDate = `${nextYear}-03-31`;
      } else {
        const year = this.inSemester.replace('SS', '');
        minDate = `${year}-04-01`;
        maxDate = `${year}-09-30`;
      }
      const calenders = document.getElementsByTagName('input');
      for (let index = 0; index < calenders.length; index += 1) {
        if (calenders[index].type === 'date') {
          calenders[index].setAttribute('min', minDate);
          calenders[index].setAttribute('max', maxDate);
        }
      }
      this.semesterStart = minDate;
      this.semesterEnd = maxDate;
    },
    async getPossibleSemesters() {
      try {
        const result = await http.get('/info/possibleSemesters');
        this.semesters = result.data;
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `${err.response.data.error.message}`,
          type: 'danger',
        });
      }
    },
    async getQuestionsList() {
      try {
        const res = await http.get('/questions', { params: { isQuestionActive: true } });
        this.questionsToShow = res.data;
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `${err.response.data.error.message}`,
          type: 'danger',
        });
      }
    },
    async createConfirmation() {
      // check all elements of the first form and report their state
      const myForm = document.forms[0].reportValidity();
      if (!myForm) return;

      this.questions = [];
      const tbl: any = document.getElementById('tableOfQuestions');
      const inputs = tbl.getElementsByTagName('input');
      const checkboxOrder = document.querySelector('input[id="checkboxOrder"]') as HTMLInputElement;

      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < inputs.length; i += 1) {
        if (inputs[i].type === 'checkbox') {
          if (inputs[i].checked) {
            const row = inputs[i].parentNode.parentNode;
            const res = await http.get(`/questions/${row.cells[4].innerHTML}`);
            let question = new Question();
            question = res.data;
            const order = row.cells[1].children[0];
            const calender = row.cells[3].children[0];
            question.dateToPublishQuestion = calender.value;
            this.questions.splice(order.value - 1, 0, question);
          }
        }
      }
      if (!checkboxOrder.checked) {
        this.questions.sort((questionOne, questionTwo) => new
        Date(questionOne.dateToPublishQuestion).valueOf()
          - new Date(questionTwo.dateToPublishQuestion).valueOf());
      }
      // here creates the table to show in Modal
      // learnt the basics from this tutorial and customized
      // https://www.delftstack.com/de/howto/javascript/create-table-javascript/
      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');

      table.setAttribute('class', 'table table-hover');
      table.appendChild(thead);
      table.appendChild(tbody);

      const getModalBody = document.getElementById('body');
      getModalBody!.innerHTML = '';
      getModalBody!.appendChild(table);
      const rowOne = document.createElement('tr');
      const headingOne = document.createElement('th');
      headingOne.innerHTML = 'Reihenfolge';
      const headingTwo = document.createElement('th');
      headingTwo.innerHTML = 'Titel der Frage';
      const headingThree = document.createElement('th');
      headingThree.innerHTML = 'Zeit zum Publish';

      rowOne.appendChild(headingOne);
      rowOne.appendChild(headingTwo);
      rowOne.appendChild(headingThree);
      thead.appendChild(rowOne);

      for (let i = 0; i < this.questions.length; i += 1) {
        const row = document.createElement('tr');
        const rowDataOne = document.createElement('td');
        rowDataOne.innerHTML = (i + 1).toString();
        const rowDataTwo = document.createElement('td');
        rowDataTwo.innerHTML = this.questions[i].title;
        const rowDataThree = document.createElement('td');
        rowDataThree.innerHTML = this.questions[i].dateToPublishQuestion;

        row.appendChild(rowDataOne);
        row.appendChild(rowDataTwo);
        row.appendChild(rowDataThree);
        tbody.appendChild(row);
      }
      const myModal = document.getElementById('showConfirmationModal');
      const myInput = document.getElementById('myInput');

      // here shows the modal
      myModal!.addEventListener('shown.bs.modal', () => {
        myInput!.focus();
      });
    },
    async createEvaluation() {
      try {
        await http.post('/evaluations', {
          inSemester: this.inSemester,
          questions: this.questions,
          isPublished: this.isPublished,
        });
        await this.$store.dispatch('addNotification', {
          text: 'Evaluation erfolgreich angelegt!',
          type: 'success',
        }).then(() => this.$router.push({ name: 'EvaluationsList' }));
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
