<template>
  <div class="d-flex justify-content-center pb-3">
    <div class="mt-1">
      Zeige mir Praktika im
      <select v-model="selectedSemester" v-on:change="search">
        <option value="" selected="true">All</option>
        <option value="WS2021">WS 21/22</option>
        <option value="SS2022">SS 21</option>
        <option value="WS2022">WS 22/23</option>
        <option value="SS2023">SS 23</option>
      </select>
    </div>
  </div>
  <Map v-if="!loadingState && locations.length > 0" :locations="locations"></Map>
  <div class="container" v-if="!loadingState && searchResults.length == 0">
    <div id="form-block4">
      <div class="alert alert-primary">
        <small>
          <strong>Achtung!</strong> Es wurden keine Praktika gefunden
        </small>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Map from '@/components/Map.vue';
import http from '@/utils/http-common';
import { Address } from '@/store/types/Address';
import { Internship } from '@/store/types/Internship';

export default defineComponent({
  name: 'Home',
  components: { Map },
  data() {
    return {
      selectedSemester: '',
      loadingState: false,
      searchResults: [] as Internship[],
    };
  },
  computed: {
    locations(): Address[] {
      return this.searchResults.length > 0
        ? this.searchResults.map((searchResult) => searchResult.company.address)
        : [];
    },
  },
  methods: {
    async search() {
      await this.searchInternshipBySemester();
    },
    async searchInternshipBySemester() {
      this.loadingState = true;
      try {
        const res = await http.get('/internships', { params: { semester: this.selectedSemester, seen: false } });
        this.searchResults = await res.data;
        this.loadingState = false;
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `Fehler beim Suchen der Praktika [ERROR: ${err.message}]`,
          type: 'danger',
        });
        this.loadingState = false;
      }
    },
  },
  async created() {
    await this.searchInternshipBySemester();
  },
});
</script>
