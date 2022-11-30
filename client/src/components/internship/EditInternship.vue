<!-- eslint-disable max-len -->
<template>
  <div class="container clear-top">
    <div id="form-block4" v-if="!loadingState">
      <h3>{{ $t("internship.heading.edit") }}</h3>
      <div class="explanation">
        <p>Felder mit dem roten <span style="color: red">*</span> sind Pflichtfelder für das Anlegen eines Praktikums.</p>
        <p>Um dein Praktikum offiziell zu beantragen, müssen zusätzlich alle Felder mit dem blauen <span style="color: blue">*</span> ausgefüllt werden.</p>
      </div>
      <form v-on:submit.prevent>
        <div class="row my-4">
          <div class="col">
            <label for="startDate" class="semi-required">
              {{ $t("internship.form.startDate") }}
            </label>
            <input v-model="startDate"
                   type="date"
                   id="startDate"
                   class="form-control"

                  />
          </div>
          <div class="col">
            <label for="endDate" class="semi-required">
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
            <label for="operationalArea" class="semi-required">{{ $t('internship.form.operationalArea') }}</label>
            <input v-model="internship.operationalArea"
                   type="text"
                   class="form-control"
                   id="operationalArea" />
          </div>
          <div class="col">
            <label for="programmingLanguages">
              {{ $t('internship.form.programmingLanguages') }}
            </label>
            <input v-model="internship.programmingLanguages"
                   type="text"
                   class="form-control"
                   id="programmingLanguages"

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
                   id="salary" />
          </div>
          <div class="col">
            <label for="paymentType">{{ $t('internship.form.paymentType.info') }}</label>
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
                   id="livingCosts" />
          </div>
          <div class="col">
            <label for="workingHoursPerWeek">{{ $t('internship.form.workingHoursPerWeek') }}</label>
            <input v-model="internship.workingHoursPerWeek"
                   min="0"
                   class="form-control"
                   id="workingHoursPerWeek" />
          </div>
        </div>

        <div class="row my-4">
          <div class="col">
            <div class="mb-3">
              <label for="supervisorFullName" class="semi-required">{{ $t('company.supervisor.name') }}</label>
              <input v-model="supervisor.fullName"
                     type="text"
                     class="form-control"
                     id="supervisorFullName" />
            </div>
            <div>
              <label for="supervisorEmail" class="semi-required">{{ $t('company.supervisor.email') }}</label>
              <input v-model="supervisor.emailAddress "
                     type="text"
                     class="form-control"
                     id="supervisorEmail" />
            </div>
          </div>
          <div class="col">
            <label for="tasks" class="semi-required">{{ $t('internship.form.tasks') }}</label>
            <textarea v-model="internship.tasks"
                      class="form-control"
                      id="tasks"
                      cols="30"
                      rows="6" />
          </div>
        </div>
        <div class="row card border-secondary bg-light p-3" v-if="internship.status == 'planned'">
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="newCompanyName" class="required">{{ $t('company.name') }}</label>
                <input v-model="companyName"
                      type="text"
                      class="form-control"
                      id="companyName"
                      :placeholder="internship.company.companyName"/>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <label for="newCompanyBranchName">{{ $t('company.branchName') }}</label>
                <input v-model="branchName"
                      type="text"
                      class="form-control"
                      id="companyBranchName"
                      :placeholder="internship.company.branchName"/>
              </div>
              <div class="col">
                <label for="newCompanyEmailAddress">{{ $t('company.email') }}</label>
                <input v-model="emailAddress"
                      type="email"
                      class="form-control"
                      id="companyEmailAddress"
                      :placeholder="internship.company.emailAddress"/>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <label for="newCompanyIndustry">{{ $t('company.industry') }}</label>
                <input v-model="industry"
                      type="text"
                      class="form-control"
                      id="companyIndustry"
                      :placeholder="internship.company.industry"/>
              </div>
              <div class="col">
                <label for="newCompanyWebsite">{{ $t('company.website') }}</label>
                <input v-model="website"
                      type="text"
                      class="form-control"
                      id="companyWebsite"
                      :placeholder="internship.company.website"/>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <label for="newCompanyMainLanguage">{{ $t("company.mainLanguage") }}</label>
                <input :value="filterLanguages(mainLanguage)"
                      type="text"
                      class="form-control"
                      style="background-color: #F8F9FA; border: none;"
                      id="companyWebsite"
                      :placeholder="filterLanguages(internship.company.mainLanguage)"
                      disabled/>
                <select v-model="mainLanguage"
                        id="companyMainLanguage"
                        class="form-select">
                  <option v-for="(language, index) in languages"
                          v-bind:key="index"
                          v-bind:language="language"
                          :value="language.language">
                    {{ language.languageName }}
                  </option>
                </select>
              </div>
              <div class="col">
                <label for="newCompanySize">{{ $t("company.size.info") }}</label>
                <input :value="companySize(size)"
                      type="text"
                      class="form-control"
                      style="background-color: #F8F9FA; border: none;"
                      id="companyWebsite"
                      :placeholder="companySize(internship.company.size ?? '')"
                      disabled/>
                <select v-model="size"
                        id="companySize"
                        class="form-select">
                  <option value="">{{ $t("company.select") }}</option>
                  <option value="big">{{ $t("company.size.big") }}</option>
                  <option value="medium">{{ $t("company.size.medium") }}</option>
                  <option value="small">{{ $t("company.size.small") }}</option>
                </select>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <label for="newCompanyStreet" class="required">{{ $t('address.street') }}</label>
                <input v-model="street"
                      type="text"
                      class="form-control"
                      id="companyStreet"
                      :placeholder="internship.company.address.street"/>
              </div>
              <div class="col">
                <label for="newCompanyStreetNumber" class="required">{{ $t('address.nr') }}</label>
                <input v-model="streetNumber"
                      type="text"
                      class="form-control"
                      id="companyStreetNumber"
                      :placeholder="internship.company.address.streetNumber"/>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <label for="newCompanyAdditionalLines">{{ $t('address.line') }}</label>
                <input v-model="additionalLines"
                      type="text"
                      class="form-control"
                      id="companyAdditionalLines"
                      :placeholder="internship.company.address.additionalLines"/>
              </div>
              <div class="col">
                <label for="newCompanyZip" class="required">{{ $t('address.zip') }}</label>
                <input v-model="zip"
                      type="text"
                      class="form-control"
                      id="companyZip"
                      :placeholder="internship.company.address.zip"/>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col">
                <label for="newCompanyCity" class="required">{{ $t('address.city') }}</label>
                <input v-model="city"
                      type="text"
                      class="form-control"
                      id="companyCity"
                      :placeholder="internship.company.address.city"/>
              </div>
              <div class="col">
                <label for="newCompanyCountry" class="required">{{ $t('address.country') }}</label>
                <input v-model="country"
                      type="text"
                      class="form-control"
                      id="companyCountry"
                      :placeholder="internship.company.address.country"/>
              </div>
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
import { createPayloadFromChangedProps } from '@/utils/admin';
import { getAvailableLanguages, updateCompany, loadPaymentTypes } from '@/utils/gateways';
import { Company } from '@/store/types/Company';
import { onBeforeRouteUpdate } from 'vue-router';

