<template>
  <div class="container">
    <div class="row">
      <div class="col-12">

        <div class="row mb-3">
          <div class="col-lg-3 col-md-12">
            <select class="form-select"
                    aria-label="Sortieren nach"
                    v-model="currentSorting"
                    @change="changeSorting">
              <option selected value="">Sortieren nach...</option>
              <option value="companyName">Firmenname</option>
              <option value="branchName">Zweigname</option>
              <option value="city">Ort</option>
              <option value="country">Staat</option>
            </select>
          </div>
          <div class="col-lg-3 col-md-12">
            <input type="text"
                   class="form-control"
                   placeholder="Suche..."
                   aria-label="Suche"
                   aria-describedby="suche"
                   v-model="currentSearch">
            <div id="emailHelp" class="form-text">
              Name, Zweig oder Ort
            </div>
        </div>
         <div class="col-lg-3 col-md-12 reset" >
           <button @click="resetResults()">Zurücksetzen</button>
          </div>
      </div>

        <div v-if="!isLoading" class="accordion" id="listAccordion">
          <div v-for="(row, index) in companiesWithSearch" v-bind:key="index"
               class="accordion-item">
            <h2 class="accordion-header" v-bind:id="index">
              <button class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      v-bind:data-bs-target="'#company-' + row.id"
                      aria-expanded="false"
                      v-bind:aria-controls="'company-' + row.id">
                <div class="container">
                  <div class="row">
                    <div class="col-3">
                      <h6 class="list-item-label">Unternehmen</h6>
                      <span class="fw-bold">{{ row.companyName }}</span>
                    </div>
                    <div class="col-3">
                      <h6 class="list-item-label">Zweig</h6>
                      <span class="fw-bold">{{ row.branchName }}</span>
                    </div>
                    <div class="col-3">
                      <h6 class="list-item-label">Ort</h6>
                      <span class="fw-bold">
                        {{ row.address?.city + ', ' + row.address?.country }}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </h2>
            <div v-bind:id="'company-' + row.id"
                 class="accordion-collapse collapse"
                 aria-labelledby="headingOne"
                 data-bs-parent="#listAccordion">
              <div class="accordion-body">
                <h2>{{ row.companyName }}</h2>
                <h3>{{ row.address?.city + ', ' + row.address?.country }}</h3>
                <p>
                  <b>Industrie:</b> {{ row.industry }}<br>
                  <b>Website:</b> <a :href="row.website" target="_blank">
                  {{ row.website }}</a><br>
                  <b>Sprache:</b> {{ row.mainLanguage }}<br>
                  <b>Größe:</b> {{ row.size.toLocaleLowerCase() }}<br>
                  <b>Adresse:</b><br>
                  {{ row.address?.street + ' ' + row.address?.number }}<br>
                  {{ row.address?.zip + ' ' + row.address?.city }}<br>
                  {{ row.address?.country }}<br>
                </p>

                <button type="button" class="btn btn-success me-3" data-bs-toggle="modal"
                        data-bs-target="#companyEditModal"
                        @click="changeCurrentEditCompanyIndex(row.id)">
                  Bearbeiten</button>
                <button type="button" class="btn btn-danger"
                        @click="deleteCompany(row.id)">
                  Löschen</button>

              </div>
            </div>
          </div>
        </div>
        <div v-else class="d-flex justify-content-center">
          <div class="spinner-border text-htw" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--  Company Edit Modal-->
  <div v-if="companies.length > 0" class="modal fade" id="companyEditModal" tabindex="-1"
       aria-labelledby="companyEditModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="companyEditModalLabel">Firma bearbeiten</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"
                  aria-label="Close">
          </button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control" id="name"
                   aria-describedby="name"
                   v-model="companies[currentEditCompanyIndex].companyName" />
          </div>

          <div class="mb-3">
            <label for="branchName" class="form-label">Zweig Name</label>
            <input type="text" class="form-control" id="branchName"
                   aria-describedby="branchName"
                   v-model="companies[currentEditCompanyIndex].branchName" />
          </div>

          <div class="mb-3">
            <label for="industry" class="form-label">Industrie</label>
            <input type="text" class="form-control" id="industry"
                   aria-describedby="industry"
                   v-model="companies[currentEditCompanyIndex].industry" />
          </div>

          <div class="mb-3">
            <label for="mainLanguage" class="form-label">Sprache</label>
            <input type="text" class="form-control" id="mainLanguage"
                   aria-describedby="mainLanguage"
                   v-model="companies[currentEditCompanyIndex].mainLanguage" />
          </div>

          <div class="mb-3">
            <label for="comment" class="form-label">Kommentar</label>
            <textarea class="form-control"
                      v-model="companies[currentEditCompanyIndex].comment"
                      id="comment"></textarea>
          </div>

          <div class="mb-3">
            <label for="excludedFromSearch" class="form-label">Unsichtbar in der Suche</label>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="excludedFromSearch"
                     v-model="companies[currentEditCompanyIndex].excludedFromSearch">
            </div>
          </div>

          <div class="mb-3">
            <label for="size" class="form-label">Größe</label>
            <select
              v-model="companies[currentEditCompanyIndex].size"
              class="form-select" aria-label="Größe" id="size">
              <option>SMALL</option>
              <option>MEDIUM</option>
              <option>LARGE</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="address" class="form-label">Adresse</label>
            <div class="mb-2 row g-2 align-items-center">
              <div class="col-6">
                <input type="text" class="form-control" id="address"
                       aria-describedby="address" placeholder="Straße"
                       v-model="companies[currentEditCompanyIndex].address.street" />
              </div>

              <div class="col-6">
                <input type="text" class="form-control"
                       aria-describedby="number" placeholder="Nummer"
                       v-model="companies[currentEditCompanyIndex].address.number" />
              </div>
            </div>

            <div class="mb-2 row g-2 align-items-center">
              <div class="col-6">
                <input type="text" class="form-control"
                       aria-describedby="zip" placeholder="PLZ"
                       v-model="companies[currentEditCompanyIndex].address.zip" />
              </div>

              <div class="col-6">
                <input type="text" class="form-control"
                       aria-describedby="city" placeholder="Ort"
                       v-model="companies[currentEditCompanyIndex].address.city" />
              </div>

              <div class="col-12">
                <input type="text" class="form-control"
                       aria-describedby="city" placeholder="Land"
                       v-model="companies[currentEditCompanyIndex].address.country" />
              </div>

              <div class="col-6">
                <input type="text" class="form-control"
                       aria-describedby="latitude" placeholder="Latitude"
                       v-model="companies[currentEditCompanyIndex].address.latitude" />
              </div>

              <div class="col-6">
                <input type="text" class="form-control"
                       aria-describedby="longitude" placeholder="Longitude"
                       v-model="companies[currentEditCompanyIndex].address.longitude" />
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary"
                  data-bs-dismiss="modal">Schließen</button>
          <button type="button"
                  class="btn btn-success"
                  @click="updateCompany(currentEditCompanyIndex)"
          >Speichern</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getCompaniesList } from '@/utils/gateways';
