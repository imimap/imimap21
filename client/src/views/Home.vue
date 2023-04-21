<template>
  <div class="d-flex justify-content-center pb-3">
    <div class="mt-1">
      {{ $t("home.showResults") }}
      <select v-model="selectedSemester" v-on:change="getInternships">
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
import { MapLocation } from '@/store/types/MapLocation';
import { getInternshipsInSemester, loadAvailableSemesters } from '@/utils/gateways';

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
    async getInternships() {
      this.loadingState = true;
      this.searchResults = await getInternshipsInSemester(this.selectedSemester);
      this.loadingState = false;
    },
  },
  async created() {
    console.log('created home component');
    this.availableSemesters = await loadAvailableSemesters();
    await this.getInternships();
  },
});
</script>
<style lang="scss">
footer {
  margin-top: 20px;
}
</style>
