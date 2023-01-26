<template>
  <div class="container">
    <div v-show="amountOfCompaniesSeen >= 12" id="form-block4" class="text-left mt-5 mx-3">
    <p>Sorry, du hast all deine Verusche aufgebraucht! Bitte wende dich an die Praktikumsverwaltung, falls du dein Limit zurücksetzen musst.</p>
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
              <button class="btn btn-htw-green"
                      v-on:click="searchOrShowModal()">
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
    <!-- Too many results modal -->
    <too-many-results :amount-of-results="amountOfResults"
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
         v-if="!loadingState && resultCount <= 0 && previousResultCount <= 0">
      {{ $t("search.results.noResults") }}
    </div>
    <div id="form-block4" class="mx-3 my-3"
         v-if="!loadingState && (resultCount > 0 || previousResultCount > 0)">
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
      <!-- <div id="previous-search-results" class="search_results"
           v-if="!cardToggle && previousResultCount > 0">
        <SearchResultList
          :result-count="previousResultCount"
          :search-results="previousSearchResults"
          :result-count-text="'search.results.previousResultCount'">
        </SearchResultList>
      </div> -->
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
import http from '@/utils/http-common';
import { Internship } from '@/store/types/Internship';
import { MapLocation } from '@/store/types/MapLocation';
import SearchResultList from '@/components/search/SearchResultList.vue';
import TooManyResults from '@/components/search/TooManyResults.vue';
import { showErrorNotification } from '@/utils/notification';
import { Modal } from 'bootstrap';

export default defineComponent({
  name: 'Search',
  components: { SearchResultList, Map, TooManyResults },
  data() {
    return {
      // Available filters after query
      availableCountries: null,
      availablePaymentOptions: null,
      availableOperationalAreas: null,
      availableLanguages: null,
      // Searchresults after query
      searchResults: [] as Internship[],
      previousSearchResults: [] as Internship[] || [],
      // Selected filters
      paymentFilter: null,
      countryFilter: null,
      languageFilter: null,
      operationalAreaFilter: null,
      // Component state
      cardToggle: false,
      loadingState: true,
      amountOfResults: 0,
      amountOfCompaniesSeen: 0,
      resultsShown: false,
    };
  },

  computed: {
    resultCount(): number {
      return this.searchResults.length;
    },
    previousResultCount(): number {
      if (this.previousSearchResults.length > 0) return this.previousSearchResults.length;
      return 0;
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
      const amountSeen = await this.getAmountOfSeenResults();
      const possibleResults = await this.getAmountOfPossibleResults();
      if (amountSeen !== undefined && amountSeen < 12 && possibleResults !== undefined && possibleResults > 0) {
        this.amountOfResults = possibleResults;
        this.amountOfCompaniesSeen = amountSeen;
        this.modal.show();
      } else {
        this.modal.hide();
        await this.searchRequest();
      }
    },
    async getAvailableCountries() {
      try {
        const res = await http.get('/info/countries');
        this.availableCountries = await res.data;
      } catch (err: any) { // Todo: Ersetzen durch util showErrorMessage
        await showErrorNotification(`Fehler beim Laden der verfügbaren Länder [ERROR: ${err.message}]`);
      }
    },
    async getAvailablePaymentOptions() {
      try {
        const res = await http.get('/info/payment-types');
        this.availablePaymentOptions = res.data;
      } catch (err: any) {
        await showErrorNotification(`Fehler beim Laden der verfügbaren Bezahlungsmodelle [ERROR: ${err.message}]`);
      }
    },
    async getAvailableOrientations() {
      try {
        const res = await http.get('/info/operational-areas');
        this.availableOperationalAreas = res.data;
      } catch (err: any) {
        await showErrorNotification(`Fehler beim Laden der verfügbaren Bereiche [ERROR: ${err.message}]`);
      }
    },
    async getAvailableLanguages() {
      try {
        const res = await http.get('/info/programming-languages');
        this.availableLanguages = res.data;
      } catch (err: any) {
        await showErrorNotification(`Fehler beim laden der verfügbaren Programmiersprachen [ERROR: ${err.message}]`);
      }
    },
    async getAmountOfPossibleResults(): Promise<number | undefined> {
      let amount: number | PromiseLike<number>;
      try {
        const res = await http.get('/companies/possibleResults/amount', {
          params: {
            country: this.countryFilter,
            operationalArea: this.operationalAreaFilter,
            programmingLanguage: this.languageFilter,
            paymentType: this.paymentFilter,
          },
        });
        amount = await res.data;

        return amount;
      } catch (err: any) { // Todo: Ersetzen durch util showErrorMessage
        await showErrorNotification(`Fehler beim Laden der neuen Suchergebnisse [ERROR: ${err.message}]`);
      }
      return undefined;
    },
    async getAmountOfSeenResults(): Promise<number | undefined> {
      let amount: number | PromiseLike<number>;
      try {
        const res = await http.get('/companies/seen/amount'); // TODO
        amount = await res.data;
        return amount;
      } catch (err: any) { // Todo: Ersetzen durch util showErrorMessage
        await showErrorNotification(`Fehler beim Laden der vorherigen Suchergebnisse [ERROR: ${err.message}]`);
      }
      return undefined;
    },
    // async searchRequestForPreviousResults() {
    //   try {
    //     this.previousSearchResults = await this.getSearchResults(true);
    //   } catch (err: any) {
    //     await showErrorNotification(`Fehler beim Durchsuchen der vorherigen Suchergebnisse [ERROR: ${err.message}]`);
    //   }
    // },
    async searchRequestForNewResults() {
      try {
        this.searchResults = await this.getSearchResults();
        const getInternshipsOfCompaniesSeen = await this.getInternshipsOfCompaniesSeen();
        console.log('mietz', getInternshipsOfCompaniesSeen);

        this.previousSearchResults = getInternshipsOfCompaniesSeen || [];// TODO check if correct
      } catch (err: any) {
        await showErrorNotification(`Fehler beim Suchen nach neuen Suchergebnisse [ERROR: ${err.message}]`);
      }
    },
    async getInternshipsOfCompaniesSeen() {
      let internships: Internship[];
      const amountSeen = await this.getAmountOfSeenResults();

      if (!amountSeen || amountSeen === 0) return [];
      this.amountOfCompaniesSeen = amountSeen;

      try {
        const res = await http.get('/companies/seen/results'); // TODO
        internships = await res.data;
        console.log('here', internships);
        return internships;
      } catch (err: any) { // Todo: Ersetzen durch util showErrorMessage
        await showErrorNotification(`Fehler beim Laden der vorherigen Suchergebnisse [ERROR: ${err.message}]`);
      }
      return undefined;
    },
    async searchRequest() {
      this.loadingState = true;
      // await this.searchRequestForPreviousResults();
      await this.searchRequestForNewResults();
      this.loadingState = false;
      this.resultsShown = true;
    },
    async getSearchResults() {
      try {
        const res = await http.get('/internships', {
          params: {
            country: this.countryFilter,
            operationalArea: this.operationalAreaFilter,
            programmingLanguage: this.languageFilter,
            paymentType: this.paymentFilter,
          },
        });

        return res.data;
      } catch (err: any) {
        throw new Error(`Fehler beim Suchen nach Praktika [ERROR: ${err.message}]`);
      }
    },
  },
  created() {
    this.getAvailableCountries();
    this.getAvailablePaymentOptions();
    this.getAvailableOrientations();
    this.getAvailableLanguages();
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
