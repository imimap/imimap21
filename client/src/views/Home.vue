<template>
  <div class="d-flex justify-content-center pb-3">
    <div class="mt-1">
      Zeige mir Praktika im
      <select v-model="selectedSemester" v-on:change="searchInternshipBySemester">
        <option value="">All</option>
        <option value="WS2020">WS 20/21</option>
        <option value="SS2020">SS 20</option>
        <option value="WS2021">WS 21/22</option>
        <option value="SS2022">SS 21</option>
      </select>
    </div>
  </div>
  <Map v-if="!loadingState && locations.length > 0" :locations="locations"></Map>
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
      selectedSemester: null,
      loadingState: true,
      searchResults: [] as Internship[],
    };
  },
  computed: {
    locations(): Address[] | null {
      if (this.searchResults.length === 0) return null;
      return this.searchResults.map((searchResult) => searchResult.company.address);
    },
  },
  methods: {
    async searchInternshipBySemester() {
      this.loadingState = true;
      try {
        const res = await http.get('/internships', { params: { semester: this.selectedSemester } });
        this.searchResults = await res.data;
        this.loadingState = false;
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `Fehler beim Suchen der Praktika [ERROR: ${err.message}]`,
          type: 'danger',
        });
      }
    },
  },
  async created() {
    await this.searchInternshipBySemester();
  },
});
</script>
