<template>
  <!-- Search Form -->
  <div id="form-block4" class="text-left mt-5 mx-3">
    <h4 class="mb-3">{{ $t("search.headline") }}</h4>
    <div class="card text-white bg-htw-green mt-2 mb-4 ms-3">
      <div class="card-body p-1">
        <p class="card-text">
          <strong>{{ $t("search.hint.hintHeading") }}</strong>
          {{ $t("search.hint.hintContent") }}
        </p>
      </div>
    </div>

    <div class="container" style="max-width: 100vw;">
      <form role="form"
            v-on:submit.prevent>
        <input type="hidden" name="authenticity_token">
        <div id="search_options" class="row ps-3 row-cols-lg-auto g-3 align-items-center">
          <i18n-t keypath="search.form.info"
                  tag="div"
                  class="form-inline search-option-text">
            <template #payment>
                <select class="form-select mx-2 my-2 w-auto h-auto"
                        v-model="paymentFilter"
                        id="search_paid">
                  <option :value="null">{{ $t("search.form.paymentOptions.standard") }}</option>
                  <template v-if="this.availablePaymentOptions != null">
                    <option
                      v-for="(paymentOption, index) in this.availablePaymentOptions"
                      v-bind:key="index"
                      v-bind:paymentOption="paymentOption"
                      :value="paymentOption">
                      {{ paymentOption }}
                    </option>
                  </template>
                </select>
            </template>
            <template #location>
                <label class="sr-only" for="search_location">
                  {{ $t("search.form.location") }}
                </label>
                <select class="form-select mx-2 my-2 w-auto h-auto"
                        v-model="this.countryFilter"
                        id="search_location">
                  <option :value="null"> {{ $t("search.form.niceLocation") }}</option>
                  <template v-if="this.availableCountries != null">
                    <option
                      v-for="(country, index) in this.availableCountries"
                      v-bind:key="index"
                      v-bind:country="country"
                      :value="country">
                      {{ country }}
                    </option>
                  </template>
                </select>
            </template>
            <template #orientation>
              <label class="sr-only" for="search_orientation_id">
                {{ $t("search.form.orientation") }}
              </label>
              <select class="form-select mx-2 my-2 w-auto h-auto"
                      v-model="this.orientationFilter"
                      id="search_orientation_id">
                <option :value="null">{{ $t("search.form.fun") }}</option>
                <template v-if="this.availableOrientations != null">
                  <option
                    v-for="(orientation, index) in this.availableOrientations"
                    v-bind:key="index"
                    :value="orientation">
                    {{ orientation }}
                  </option>
                </template>
              </select>
            </template>
            <template #programmingLanguage>
              <label class="sr-only" for="search_programming_language_id">
                {{ $t("search.form.programmingLanguage") }}
              </label>
              <select class="form-select mx-2 my-2 w-auto h-auto"
                      v-model="this.languageFilter"
                      id="search_programming_language_id">
                <option :value="null">{{ $t("search.form.interested") }}</option>
                <template v-if="this.availableLanguages != null">
                  <option
                    v-for="(language, index) in this.availableLanguages"
                    v-bind:key="index"
                    :value="this.availableLanguages[index]">
                    {{ language }}
                  </option>
                </template>
              </select>
            </template>
          </i18n-t>
        </div>
        <div class="btn-group" role="group">
          <div class="field me-2">
            <button v-on:click="searchRequest()" class="btn btn-htw-green">
              {{ $t("search.form.search") }}
            </button>
          </div>
          <form role="form" class="new_search" action="/de/shuffle" method="post">
            <input type="hidden" name="authenticity_token" value="">
            <div class="field">
              <button class="btn btn-htw-green">
                {{ $t("search.form.random") }}
              </button>
            </div>
          </form>
        </div>
      </form>
    </div>
  </div>

  <!-- Search Results -->
  <div id="form-block4" class="mx-3 my-3">
    <div class="text-center">
      <button
        type="button"
        class="btn btn-htw-green text-white mb-3"
        v-on:click="cardToggle = !cardToggle"
      >
        {{ $t("search.showMap") }}
      </button>
    </div>
    <div id="search-results" class="search_results" v-if="!cardToggle">
      <div class="container" style="max-width: 100vw;">
        <p class="text-center p-1">
          {{ $tc("search.results.resultCount", resultCount) }}
        </p>
        <p class="text-center p-1">
          {{ $tc("search.results.previousResultCount", resultCount) }}
        </p>
        <table class="table table-striped table-sm table-borderless text-left">
          <tbody>
          <tr>
            <td class="font-weight-bold">{{ $t("search.company") }}</td>
            <td class="font-weight-bold">{{ $t("search.location") }}</td>
            <td class="font-weight-bold">{{ $t("search.orientation") }}</td>
            <td class="font-weight-bold"></td>
          </tr>
          <!-- Result Loop -->
          <template
            v-for="(searchResult, index) in searchResults"
            v-bind:key="searchResult.id"
            v-bind:index="index"
          >
            <tr>
              <td>{{ searchResult.company.name }}</td>
              <td> {{ searchResult.company.companyLocation.city }}</td>
              <td> {{ searchResult.department }}</td>
              <td>
                <button
                  class="btn btn-outline-htw-green float-right"
                  data-bs-toggle="collapse"
                  :data-bs-target="'#collapseResult' + searchResult.id"
                  aria-expanded="false"
                  :aria-controls="'#collapseResult' + searchResult.id"
                >
                  Details
                </button>
              </td>
            </tr>
            <tr class="collapse" :id="'collapseResult' + searchResult.id">
              <td colspan="7">
                <p class="pl-3">
                  <strong>{{ $t("search.tookPlace") }}</strong>
                  {{ searchResult.semester }}
                </p>
                <p class="pl-3">
                  <strong>{{ $t("search.programmingLanguages") }}</strong>
                  {{ searchResult.skills }}
                </p>
                <p class="pl-3">
                  <strong>{{ $t("search.website") }}</strong>
                  <a :href="searchResult.website" target="_blank">
                    {{ searchResult.website }}
                  </a>
                </p>
                <p class="pl-3">
                  <strong>{{ $t("search.tasks") }}</strong>
                  {{ searchResult.tasks }}
                </p>
                <p class="pl-3">
                  <strong>{{ $t("search.contact") }}</strong>
                  {{ searchResult.contact }}
                </p>
              </td>
            </tr>
          </template>
          </tbody>
        </table>
      </div>

    </div>
    <div id="map-results">
      <Map v-if="cardToggle" :locations="locations"></Map>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import 'leaflet/dist/leaflet.css';
