<template>
  <div class="container">
    <div v-show="amountOfCompaniesSeen >= 12" id="form-block4" class="text-left mt-5 mx-3">
      <p>{{ $t("search.limitReached") }}</p>
    </div>

    <!-- Search Form -->
    <div v-show="amountOfCompaniesSeen < 12" id="form-block4" class="text-left mt-5 mx-3">
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
          <div id="search_options" class="row ps-6 row-cols-lg-auto g-6 align-items-center">
            <select class="form-select mx-1 my-2 w-auto h-auto" v-model="paymentFilter" id="search_paid">
              <option :value="undefined">{{ $t("search.form.paymentOptions.standard") }}</option>
              <option
                v-for="(paymentOption, index) in availablePaymentOptions"
                :key="index"
                :value="paymentOption"
              >
              {{ $t('internship.form.paymentType.' + paymentOption.replace(/\s/g, '')) }}
              </option>
            </select>
            <label class="sr-only" for="search_location">
              {{ $t("search.form.location") }}
            </label>
            <select class="form-select mx-1 my-2 w-auto h-auto" v-model="countryFilter" id="search_location">
              <option :value="undefined"> {{ $t("search.form.niceLocation") }}</option>
              <option
                v-for="(country, index) in availableCountries"
                :key="index"
                :value="country"
              >
                {{ country }}
              </option>
            </select>
            <label class="sr-only" for="search_orientation_id">
              {{ $t("search.form.orientation") }}
            </label>
            <select
              class="form-select col-2 mx-1 my-2h-auto"
              v-model="operationalAreaFilter"
              id="search_orientation_id"
            >
              <option :value="undefined">{{ $t("search.form.fun") }}</option>
              <option
                v-for="(orientation, index) in availableOperationalAreas"
                :key="index"
                :value="orientation"
              >
                {{ orientation }}
              </option>
            </select>
            <label class="sr-only" for="search_programming_language_id">
              {{ $t("search.form.programmingLanguage") }}
            </label>
            <select class="form-select mx-2 my-2 w-auto h-auto"
                    v-model="languageFilter"
                    id="search_programming_language_id">
              <option :value="undefined">{{ $t("search.form.interested") }}</option>
              <option v-for="(language, index) in availableLanguages"
                      :key="index"
                      :value="availableLanguages[index]">
                {{ language }}
              </option>
            </select>
          </div>
          <div class="btn-group" role="group">
            <div class="field me-2">
              <button class="btn btn-htw-green"
                      v-on:click="searchOrShowModal()">
                {{ $t("search.form.search") }}
              </button>
            </div>
            <!-- @TODO: Zufallsvorschlag implementieren -->
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
    <!-- Too many results modal -->
    <too-many-results :amount-of-company-results="amountOfCompanies"
                      :amount-of-companies-seen="amountOfCompaniesSeen"
                      v-on:search="searchRequest"/>
    <!-- Search Results -->
    <div id="previous-search-results" class="search_results"
         v-if="previousResultCount > 0 && !resultsShown">
      <SearchResultList
        :result-count="previousResultCount"
        :search-results="previousSearchResults"
        :result-count-text="'search.results.previousResultCount'">
      </SearchResultList>
    </div>
    <div id="form-block4" class="mx-3 my-3"
         v-if="!loadingState && resultCount <= 0">
      {{ $t("search.results.noResults") }}
    </div>
    <div id="form-block4" class="mx-3 my-3"
         v-if="!loadingState && (resultCount > 0 )">
      <div class="text-center">
        <button type="button"
                class="btn btn-htw-green text-white mb-3"
                v-on:click="cardToggle = !cardToggle">
          {{ $t("search.showMap") }}
        </button>
      </div>
      <div id="search-results" class="search_results"
           v-if="!cardToggle && resultCount > 0">
        <SearchResultList
          :result-count="resultCount"
          :search-results="searchResults"
          :result-count-text="'search.results.resultCount'">
        </SearchResultList>
      </div>
      <div id="map-results">
        <Map v-if="cardToggle" :locations="locations"></Map>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import 'leaflet/dist/leaflet.css';
