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
                      v-model="this.operationalAreaFilter"
                      id="search_orientation_id">
                <option :value="null">{{ $t("search.form.fun") }}</option>
                <template v-if="this.availableOperationalAreas != null">
                  <option v-for="(orientation, index) in this.availableOperationalAreas"
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
                  <option v-for="(language, index) in this.availableLanguages"
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
          <!-- @TODO: Zufallsorschlag implementieren -->
          <form role="form" v-on:submit.prevent v-if="false">
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
  <div id="form-block4" class="mx-3 my-3" v-if="!loadingState && searchResults.length <= 0">
    {{ $t("search.results.noResults") }}
  </div>
  <div id="form-block4" class="mx-3 my-3" v-if="!loadingState && searchResults.length > 0">
    <div class="text-center">
      <button type="button"
              class="btn btn-htw-green text-white mb-3"
              v-on:click="cardToggle = !cardToggle">
        {{ $t("search.showMap") }}
      </button>
    </div>
    <div id="search-results" class="search_results" v-if="!cardToggle">
      <div class="container" style="max-width: 100vw;">
        <p class="text-center p-1">
          {{ $tc("search.results.resultCount", resultCount) }}
        </p>
        <!-- @TODO: %count% Ergebnisse aus vorherigen suchen implementieren-->
        <p class="text-center p-1" v-if="false">
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
          <template  v-if="searchResults?.length > 0">
            <template v-for="(searchResult) in searchResults"
                      v-bind:key="searchResult._id">
              <tr>
                <td>{{ searchResult?.company?.companyName }}</td>
                <td> {{ searchResult?.company?.address?.city }}</td>
                <td> {{ searchResult?.operationalArea }}</td>
                <td>
                  <button class="btn btn-outline-htw-green float-right"
                          data-bs-toggle="collapse"
                          :data-bs-target="'#collapseResult' + searchResult._id"
                          aria-expanded="false"
                          :aria-controls="'#collapseResult' + searchResult._id">
                    Details
                  </button>
                </td>
              </tr>
              <tr class="collapse" :id="'collapseResult' + searchResult._id">
                <td colspan="7">
                  <p class="pl-3">
                    <strong>{{ $t("search.programmingLanguages") }}</strong>
                    {{
                      searchResult.programmingLanguages?.length > 0
                        ? searchResult.programmingLanguages?.toString()
                        :  'Keine Angabe'
                    }}
                  </p>
                  <p class="pl-3">
                    <strong>{{ $t("search.website") }}</strong>
                    <a :href="searchResult?.company?.website" target="_blank">
                      {{ searchResult?.company?.website }}
                    </a>
                  </p>
                  <p class="pl-3">
                    <strong>{{ $t("search.tasks") }}</strong>
                    {{ searchResult?.tasks }}
                  </p>
                  <p class="pl-3">
                    <strong>{{ $t("search.contact") }}</strong>
                    {{ searchResult?.company?.emailAddress }}
                  </p>
                </td>
              </tr>
            </template>
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
import { Internship } from '@/store/types/Internship';
import { MapLocation } from '@/store/types/MapLocation';

export default defineComponent({
  name: 'Search',
  components: { Map },
  data() {
    return {
      // Available filters after query
      availableCountries: null,
      availablePaymentOptions: null,
      availableOperationalAreas: null,
      availableLanguages: null,
      // Searchresults after query
      searchResults: [] as Internship[],
      // Selected filters
      paymentFilter: null,
      countryFilter: null,
      languageFilter: null,
      operationalAreaFilter: null,
      // Component state
      cardToggle: false,
      loadingState: true,
    };
  },
  computed: {
    resultCount(): number {
      return this.searchResults.length;
    },
    locations(): MapLocation[] | null {
      if (this.searchResults.length === 0) return null;
      return this.searchResults.map(
        (searchResult) => ({
          city: searchResult.company.address.city,
          coordinates: searchResult.company.address.coordinates,
        }),
      );
    },
  },
  methods: {
    async getAvailableCountries() {
      try {
        const res = await http.get('/info/countries');
        this.availableCountries = await res.data;
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `Fehler beim laden der verfügbaren Länder [ERROR: ${err.message}]`,
          type: 'danger',
        });
      }
    },
    async getAvailablePaymentOptions() {
      try {
        const res = await http.get('/info/payment-types');
        this.availablePaymentOptions = res.data;
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `Fehler beim laden der verfügbaren Bezahlungsmodelle [ERROR: ${err.message}]`,
          type: 'danger',
        });
      }
    },
    async getAvailableOrientations() {
      try {
        const res = await http.get('/info/operational-areas');
        this.availableOperationalAreas = res.data;
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `Fehler beim laden der verfügbaren Bereiche [ERROR: ${err.message}]`,
          type: 'danger',
        });
      }
    },
    async getAvailableLanguages() {
      try {
        const res = await http.get('/info/programming-languages');
        this.availableLanguages = res.data;
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `Fehler beim laden der verfügbaren Programmiersprachen [ERROR: ${err.message}]`,
          type: 'danger',
        });
      }
    },
    async searchRequest() {
      this.loadingState = true;
      try {
        const res = await http.get('/internships', {
          params: {
            country: this.countryFilter,
            operationalArea: this.operationalAreaFilter,
            programmingLanguage: this.languageFilter,
            paymentType: this.paymentFilter,
            seen: false,
          },
        });
        this.searchResults = await res.data;
        this.searchResults = this.searchResults.filter((internship) => typeof internship.company.address !== 'undefined');
        this.loadingState = false;
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `Fehler beim Suchen nach Praktika [ERROR: ${err.message}]`,
          type: 'danger',
        });
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