import Company from '@/models/Company';
import store from '@/store';

export default defineComponent({
  name: 'CompaniesList',
  data() {
    return {
      currentEditCompanyIndex: 0,
      companies: [] as Company[],
      currentSorting: '',
      currentSearch: '',
      isLoading: false,
    };
  },
  computed: {
    companiesWithSearch(): Company[] {
      return this.companies.filter((company) => company
        .companyName.toLowerCase()
        .includes(this.currentSearch.toLowerCase())
        || company.branchName.toLowerCase()
          .includes(this.currentSearch.toLowerCase())
        || company.address.country.toLowerCase()
          .includes(this.currentSearch.toLowerCase())
        || company.address.city.toLowerCase()
          .includes(this.currentSearch.toLowerCase()));
    },
  },
  mounted() {
    this.updateList();
  },
  methods: {
    updateList() {
      // API call for GET list with params
      this.isLoading = true;
      getCompaniesList()
        .then((list) => {
          const companiesList = [] as Company[];
          list.forEach((company) => {
            companiesList.push({
              id: company._id,
              companyName: company.companyName,
              mainLanguage: company.mainLanguage ? company.mainLanguage : '',
              excludedFromSearch: company.excludedFromSearch ? company.excludedFromSearch : '',
              branchName: company.branchName ? company.branchName : '',
              address: {
                street: company.address ? company.address.street : '',
                streetNumber: company.address ? company.address.streetNumber : '',
                zip: company.address ? company.address.zip : '',
                city: company.address ? company.address.city : '',
                country: company.address ? company.address.country : '',
                additionalLines: company.address ? company.address.additionalLines : '',
                coordinates: {
                  latitude: company.address ? company.address.coordinates.latitude : '',
                  longitude: company.address ? company.address.coordinates.longitude : '',
                },
              },
              emailAddress: company.emailAddress ? company.emailAddress : '',
              industry: company.industry ? company.industry : '',
              website: company.website ? company.website : '',
              size: company.size ? company.size : '',
              comment: company.comment ? company.comment : '',
            });
          });
          this.companies = companiesList;
          this.isLoading = false;
        }).catch((err) => console.log(err));
    },
    async resetResults() {
      this.currentSorting = '';
      this.currentSearch = '';
      this.companies = [];
      this.updateList();
    },
    changeCurrentEditCompanyIndex(companyId: string) {
      const index = this.companies.findIndex((x) => x.id === companyId);
      this.currentEditCompanyIndex = index;
    },
    async updateCompany(companyId: string) {
      const userDoubleChecked = window.confirm('Unternehmen wirklich aktualisieren?');
      if (userDoubleChecked) {
        // API POST call
        await store.dispatch('addNotification', {
          text: 'Unternehmen aktualisiert!',
          type: 'success',
        });
        this.updateList();
      } else {
        console.log('cancel');
      }
      return true;
    },
    async deleteCompany(companyId: string) {
      const userDoubleChecked = window.confirm('Unternehmen wirklich löschen?');
      if (userDoubleChecked) {
        // API call delete
        await store.dispatch('addNotification', {
          text: 'Unternehmen gelöscht!',
          type: 'success',
        });
        this.updateList();
      } else {
        console.log('cancel');
      }
      return true;
    },
    changeSorting() {
      if (this.currentSorting === 'companyName' || this.currentSorting === 'branchName') {
        this.companies
          .sort((a, b) => a[this.currentSorting]
            .localeCompare(b[this.currentSorting]));
      } else if (this.currentSorting === 'city' || this.currentSorting === 'country') {
        this.companies
          .sort((a, b) => a.address[this.currentSorting]
            .localeCompare(b.address[this.currentSorting]));
      }
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

  .accordion-item .accordion-body{
    background: #eee;
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

  .reset {
    margin-top: 0.5em;
  }
  .reset > button {
    background: rgba(119, 185, 0, 1);
    color: white;
    border-style: none;
    border-radius: 3px;
    font-size: 15px;
  }

</style>
