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
                <p>{{ row.industry }}</p>
                <p>{{ row.website }}</p>
              </div>
            </div>
          </div>
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
      companies: [{
        id: 0,
        companyName: 'Coding B.V.',
        branchName: 'Coding B.V. Amsterdam',
        industry: 'Web Development',
        website: 'https://coding.nl',
        mainLanguage: 'english',
        comment: '',
        excludedFromSearch: false,
        size: 'LARGE',
        address: {
          street: 'asdfghjk',
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
        size: 'medium',
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
  methods: {},
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
