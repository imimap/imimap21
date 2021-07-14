<template v-if="!semesterId && !semesterOfStudy">
  <div class="container clear-top">
    <div id="form-block4">
      <h3>Neues Praktikum</h3>
      <form v-on:submit.prevent>
        <div class="row my-4">
          <div class="col">
            <label for="startDate">Startdatum</label>
            <input v-model="startDate" type="date" id="startDate" class="form-control">
          </div>
          <div class="col">
            <label for="startDate">Enddatum</label>
            <input v-model="endDate" type="date" id="endDate" class="form-control">
          </div>
        </div>

        <div class="row my-4">
          <div class="col">
            <label for="operationalArea">Bereich</label>
            <input v-model="operationalArea"
                   type="text"
                   class="form-control"
                   id="operationalArea"
                   placeholder="Bereich"/>
          </div>
          <div class="col">
            <label for="programmingLanguages">Programmiersprachen</label>
            <input v-model="programmingLanguages"
                   type="text"
                   class="form-control"
                   id="programmingLanguages"
                   placeholder="Programmiersprachen"/>
          </div>
        </div>

        <div class="row my-4">
          <div class="col">
            <label for="salary">Gehalt</label>
            <input v-model="salary"
                   type="number"
                   min="0"
                   class="form-control"
                   id="salary"
                   placeholder="Gehalt"/>
          </div>
          <div class="col">
            <label for="payment">Bezahlungsart</label>
            <input v-model="payment"
                   type="text"
                   class="form-control"
                   id="payment"
                   placeholder="Bezahlungsart"/>
          </div>
        </div>

        <div class="row my-4">
          <div class="col">
            <label for="livingCosts">Lebensunterhaltskosten</label>
            <input v-model="livingCosts"
                   type="text"
                   class="form-control"
                   id="livingCosts"
                   placeholder="Lebensunterhaltskosten"/>
          </div>
          <div class="col">
            <label for="workingHoursPerWeek">Arbeitsstunden pro Woche</label>
            <input v-model="workingHoursPerWeek" type="text"
                   class="form-control"
                   id="workingHoursPerWeek"
                   placeholder="Arbeitsstunden pro Woche"/>
          </div>
        </div>

        <div class="row my-4">
          <div class="col">
            <div class="mb-3">
              <label for="company">Firma</label>
              <input v-model="company"
                     type="text"
                     class="form-control"
                     id="company"
                     placeholder="Firma"/>
            </div>
            <div class="mb-3">
              <label for="supervisorFullName">Name der Betreuer*in</label>
              <input v-model="supervisorFullName"
                     type="text"
                     class="form-control"
                     id="supervisorFullName"
                     placeholder="Name des Betreuers"/>
            </div>
            <div>
              <label for="supervisorEmail">Email der Betreuer*in</label>
              <input v-model="supervisorEmail"
                     type="text"
                     class="form-control"
                     id="supervisorEmail"
                     placeholder="Email des Betreuers"/>
            </div>
          </div>
          <div class="col">
            <label for="tasks">Aufgaben</label>
            <textarea v-model="tasks"
                      class="form-control"
                      id="tasks"
                      cols="30"
                      rows="6"/>
          </div>
        </div>

        <div class="row my-4">
          <div class="col-md-4">
            <button v-on:click="save" class="btn btn-secondary">
              Speichern
            </button>
          </div>
        </div>
        <div class="row mt-3">
          <a href="javascript:history.back()">Zurück</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import http from '@/utils/http-common';

// @TODO: Companies abfragen, wenn nicht neue erstellen und ID einfügen
// @TODO: Formularfelder sind optional, Formular macht zum bearbeiten aber dennoch Sinn
export default defineComponent({
  name: 'CreateInternship',
  data() {
    return {
      startDate: null,
      endDate: null,
      operationalArea: null,
      programmingLanguages: null,
      salary: null,
      payment: null,
      livingCosts: null,
      workingHoursPerWeek: null,
      company: null,
      supervisorFullName: null,
      supervisorEmail: null,
      tasks: null,
    };
  },
  methods: {
    async save() {
      try {
        const res = await http.post('/internships', {
          startDate: this.startDate,
          endDate: this.endDate,
          operationalArea: this.operationalArea,
          programmingLanguages: this.convertStringToArray(this.programmingLanguages),
          salary: this.salary,
          payment: this.convertStringToArray(this.payment),
          livingCosts: this.livingCosts,
          workingHoursPerWeek: this.workingHoursPerWeek,
          company: this.company,
          supervisorFullName: this.supervisorFullName,
          supervisorEmail: this.supervisorEmail,
          tasks: this.tasks,
        });
        await this.$store.dispatch('addNotification', { text: 'Praktikum erfolgreich angelegt!', type: 'success' });
        console.log(res);
      } catch (err) {
        console.log(err.message);
      }
    },
    convertStringToArray(string: string | null): string[] | null {
      if (string === null) return string;
      const result: string[] = [];
      string.split(' ').forEach((value) => {
        result.push(value.toString());
      });
      return result;
    },
  },
});
</script>

<style scoped>

</style>
