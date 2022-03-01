<template>
  <div class="container clear-top">
    <div id="form-block4">
      <h3>Neues Praktikum</h3>
      <form v-on:submit.prevent>
        <div class="row my-4">
          <div class="col">
            <label for="startDate">Startdatum</label>
            <input v-model="startDate"
                   type="date"
                   id="startDate"
                   class="form-control"/>
          </div>
          <div class="col">
            <label for="startDate">Enddatum</label>
            <input v-model="endDate"
                   type="date"
                   id="endDate"
                   class="form-control"/>
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
                   placeholder="Java, C++, Assembly"/>
          </div>
        </div>

        <div class="row my-4">
          <div class="col">
            <label for="salary">Gehalt in Euro</label>
            <input v-model="salary"
                   type="number"
                   min="0"
                   step="50"
                   class="form-control"
                   id="salary"
                   placeholder="Gehalt"/>
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
                       v-model="payment"/>
                <label class="form-check-label" :for="`checkbox-${paymentType}`">
                  {{ paymentType }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="row my-4">
          <div class="col">
            <label for="livingCosts">Lebensunterhaltskosten in Euro</label>
            <input v-model="livingCosts"
                   type="number"
                   min="0"
                   step="50"
                   class="form-control"
                   id="livingCosts"
                   placeholder="Lebensunterhaltskosten"/>
          </div>
          <div class="col">
            <label for="workingHoursPerWeek">Arbeitsstunden pro Woche</label>
            <input v-model="workingHoursPerWeek"
                   type="number"
                   min="0"
                   class="form-control"
                   id="workingHoursPerWeek"
                   placeholder="Arbeitsstunden pro Woche"/>
          </div>
        </div>

        <div class="row my-4">
          <div class="col">
            <div class="mb-3">
              <label for="supervisorFullName">Name der Betreuer*in</label>
              <input v-model="supervisorFullName"
                     type="text"
                     class="form-control"
                     id="supervisorFullName"
                     placeholder="Name des Betreuers"/>
            </div>
            <div class="mb-3">
              <label for="supervisorEmail">Email der Betreuer*in</label>
              <input v-model="supervisorEmailAddress"
                     type="text"
                     class="form-control"
                     id="supervisorEmail"
                     placeholder="Email des Betreuers"/>
            </div>
            <div>
              <label for="company">Firma</label>
              <input v-model="company"
                     type="text"
                     class="form-control"
                     id="company"
                     placeholder="Firma"/>
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
        <!-- Add new Company Form -->
        <div class="row card border-secondary bg-light p-3" v-if="toggleAddCompanyForm">

          <div class="alert alert-primary">
            <small>
              <strong>Achtung!</strong> Du hast einen Firmennamen angegeben, welcher noch nicht in
              der Datenbank existiert. Bitte gib zunächst ergänzende Informationen zur Firma
              an und speichere anschließend dein Praktikum!
            </small>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label>Name der Firma</label>
              <input v-model="company"
                     type="text"
                     class="form-control"
                     id="newCompanyName"
                     placeholder="Firma"/>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label for="newCompanyBranchName">Name der Zweigstelle</label>
              <input v-model="newCompanyBranchName"
                     type="text"
                     class="form-control"
                     id="newCompanyBranchName"
                     placeholder="Name der Zweigstelle"/>
            </div>
            <div class="col">
              <label for="newCompanyEmailAddress">Email Adresse</label>
              <input v-model="newCompanyEmailAddress"
                     type="email"
                     class="form-control"
                     id="newCompanyEmailAddress"
                     placeholder="Email Adresse"/>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label for="newCompanyIndustry">Industrie</label>
              <input v-model="newCompanyIndustry"
                     type="text"
                     class="form-control"
                     id="newCompanyIndustry"
                     placeholder="Industrie"/>
            </div>
            <div class="col">
              <label for="newCompanyWebsite">Webseite</label>
              <input v-model="newCompanyWebsite"
                     type="text"
                     class="form-control"
                     id="newCompanyWebsite"
                     placeholder="Webseite"/>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label for="newCompanyMainLanguage">Hauptsprache</label>
              <select v-model="newCompanyMainLanguage"
                      id="newCompanyMainLanguage"
                      class="form-control">
                <option value="">Bitte auswählen</option>
                <option v-for="(language, index) in languages"
                        v-bind:key="index"
                        v-bind:language="language"
                        :value="language.language">
                  {{ language.languageName }}
                </option>
              </select>
            </div>
            <div class="col">
              <label for="newCompanySize">Größe</label>
              <select v-model="newCompanySize"
                      id="newCompanySize"
                      class="form-control">
                <option value="">Bitte auswählen</option>
                <option value="big">mehr als 250 Angestellte</option>
                <option value="medium">weniger als 250 Angestellte</option>
                <option value="small">weniger als 50 Angestellte</option>
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label for="newCompanyMainLanguage">Straße</label>
              <input v-model="newCompanyStreet"
                     type="text"
                     class="form-control"
                     id="newCompanyStreet"
                     placeholder="Straße"/>
            </div>
            <div class="col">
              <label for="newCompanyStreetNumber">Nr.</label>
              <input v-model="newCompanyStreetNumber"
                     type="text"
                     class="form-control"
                     id="newCompanyStreetNumber"
                     placeholder="Nr."/>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label for="newCompanyAdditionalLines">Adresszusatz</label>
              <input v-model="newCompanyAdditionalLines"
                     type="text"
                     class="form-control"
                     id="newCompanyAdditionalLines"
                     placeholder="Adresszusatz"/>
            </div>
            <div class="col">
              <label for="newCompanyZip">Postleitzahl</label>
              <input v-model="newCompanyZip"
                     type="text"
                     class="form-control"
                     id="newCompanyZip"
                     placeholder="Postleitzahl"/>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label for="newCompanyCity">Stadt</label>
              <input v-model="newCompanyCity"
                     type="text"
                     class="form-control"
                     id="newCompanyCity"
                     placeholder="Stadt"/>
            </div>
            <div class="col">
              <label for="newCompanyCountry">Land</label>
              <input v-model="newCompanyCountry"
                     type="text"
                     class="form-control"
                     id="newCompanyCountry"
                     placeholder="Land"/>
            </div>
          </div>
          <div class="row my-2">
            <div class="col-md-2">
              <button v-on:click="createNewCompany" class="btn btn-secondary">
                Firma Speichern
              </button>
            </div>
            <div class="col-md-2">
              <button v-on:click="abortCompanyCreation" class="btn btn-danger">
                Abbrechen
              </button>
            </div>
          </div>
        </div>
        <div class="row my-4" v-if="!toggleAddCompanyForm">
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
import { Company } from '@/store/types/Company';

// @TODO: Companies abfragen, wenn nicht neue erstellen und ID einfügen
// @TODO: Formularfelder sind optional, Formular macht zum bearbeiten aber dennoch Sinn
export default defineComponent({
  name: 'CreateInternship',
  data() {
    return {
      // New Company Props
      newCompanyName: null,
      newCompanyBranchName: null,
      newCompanyEmailAddress: null,
      newCompanyIndustry: null,
      newCompanyWebsite: null,
      newCompanyMainLanguage: '',
      newCompanySize: '',
      newCompanyStreet: null,
      newCompanyStreetNumber: null,
      newCompanyAdditionalLines: null,
      newCompanyZip: null,
      newCompanyCity: null,
      newCompanyCountry: null,
      // New Internship Props
      startDate: null,
      endDate: null,
      operationalArea: null,
      programmingLanguages: null,
      salary: null,
      payment: [] as string[],
      livingCosts: null,
      workingHoursPerWeek: null,
      company: null,
      supervisorFullName: null,
      supervisorEmailAddress: null,
      tasks: null,
      // Form Select Field Options
      availableLanguages: {} as {[key: string]: {name: string; nativeName: string}},
      availablePaymentTypes: [] as string[],
      // Company Object after check for existing Company or after creating a new company
      existingCompany: {} as Company,
      // Component State
      toggleAddCompanyForm: false,
      createdInternshipId: '',
    };
  },
  created() {
    this.getAvailableLanguages();
    this.getAvailablePaymentTypes();
  },
  computed: {
    languages(): {language: string; languageName: string}[] {
      return Object.keys(this.availableLanguages).flatMap(
        (lang) => ({ language: lang, languageName: this.availableLanguages[lang].name }),
      );
    },
  },
  methods: {
    async save() {
      if (this.company !== null && await this.companyExists()) {
        await this.postInternship();
      } else {
        this.toggleAddCompanyForm = true;
      }
    },
    async companyExists(): Promise<boolean> {
      if (this.company === null) return false;
      try {
        const res = await http.get('/companies', { params: { companyName: this.company } });
        if (res.data === null) return false;
        this.existingCompany = res.data;
        return true;
      } catch (err) {
        return false;
      }
    },
    async createNewCompany() {
      if (await this.companyExists()) {
        this.toggleAddCompanyForm = !this.toggleAddCompanyForm;
      } else {
        try {
          const res = await http.post('/companies', null, {
            params: {
              companyName: this.company,
              branchName: this.newCompanyBranchName,
              emailAddress: this.newCompanyEmailAddress,
              industry: this.newCompanyIndustry,
              website: this.newCompanyWebsite,
              mainLanguage: this.newCompanyMainLanguage,
              size: this.newCompanySize,
              street: this.newCompanyStreet,
              streetNumber: this.newCompanyStreetNumber,
              additionalLines: this.newCompanyAdditionalLines,
              zip: this.newCompanyZip,
              city: this.newCompanyCity,
              country: this.newCompanyCountry,
            },
          });
          this.existingCompany = res.data;
          await this.$store.dispatch('addNotification', { text: 'Firma erfolgreich angelegt!', type: 'success' });
          this.toggleAddCompanyForm = false;
          this.clearNewCompanyForm();
        } catch (err) {
          await this.$store.dispatch('addNotification', { text: `${err.response.data.error.message}`, type: 'danger' });
        }
      }
    },
    async postInternship() {
      try {
        const res = await http.post('/internships', {
          startDate: this.startDate,
          endDate: this.endDate,
          operationalArea: this.operationalArea,
          programmingLanguages: this.convertStringToArray(
            this.programmingLanguages,
          ),
          salary: this.salary,
          payment: this.payment,
          livingCosts: this.livingCosts,
          workingHoursPerWeek: this.workingHoursPerWeek,
          companyId: this.existingCompany._id,
          supervisorFullName: this.supervisorFullName,
          supervisorEmailAddress: this.supervisorEmailAddress,
          tasks: this.tasks,
        });
        this.createdInternshipId = res.data._id;
        await this.$store.dispatch('addNotification', { text: 'Praktikum erfolgreich angelegt!', type: 'success' });
        await this.$router.push({ name: 'AskForFeedback', params: { id: this.createdInternshipId } });
      } catch (err) {
        await this.$store.dispatch('addNotification', { text: `${err.response.data.error.message}`, type: 'danger' });
      }
    },
    async getAvailableLanguages() {
      try {
        const res = await http.get('/info/languages');
        this.availableLanguages = res.data;
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `Fehler beim laden der verfügbaren Sprachen [ERROR: ${err.message}]`,
          type: 'danger',
        });
      }
    },
    async getAvailablePaymentTypes() {
      try {
        const res = await http.get('/info/payment-types');
        this.availablePaymentTypes = res.data;
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `Fehler beim laden der verfügbaren Bezahlungsmodelle [ERROR: ${err.message}]`,
          type: 'danger',
        });
      }
    },
    abortCompanyCreation() {
      this.toggleAddCompanyForm = false;
      this.clearNewCompanyForm();
    },
    clearNewCompanyForm() {
      this.newCompanyBranchName = null;
      this.newCompanyEmailAddress = null;
      this.newCompanyIndustry = null;
      this.newCompanyWebsite = null;
      this.newCompanyMainLanguage = '';
      this.newCompanySize = '';
      this.newCompanyStreet = null;
      this.newCompanyStreetNumber = null;
      this.newCompanyAdditionalLines = null;
      this.newCompanyZip = null;
      this.newCompanyCity = null;
      this.newCompanyCountry = null;
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