export default defineComponent({
  name: 'EditInternship',
  data() {
    const initialCompanyProps = {
      companyName: undefined as string | undefined,
      branchName: undefined as string | undefined,
      emailAddress: undefined as string | undefined,
      industry: undefined as string | undefined,
      website: undefined as string | undefined,
      mainLanguage: undefined as string | undefined,
      comment: undefined as string | undefined,
      excludedFromSearch: undefined as boolean | undefined,
      size: undefined as string | undefined,
      street: undefined as string | undefined,
      streetNumber: undefined as string | undefined,
      zip: undefined as string | undefined,
      city: undefined as string | undefined,
      country: undefined as string | undefined,
      additionalLines: undefined as string | undefined,
    };
    const updatableCompanyProperties = Object.keys(initialCompanyProps);

    return {
      internship: {} as Internship,
      loadingState: true,
      startDate: null as string | null,
      endDate: null as string | null,
      availablePaymentTypes: [] as string[],
      availableLanguages: {} as {[key: string]: {name: string; nativeName: string}},
      supervisor: {
        fullName: undefined as string | undefined,
        emailAddress: undefined as string | undefined,
      },
      updatableCompanyProperties,
      ...initialCompanyProps,
    };
  },
  async created() {
    this.availableLanguages = await getAvailableLanguages();
    await this.getAvailablePaymentTypes();
    await this.getInternship();
  },
  computed: {
    languages(): {language: string; languageName: string}[] {
      return Object.keys(this.availableLanguages).flatMap(
        (lang) => ({ language: lang, languageName: this.availableLanguages[lang].name }),
      );
    },
  },

  watch: {
    async $route(to, from) {
      if (this.$route.params.locale && to.params.locale !== from.params.locale) {
        this.availablePaymentTypes = [];
        await this.getAvailablePaymentTypes();
      }
    },
  },
  methods: {
    filterLanguages(language) {
      const ml = this.languages.find((l) => l.language === language);
      return ml?.languageName;
    },
    normalizedDate(date: string | null): string | null {
      if (!date) return null;
      const dateWithoutTime = new Date(date).toISOString().split('T')[0].toString();
      return dateWithoutTime;
    },
    companySize(size: string | undefined): string {
      if (!size) return '';
      const s = `company.size.${size}`;
      return `${this.$t(s)}`;
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
        this.internship.startDate = this.normalizedDate(this.startDate)
        ?? this.internship.startDate;
        if (this.endDate || this.internship?.endDate) {
          this.internship.endDate = this.normalizedDate(this.endDate)
        ?? this.internship?.endDate;
        }
        if (this.supervisor.fullName || this.internship.supervisor?.fullName) {
          if (!this.internship.supervisor) { this.internship.supervisor = { fullName: this.supervisor.fullName }; } else {
            this.internship.supervisor.fullName = this.supervisor.fullName ?? this.internship.supervisor?.fullName;
          }
        }
        if (this.supervisor.emailAddress || this.internship.supervisor?.emailAddress) {
          if (!this.internship.supervisor) { this.internship.supervisor = { emailAddress: this.supervisor.emailAddress }; } else {
            this.internship.supervisor.emailAddress = this.supervisor.emailAddress
        ?? this.internship.supervisor?.emailAddress;
          }
        }
        // update company
        const payload = createPayloadFromChangedProps(
          this.updatableCompanyProperties,
          this.$data,
          this.internship.company,
        );
        await updateCompany((this.internship.company as unknown as Company)._id, payload);
        await http.patch(`/internships/${this.$route.params.id}`, this.internship);
        await showSuccessNotification('Praktikum erfolgreich gespeichert!');
      } catch (err: any) {
        await showErrorNotification(`Fehler beim Speichern
        des Praktikums [ERROR: ${err.response.data.error.message}`);
      }
    },
    async getAvailablePaymentTypes() {
      try {
        const paymentTypes = await loadPaymentTypes();
        const st = 'internship.form.paymentType.';
        if (paymentTypes.length > 0) {
          // eslint-disable-next-line no-restricted-syntax
          for (const pt of paymentTypes) {
            this.availablePaymentTypes.push(`${this.$t(st + pt.replace(/\s/g, ''))}`);
          }
        }
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
  color: black;
  opacity: 1; /* Firefox */
}

:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: black;
}

::-ms-input-placeholder { /* Microsoft Edge */
  color: black;
}
.explanation > p {
    margin: 0;
    font-size: 14px;
  }

</style>
