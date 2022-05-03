<template>
  <div class="container clear-top">
    <div id="form-block4" v-if="!loadingState">
      <h3>{{ $t("internship.heading.edit") }}</h3>
      <form v-on:submit.prevent>
        <div class="row my-4">
          <div class="col">
            <label for="startDate">
              {{ $t("internship.form.startDate") }}
              <span v-if="startDate">({{ $t("internship.form.currently") }}: {{startDate}})</span>
            </label>
            <input v-model="newStartDate"
                   type="date"
                   id="startDate"
                   class="form-control"
                   :placeholder="startDate"/>
          </div>
          <div class="col">
            <label for="startDate">
              {{ $t("internship.form.endDate") }}
              <span v-if="endDate">({{ $t("internship.form.currently") }}: {{endDate}})</span>
            </label>
            <input v-model="newEndDate"
                   type="date"
                   id="endDate"
                   class="form-control"
                   :placeholder="endDate"/>
          </div>
        </div>

        <div class="row my-4">
          <div class="col">
            <label for="operationalArea">{{ $t('internship.form.operationalArea') }}</label>
            <input v-model="newOperationalArea"
                   type="text"
                   class="form-control"
                   id="operationalArea"
                   :placeholder="operationalArea ?? $t('internship.form.operationalArea')"/>
          </div>
          <div class="col">
            <label for="programmingLanguages">
              {{ $t('internship.form.programmingLanguages') }}
            </label>
            <input v-model="newProgrammingLanguages"
                   type="text"
                   class="form-control"
                   id="programmingLanguages"
                   :placeholder="programmingLanguages ?? $t('internship.form.programmingLanguages')"
            />
          </div>
        </div>

        <div class="row my-4">
          <div class="col">
            <label for="salary">{{ $t('internship.form.salary') }} (in Euro)</label>
            <input v-model="newSalary"
                   type="number"
                   min="0"
                   class="form-control"
                   id="salary"
                   :placeholder="salary ?? $t('internship.form.salary')"/>
          </div>
          <div class="col">
            <label for="paymentType">{{ $t('internship.form.paymentType') }}</label>
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
            <label for="livingCosts">{{ $t('internship.form.livingCosts') }}</label>
            <input v-model="newLivingCosts"
                   type="number"
                   min="0"
                   class="form-control"
                   id="livingCosts"
                   :placeholder="livingCosts ?? $t('internship.form.livingCosts')"/>
          </div>
          <div class="col">
            <label for="workingHoursPerWeek">{{ $t('internship.form.workingHoursPerWeek') }}</label>
            <input v-model="newWorkingHoursPerWeek"
                   min="0"
                   class="form-control"
                   id="workingHoursPerWeek"
                   :placeholder="workingHoursPerWeek ?? $t('internship.form.workingHoursPerWeek')"/>
          </div>
        </div>

        <div class="row my-4">
          <div class="col">
            <div class="mb-3">
              <label for="supervisorFullName">{{ $t('company.supervisor.name') }}</label>
              <input v-model="newSupervisorFullName"
                     type="text"
                     class="form-control"
                     id="supervisorFullName"
                     :placeholder="supervisorFullName ?? $t('company.supervisor.name')"/>
            </div>
            <div>
              <label for="supervisorEmail">{{ $t('company.supervisor.email') }}</label>
              <input v-model="newSupervisorEmail"
                     type="text"
                     class="form-control"
                     id="supervisorEmail"
                     :placeholder="supervisorEmail ?? $t('company.supervisor.email')"/>
            </div>
          </div>
          <div class="col">
            <label for="tasks">{{ $t('internship.form.tasks') }}</label>
            <textarea v-model="newTasks"
                      class="form-control"
                      id="tasks"
                      cols="30"
                      rows="6"
                      :placeholder="tasks ?? $t('internship.form.tasks')"/>
          </div>
        </div>

        <div class="row my-4">
          <div class="col-md-4">
            <button v-on:click="save" class="btn btn-secondary">
              {{ $t("actions.save") }}
            </button>
          </div>
        </div>
        <div class="row mt-3">
          <a href="javascript:history.back()">{{ $t("actions.back") }}</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import http from '@/utils/http-common';
