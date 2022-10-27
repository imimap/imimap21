<template>
  <div class="d-flex justify-content-center pb-3">
    <div class="mt-1">
      {{ $t("home.showResults") }}
      <select v-model="selectedSemester" v-on:change="search">
        <option value="">All</option>
        <option v-for="(semester, index) in availableSemesters"
                v-bind:key="index"
        >
          {{ semester }}
        </option>
      </select>
    </div>
  </div>
  <Map v-if="!loadingState" :locations="searchResults"></Map>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Map from '@/components/Map.vue';
import http from '@/utils/http-common';
import { MapLocation } from '@/store/types/MapLocation';
import { loadAvailableSemesters } from '@/utils/gateways';

export default defineComponent({
  name: 'Home',
  components: { Map },
  data() {
    return {
      selectedSemester: '',
      loadingState: false,
      searchResults: [] as MapLocation[],
      availableSemesters: [] as string[],
    };
  },
  methods: {
    async search() {
      await this.searchInternshipBySemester();
    },
    async searchInternshipBySemester() {
      this.loadingState = true;
      try {
        const res = await http.get('/internships/locations', { params: { semester: this.selectedSemester } });
        this.searchResults = await res.data;
        this.loadingState = false;
      } catch (err: any) {
        await this.$store.dispatch('addNotification', {
          text: `Fehler beim Suchen der Praktika [ERROR: ${err.message}]`,
          type: 'danger',
        });
        this.loadingState = false;
      }
    },
  },
  async created() {
    this.availableSemesters = await loadAvailableSemesters();
    await this.searchInternshipBySemester();
  },
});
</script>
<style lang="scss">
footer {
  margin-top: 20px;
}
</style>
