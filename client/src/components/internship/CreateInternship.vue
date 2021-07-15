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
                   placeholder="Java C++ Assembly"/>
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
                   type="number"
                   min="0"
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
              <input v-model="newCompanyMainLanguage"
                     type="text"
                     class="form-control"
                     id="newCompanyMainLanguage"
                     placeholder="Hauptsprache"/>
            </div>
            <div class="col">
              <label for="newCompanySize">Größe</label>
              <select v-model="newCompanySize"
                      id="newCompanySize"
                      class="form-control"
                      placeholder="Bitte auswählen">
                <option value=">= 250 employees">mehr als 250 Angestellte</option>
                <option value="< 250 employees">weniger als 250 Angestellte</option>
                <option value="<50 employees">weniger als 50 Angestellte</option>
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
            <div class="col-md-4">
              <button v-on:click="createNewCompany" class="btn btn-secondary">
                Firma Speichern
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
      newCompanyMainLanguage: null,
      newCompanySize: null,
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
      payment: null,
      livingCosts: null,
      workingHoursPerWeek: null,
      company: null,
      supervisorFullName: null,
      supervisorEmailAddress: null,
      tasks: null,
      // Company Object after check for existing Company or after creating a new company
      existingCompany: {} as Company,
      // Component State
      toggleAddCompanyForm: false,
    };
  },
  methods: {
    async save() {
      if (this.company !== null || await this.companyExists()) await this.postInternship();
      else this.toggleAddCompanyForm = true;
    },
    async companyExists(): Promise<boolean> {
      if (this.company === null) return false;
      try {
        const res = await http.get('/companies', { params: { companyName: this.company } });
        if (res.data === 'null') return false;
        this.existingCompany = res.data;
        return true;
      } catch (err) {
        return false;
      }
    },
    async createNewCompany() {
      try {
        const res = await http.post('/companies', {
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
        });
        this.existingCompany = {
          ...res.data,
        };
        await this.$store.dispatch('addNotification', { text: 'Firma erfolgreich angelegt!', type: 'success' });
        this.toggleAddCompanyForm = false;
      } catch (err) {
        await this.$store.dispatch('addNotification', { text: err.message, type: 'danger' });
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
          payment: this.convertStringToArray(this.payment),
          livingCosts: this.livingCosts,
          workingHoursPerWeek: this.workingHoursPerWeek,
          company: this.existingCompany.id,
          supervisorFullName: this.supervisorFullName,
          supervisorEmailAddress: this.supervisorEmailAddress,
          tasks: this.tasks,
        });
        await this.$store.dispatch('addNotification', { text: 'Praktikum erfolgreich angelegt!', type: 'success' });
        console.log(res);
      } catch (err) {
        await this.$store.dispatch('addNotification', { text: err.message, type: 'danger' });
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
