<template>
  <template v-if="loadingState !== true && internshipModule !== null">
    <!-- Kein Praktikum gefunden -->
    <template v-if="internshipModule.status === 'unknown' || hasRequestedPostponements">
      <no-complete-internship></no-complete-internship>
      <!-- Kein Praktikum aber Verschiebungen -->
      <postponements-list v-if="hasRequestedPostponements" v-bind:postponements="postponements" />
    </template>
    <!-- Praktikum gefunden -->
    <complete-internship v-else v-bind:internshipModule="internshipModule"></complete-internship>
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import http from '@/utils/http-common';
import NoCompleteInternship from './NoInternshipModule.vue';
import CompleteInternship from './InternshipModule.vue';
import PostponementsList from './PostponementsList.vue';

export default defineComponent({
  name: 'InternshipModuleIndex',
  components: {
    NoCompleteInternship,
    CompleteInternship,
    PostponementsList,
  },
  data(): any {
    return {
      loadingState: true,
      internshipModule: null,
    };
  },
  methods: {
    async getUserInternship() {
      try {
        const res = await http.get('/internship-modules/my');
        this.internshipModule = {
          ...res.data,
        };
        this.loadingState = false;
      } catch (err) {
        console.log(err);
      }
    },
  },
  created() {
    this.getUserInternship();
  },
  computed: {
    postponements(): any {
      return this.internshipModule.events.filter((event) => event.changes?.newSemester);
    },
    hasRequestedPostponements(): boolean {
      return this.postponements.length > 0 && this.internshipModule.events.filter((event) => event.changes?.status !== 'planned').length > 0;
    },
    hasInternships(): boolean {
      return this.internshipModule.internships.length > 0;
    },
  },
});
</script>

<style scoped>

</style>