import { capitalizeFirstLetter, convertStringToArray } from '@/utils/stringHelper';
import { showErrorNotification, showSuccessNotification } from '@/utils/notification';

const possibleInternshipFields = [
  'startDate',
  'endDate',
  'operationalArea',
  'salary',
  'payment',
  'livingCosts',
  'workingHoursPerWeek',
  'supervisorFullName',
  'supervisorEmailAddress',
  'tasks',
];

export default defineComponent({
  name: 'EditInternship',
  data() {
    return {
      loadingState: true,
      startDate: null as string | null,
      endDate: null as string | null,
      operationalArea: null,
      programmingLanguages: null,
      salary: null,
      payment: null,
      livingCosts: null,
      workingHoursPerWeek: null,
      supervisorFullName: null,
      supervisorEmail: null,
      tasks: null,

      newStartDate: null,
      newEndDate: null,
      newOperationalArea: null,
      newProgrammingLanguages: null,
      newSalary: null,
      newPayment: null,
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
    normalizedDate(date: string): string {
      const dateWithoutTime = new Date(date).toISOString().split('T')[0].toString();
      return dateWithoutTime;
    },
    updateData(data) {
      this.startDate = this.normalizedDate(data.startDate) ?? this.startDate;
      this.endDate = this.normalizedDate(data.startDate) ?? this.endDate;
      this.operationalArea = data.operationalArea ?? this.operationalArea;
      this.programmingLanguages = data.programmingLanguages.toString().split(',').join(', ') ?? this.programmingLanguages;
      this.salary = data.salary ?? this.salary;
      this.payment = data.paymentTypes ?? this.payment;
      this.livingCosts = data.livingCosts ?? this.livingCosts;
      this.workingHoursPerWeek = data.workingHoursPerWeek ?? this.workingHoursPerWeek;
      this.supervisorFullName = data.supervisor.fullName ?? this.supervisorFullName;
      this.supervisorEmail = data.supervisor.emailAddress ?? this.supervisorEmail;
      this.tasks = data.tasks ?? this.tasks;
    },
    async getInternship() {
      try {
        const res = await http.get(`/internships/${this.$route.params.id}`);
        this.updateData(res.data);
      } catch (err: any) {
        await showErrorNotification(`Fehler beim Abfragen der bisherigen Praktikumsinformationen [ERROR: ${err.message}]`);
      } finally {
        this.loadingState = false;
      }
    },
    getInternshipObject(): { [k: string]: string | string[] } {
      const internshipProps: { [k: string]: string | string[] } = {};

      if (this.newProgrammingLanguages) {
        internshipProps.proprammingLanguages = convertStringToArray(this.newProgrammingLanguages);
      }

      possibleInternshipFields.forEach((prop) => {
        const newProp = `new${capitalizeFirstLetter(prop)}`;
        if (this[newProp]) internshipProps[prop] = this[newProp];
      });

      return internshipProps;
    },
    async save() {
      try {
        const res = await http.patch(`/internships/${this.$route.params.id}`, this.getInternshipObject());
        this.updateData(res.data);
        await showSuccessNotification('Praktikum erfolgreich gespeichert!');
      } catch (err: any) {
        await showErrorNotification(`Fehler beim Speichern des Praktikums [ERROR: ${err.message}]`);
      }
    },
    async getAvailablePaymentTypes() {
      try {
        const res = await http.get('/info/payment-types');
        this.availablePaymentTypes = res.data;
      } catch (err: any) {
        await showErrorNotification(`Fehler beim Laden der verfügbaren Bezahlungsmodelle [ERROR: ${err.message}]`);
      }
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