import Map from '@/components/Map.vue';
import http from '@/utils/http-common';
// @TODO: Internship Search Endpoint abfragen und Mock-Daten ersetzen
// @TODO: %Count%-Ergebnisse auf vorheriger Suche implementieren und entsprechend darstellen
// @TODO: Endpoint für verfügbare Locations abfragen
export default defineComponent({
  name: 'Search',
  components: { Map },
  data() {
    return {
      availableCountries: null,
      availablePaymentOptions: null,
      availableOrientations: null,
      availableLanguages: null,
      searchResults: [
        {
          id: 1,
          company: {
            name: 'Testfirma #1',
            companyLocation: {
              city: 'Friedrichstraßen 17, 10961 Berlin',
              lat: 52.498605,
              lng: 13.391799,
            },
          },
          department: 'Javascript, Html, Css',
          tasks: 'Testung / Front-End Entwicklung Epikur Version 5',
          skills: 'Java',
          semester: 'WS 19/20',
          website: ' www.epikur.de',
          contact: 'Krister Helbing, khelbing@epikur.de',
        },
        {
          id: 2,
          company: {
            name: 'Testfirma #2',
            companyLocation: {
              city: 'Bad Timmberg, Irland',
              lat: 74.21327053768769,
              lng: 13.116135124688158,
            },
          },
          department: 'Python, C##, Java',
          tasks: 'Hier stehen noch mehr aufgaben',
          skills: 'Java und mehr',
          semester: 'WS 18/19',
          website: ' www.google.de',
          contact: 'Ronny Rüpel, Ronny@rüpel.to',
        },
      ],
      paymentFilter: null,
      countryFilter: null,
      languageFilter: null,
      orientationFilter: null,
      cardToggle: false,
    };
  },
  computed: {
    resultCount(): number {
      return this.searchResults.length;
    },
    locations(): Array<{city: string; lat: number; lng: number}> {
      const locations: Array<{city: string; lat: number; lng: number}> = [];
      this.searchResults.forEach((searchResult) => {
        locations.push(searchResult.company.companyLocation);
      });
      return locations;
    },
  },
  methods: {
    async getAvailableCountries() {
      try {
        const res = await http.get('/companies/countries');
        this.availableCountries = res.data;
      } catch (err) {
        console.log(err.message);
      }
    },
    async getAvailablePaymentOptions() {
      try {
        const res = await http.get('/internships/properties/payment-types');
        this.availablePaymentOptions = res.data;
      } catch (err) {
        console.log(err.message);
      }
    },
    async getAvailableOrientations() {
      try {
        const res = await http.get('/internships/properties/operational-areas');
        this.availableOrientations = res.data;
      } catch (err) {
        console.log(err.message);
      }
    },
    async getAvailableLanguages() {
      try {
        const res = await http.get('/internships/properties/programming-languages');
        this.availableLanguages = res.data;
      } catch (err) {
        console.log(err.message);
      }
    },
    async searchRequest() {
      try {
        const res = await http.get('/internships');
        console.log(res);
      } catch (err) {
        console.log(err.message);
      }
    },
  },
  created() {
    this.getAvailableCountries();
    this.getAvailablePaymentOptions();
    this.getAvailableOrientations();
    this.getAvailableLanguages();
  },
});
</script>

<style lang="scss">
#search_options > * {
  width: auto;
}

.search-option-text > * {
  display: inline !important;
}
</style>