import Map from '@/components/Map.vue';
import { Internship } from '@/store/types/Internship';
import { MapLocation } from '@/store/types/MapLocation';
import SearchResultList from '@/components/search/SearchResultList.vue';
import TooManyResults from '@/components/search/TooManyResults.vue';
import { Modal } from 'bootstrap';
import {
  getAmountOfPossibleNewResults,
  getAmountOfSeenResults,
  getInternshipsOfCompaniesSeen,
  loadCountries,
  loadOperationalAreas,
  loadPaymentTypes,
  loadProgrammingLanguages,
  searchInternships,
} from '@/utils/gateways';

export default defineComponent({
  name: 'Search',
  components: { SearchResultList, Map, TooManyResults },
  data() {
    return {
      // Available filters after query
      availableCountries: [] as string[],
      availablePaymentOptions: [] as string[],
      availableOperationalAreas: [] as string[],
      availableLanguages: [] as string[],
      // Search results after query
      searchResults: [] as Internship[],
      previousSearchResults: [] as Internship[],
      // Selected filters
      paymentFilter: undefined,
      countryFilter: undefined,
      languageFilter: undefined,
      operationalAreaFilter: undefined,
      // Component state
      cardToggle: false,
      loadingState: true,
      amountOfCompanies: 0,
      amountOfCompaniesSeen: 0,
      resultsShown: false,
    };
  },

  computed: {
    resultCount(): number {
      return this.searchResults.length;
    },
    previousResultCount(): number {
      return this.previousSearchResults.length;
    },
    locations(): MapLocation[] | undefined {
      if (this.searchResults.length === 0) return undefined;
      return this.searchResults.map(
        (searchResult) => ({
          city: searchResult.company.address.city,
          coordinates: searchResult.company.address.coordinates,
          country: searchResult.company.address.city,
        }),
      );
    },
    modal(): Modal {
      const el = document.getElementById('tooManyResultsModal');
      if (!el) throw new Error('Modal could not be found!');
      const modal = new Modal(el);
      if (!modal) throw new Error('Modal could not be found!');
      return modal;
    },
  },
  methods: {
    async searchOrShowModal() {
      const amountSeen = await getAmountOfSeenResults();
      const amountOfCompanies = await getAmountOfPossibleNewResults(
        this.countryFilter, this.operationalAreaFilter, this.languageFilter, this.paymentFilter,
      );
      if (amountSeen && amountSeen < 12 && amountOfCompanies && amountOfCompanies > 0) {
        this.amountOfCompanies = amountOfCompanies;
        this.amountOfCompaniesSeen = amountSeen;
        this.modal.show();
      } else {
        await this.searchRequest();
        this.modal.hide();
      }
    },
    async searchRequestForNewResults() {
      this.searchResults = await searchInternships(
        this.countryFilter, this.operationalAreaFilter, this.languageFilter, this.paymentFilter,
      );
      this.previousSearchResults = await this.getInternshipsOfCompaniesSeen();
    },
    async getInternshipsOfCompaniesSeen() {
      const amountSeen = await getAmountOfSeenResults();
      if (!amountSeen || amountSeen === 0) return [];
      this.amountOfCompaniesSeen = amountSeen;
      return getInternshipsOfCompaniesSeen();
    },
    async searchRequest() {
      this.loadingState = true;
      await this.searchRequestForNewResults();
      this.loadingState = false;
      this.resultsShown = true;
    },
  },
  async created() {
    this.availableCountries = await loadCountries();
    this.availablePaymentOptions = await loadPaymentTypes();
    this.availableOperationalAreas = await loadOperationalAreas();
    this.availableLanguages = await loadProgrammingLanguages();
  },
  async mounted() {
    this.previousSearchResults = await this.getInternshipsOfCompaniesSeen() || [];
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
