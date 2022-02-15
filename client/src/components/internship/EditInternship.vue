<template>
  <div class="container clear-top">
    <div id="form-block4" v-if="!loadingState">
      <h3>Praktikum bearbeiten</h3>
      <form v-on:submit.prevent>
        <div class="row my-4">
          <div class="col">
            <label for="startDate">Startdatum (momentan: {{startDate}})</label>
            <input v-model="newStartDate"
                   type="date"
                   id="startDate"
                   class="form-control"
                   :placeholder="startDate"/>
          </div>
          <div class="col">
            <label for="endDate">Enddatum (momentan: {{endDate}})</label>
            <input v-model="newEndDate"
                   type="date"
                   id="endDate"
                   class="form-control"
                   :placeholder="endDate"/>
          </div>
        </div>

        <div class="row my-4">
          <div class="col">
            <label for="operationalArea">Bereich</label>
            <input v-model="newOperationalArea"
                   type="text"
                   class="form-control"
                   id="operationalArea"
                   :placeholder="operationalArea"/>
          </div>
          <div class="col">
            <label for="programmingLanguages">Programmiersprachen</label>
            <input v-model="newProgrammingLanguages"
                   type="text"
                   class="form-control"
                   id="programmingLanguages"
                   :placeholder="programmingLanguages"/>
          </div>
        </div>

        <div class="row my-4">
          <div class="col">
            <label for="salary">Gehalt</label>
            <input v-model="newSalary"
                   type="number"
                   min="0"
                   class="form-control"
                   id="salary"
                   :placeholder="salary"/>
          </div>
          <div class="col">
            <label for="paymentType">Gehaltsmodell</label>
            <div class="form-group d-flex internship-payment-options">
              <div class="form-check internship-payment-option"
                   v-for="(paymentType, index) in availablePaymentTypes"
                   v-bind:key="index"
                   v-bind:paymentType="paymentType"
                   id="paymentType">
                <input class="form-check-input"
                       type="checkbox"
                       :value="paymentType"
                       :id="`checkbox-${paymentType}`"
                       v-model="newPayment"/>
                <label class="form-check-label" :for="`checkbox-${paymentType}`">
                  {{ paymentType }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="row my-4">
          <div class="col">
            <label for="livingCosts">Lebensunterhaltskosten</label>
            <input v-model="newLivingCosts"
                   type="number"
                   min="0"
                   class="form-control"
                   id="livingCosts"
                   :placeholder="livingCosts"/>
          </div>
          <div class="col">
            <label for="workingHoursPerWeek">Arbeitsstunden pro Woche</label>
            <input v-model="newWorkingHoursPerWeek"
                   min="0"
                   class="form-control"
                   id="workingHoursPerWeek"
                   :placeholder="workingHoursPerWeek"/>
          </div>
        </div>

        <div class="row my-4">
          <div class="col">
            <div class="mb-3">
              <label for="supervisorFullName">Name der Betreuer*in</label>
              <input v-model="newSupervisorFullName"
                     type="text"
                     class="form-control"
                     id="supervisorFullName"
                     :placeholder="supervisorFullName"/>
            </div>
            <div>
              <label for="supervisorEmail">Email der Betreuer*in</label>
              <input v-model="newSupervisorEmail"
                     type="text"
                     class="form-control"
                     id="supervisorEmail"
                     :placeholder="supervisorEmail"/>
            </div>
          </div>
          <div class="col">
            <label for="tasks">Aufgaben</label>
            <textarea v-model="newTasks"
                      class="form-control"
                      id="tasks"
                      cols="30"
                      rows="6"
                      :placeholder="tasks"/>
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

export default defineComponent({
  name: 'EditInternship',
  data() {
    return {
      loadingState: true,
      startDate: '',
      endDate: '',
      operationalArea: null,
      programmingLanguages: null,
      salary: null,
      payment: null,
      livingCosts: null,
      workingHoursPerWeek: null,
      supervisorFullName: null,
      supervisorEmail: null,
      tasks: null,

      newStartDate: '',
      newEndDate: '',
      newOperationalArea: null,
      newProgrammingLanguages: null,
      newSalary: null,
      newPayment: [] as string[],
      newLivingCosts: null,
      newWorkingHoursPerWeek: null,
      newSupervisorFullName: null,
      newSupervisorEmail: null,
      newTasks: null,

      availablePaymentTypes: [] as string[],
    };
  },
  async created() {
    await this.getAvailablePaymentTypes();
    await this.getInternship();
  },
  methods: {
    async getInternship() {
      try {
        const res = await http.get(`/internships/${this.$route.params.id}`);
        this.startDate = new Date(res.data.startDate).toISOString().split('T')[0].toString();
        this.endDate = new Date(res.data.endDate).toISOString().split('T')[0].toString();
        this.operationalArea = res.data.operationalArea;
        this.programmingLanguages = res.data.programmingLanguages.toString().split(',').join(', ');
        this.salary = res.data.salary;
        this.payment = res.data.paymentTypes;
        this.livingCosts = res.data.livingCosts;
        this.workingHoursPerWeek = res.data.workingHoursPerWeek;
        this.supervisorFullName = res.data.supervisor.fullName;
        this.supervisorEmail = res.data.supervisor.emailAddress;
        this.tasks = res.data.tasks;
        this.loadingState = false;
      } catch (err: any) {
        console.log(err.message);
      }
    },
    async save() {
      try {
        const res = await http.patch(`/internships/${this.$route.params.id}`, null, {
          params: {
            startDate: this.newStartDate,
            endDate: this.newEndDate,
            operationalArea: this.newOperationalArea,
            programmingLanguages: this.convertStringToArray(this.programmingLanguages),
            salary: this.salary,
            payment: this.newPayment,
            livingCosts: this.newLivingCosts,
            workingHoursPerWeek: this.newWorkingHoursPerWeek,
            supervisorFullName: this.newSupervisorFullName,
            supervisorEmail: this.newSupervisorEmail,
            tasks: this.newTasks,
          },
        });
        this.$data = {
          ...res.data,
        };
        await this.$store.dispatch('addNotification', { text: 'Praktikum erfolgreich gespeichert!', type: 'success' });
      } catch (err: any) {
        await this.$store.dispatch('addNotification', { text: `${err.response.data.error.message}`, type: 'danger' });
      }
    },
    async getAvailablePaymentTypes() {
      try {
        const res = await http.get('/info/payment-types');
        this.availablePaymentTypes = res.data;
      } catch (err: any) {
        await this.$store.dispatch('addNotification', {
          text: `Fehler beim laden der verfügbaren Bezahlungsmodelle [ERROR: ${err.message}]`,
          type: 'danger',
        });
      }
    },
    convertStringToArray(string: string | null): string[] | null {
      if (string === null) return string;
      return string.split(', ').map((subStr) => subStr);
    },
  },
});
</script>

<style scoped>
.internship-payment-options {
  display: flex;
  gap: 1.5rem;
  margin-top: .25rem;
}
</style>
