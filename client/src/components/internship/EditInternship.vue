<!-- eslint-disable max-len -->
<template>
  <div class="container clear-top">
    <div id="form-block4" v-if="!loadingState">
      <h3>{{ $t("internship.heading.edit") }}</h3>
      <form v-on:submit.prevent>
        <div class="row my-4">
          <div class="col">
            <label for="startDate">
              {{ $t("internship.form.startDate") }}
            </label>
            <input v-model="startDate"
                   type="date"
                   id="startDate"
                   class="form-control"
                  />
          </div>
          <div class="col">
            <label for="endDate">
              {{ $t("internship.form.endDate") }}
            </label>
            <input v-model="endDate"
                   type="date"
                   id="endDate"
                   class="form-control"
                   />
          </div>
        </div>

        <div class="row my-4">
          <div class="col">
            <label for="operationalArea">{{ $t('internship.form.operationalArea') }}</label>
            <input v-model="internship.operationalArea"
                   type="text"
                   class="form-control"
                   id="operationalArea"
                   :placeholder="internship.operationalArea ?? $t('internship.form.operationalArea')"/>
          </div>
          <div class="col">
            <label for="programmingLanguages">
              {{ $t('internship.form.programmingLanguages') }}
            </label>
            <input v-model="internship.programmingLanguages"
                   type="text"
                   class="form-control"
                   id="programmingLanguages"
                   :placeholder="internship.programmingLanguages?.toString().split(',').join(', ') ?? $t('internship.form.programmingLanguages')"
            />
          </div>
        </div>

        <div class="row my-4">
          <div class="col">
            <label for="salary">{{ $t('internship.form.salary') }} (in Euro)</label>
            <input v-model="internship.salary"
                   type="number"
                   min="0"
                   class="form-control"
                   id="salary"
                   :placeholder="internship.salary?.toString() ?? $t('internship.form.salary')"/>
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
                       v-model="internship.paymentTypes"/>
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
            <input v-model="internship.livingCosts"
                   type="number"
                   min="0"
                   class="form-control"
                   id="livingCosts"
                   :placeholder="internship.livingCosts?.toString() ?? $t('internship.form.livingCosts')"/>
          </div>
          <div class="col">
            <label for="workingHoursPerWeek">{{ $t('internship.form.workingHoursPerWeek') }}</label>
            <input v-model="internship.workingHoursPerWeek"
                   min="0"
                   class="form-control"
                   id="workingHoursPerWeek"
                   :placeholder="internship.workingHoursPerWeek?.toString() ?? $t('internship.form.workingHoursPerWeek')"/>
          </div>
        </div>

        <div class="row my-4">
          <div class="col">
            <div class="mb-3">
              <label for="supervisorFullName">{{ $t('company.supervisor.name') }}</label>
              <input v-model="supervisor.fullName"
                     type="text"
                     class="form-control"
                     id="supervisorFullName"
                     :placeholder="supervisor.fullName ?? $t('company.supervisor.name')"/>
            </div>
            <div>
              <label for="supervisorEmail">{{ $t('company.supervisor.email') }}</label>
              <input v-model="supervisor.emailAddress "
                     type="text"
                     class="form-control"
                     id="supervisorEmail"
                     :placeholder="supervisor.emailAddress ?? $t('company.supervisor.email')"/>
            </div>
          </div>
          <div class="col">
            <label for="tasks">{{ $t('internship.form.tasks') }}</label>
            <textarea v-model="internship.tasks"
                      class="form-control"
                      id="tasks"
                      cols="30"
                      rows="6"
                      :placeholder="internship.tasks ?? $t('internship.form.tasks')"/>
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
import { showErrorNotification, showSuccessNotification } from '@/utils/notification';
import Internship from '@/models/Internship';

export default defineComponent({
  name: 'EditInternship',
  data() {
    return {
      internship: {} as Internship,
      loadingState: true,
      startDate: null as string | null,
      endDate: null as string | null,
      availablePaymentTypes: [] as string[],
      supervisor: {
        fullName: undefined as string | undefined,
        emailAddress: undefined as string | undefined,
      },
    };
  },
  async created() {
    await this.getAvailablePaymentTypes();
    await this.getInternship();
  },
  methods: {
    normalizedDate(date: string | null): string | null {
      if (!date) return null;
      const dateWithoutTime = new Date(date).toISOString().split('T')[0].toString();
      return dateWithoutTime;
    },
    async getInternship() {
      try {
        const res = await http.get(`/internships/${this.$route.params.id}`);
        this.internship = res.data;
        this.startDate = this.normalizedDate(this.internship.startDate);
        this.endDate = this.normalizedDate(this.internship.endDate);
        if (this.internship.supervisor) {
          this.supervisor.fullName = this.internship.supervisor.fullName;
          this.supervisor.emailAddress = this.internship.supervisor.emailAddress;
        }
      } catch (err: any) {
        await showErrorNotification(`Fehler beim Abfragen der bisherigen Praktikumsinformationen [ERROR: ${err.message}]`);
      } finally {
        this.loadingState = false;
      }
    },
    async save() {
      try {
        // this.internship.startDate = this.normalizedDate(this.startDate)
        // ?? this.internship.startDate;
        // this.internship.endDate = this.normalizedDate(this.endDate)
        // ?? this.internship?.endDate;
        // this.internship.supervisor.fullName = this.supervisor.fullName
        // ?? this.internship.supervisor?.fullName;
        // this.internship.supervisor.emailAddress = this.supervisor.emailAddress
        // ?? this.internship.supervisor?.emailAddress;

        await http.patch(`/internships/${this.$route.params.id}`, this.internship);
        await showSuccessNotification('Praktikum erfolgreich gespeichert!');
      } catch (err: any) {
        await showErrorNotification(`Fehler beim Speichern
        des Praktikums [ERROR: ${err.response.data.error.message}`);
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

::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #C8CFD5;
  opacity: 1; /* Firefox */
}

:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: #C8CFD5;
}

::-ms-input-placeholder { /* Microsoft Edge */
  color: #C8CFD5;
}

</style>
