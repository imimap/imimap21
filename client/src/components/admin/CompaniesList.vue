<template>
  <div class="container">
    <div class="row">
      <div class="col-12">

        <div class="accordion" id="listAccordion">
          <div v-for="(row, index) in companies" v-bind:key="index" class="accordion-item">
            <h2 class="accordion-header" v-bind:id="index">
              <button class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      v-bind:data-bs-target="'#company-' + row.id"
                      aria-expanded="false"
                      v-bind:aria-controls="'company-' + row.id">
                <div class="container">
                  <div class="row">
                    <div class="col-4">
                      <h6 class="list-item-label">Name</h6>
                      <span class="fw-bold">{{ row.companyName }}</span>
                    </div>
                    <div class="col-4">
                      <h6 class="list-item-label">Ort</h6>
                      <span class="fw-bold">
                        {{ row.address.city + ', ' + row.address.country }}
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
                <h3>{{ row.address.city + ', ' + row.address.country }}</h3>
                <p>
                  <b>Industrie:</b> {{ row.industry }}<br>
                  <b>Website:</b> <a :href="row.website" target="_blank">
                  {{ row.website }}</a><br>
                  <b>Sprache:</b> {{ row.mainLanguage }}<br>
                  <b>Größe:</b> {{ row.size.toLocaleLowerCase() }}<br>
                  <b>Adresse:</b><br>
                  {{ row.address.street + ' ' + row.address.number }}<br>
                  {{ row.address.zip + ' ' + row.address.city }}<br>
                  {{ row.address.country }}<br>
                </p>

                <button type="button" class="btn btn-success" data-bs-toggle="modal"
                        data-bs-target="#companyEditModal"
                        @click="changeCurrentEditCompanyIndex(row.id)">
                  Bearbeiten</button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--  Company Edit Modal-->
  <div class="modal fade" id="companyEditModal" tabindex="-1"
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

export default defineComponent({
  name: 'CompaniesList',
  data() {
    return {
      currentEditCompanyIndex: 0,
      companies: [{
        id: 0,
        companyName: 'Coding B.V.',
        branchName: 'Coding B.V. Amsterdam',
        industry: 'Web Development',
        website: 'https://coding.nl',
        mainLanguage: 'english',
        comment: 'lorem ipsum',
        excludedFromSearch: true,
        size: 'LARGE',
        address: {
          street: 'Pannekokenstraat',
          number: '38',
          zip: '1234',
          city: 'Amsterdam',
          country: 'Netherlands',
          latitude: 52.370216,
          longitude: 4.895168,
        },
      },
      {
        id: 1,
        companyName: '123VeryMuchCoding GmbH',
        branchName: '123VeryMuchCoding GmbH Berlin',
        industry: 'Web Development',
        website: 'https://coding.de',
        mainLanguage: 'german',
        comment: '',
        excludedFromSearch: false,
        size: 'MEDIUM',
        address: {
          street: 'Unter den Linden',
          number: '192',
          zip: '12345',
          city: 'Berlin',
          country: 'Germany',
          latitude: 52.520008,
          longitude: 13.404954,
        },
      }],
    };
  },
  methods: {
    changeCurrentEditCompanyIndex(companyId: number) {
      this.currentEditCompanyIndex = companyId;
    },
    updateCompany(companyId: number) {
      // API POST call
      // update this.companies[companyId]
      console.log('updated ', this.companies[this.currentEditCompanyIndex].companyName);
      return true;
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

</style>
