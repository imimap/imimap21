<template>
  <template v-if="loadingState !== true && internshipModule !== null">
    <!-- Kein Praktikum gefunden -->
    <no-complete-internship v-if="internshipModule.status === 'unknown'"/>
    <!-- Kein Praktikum aber Verschiebungen -->
    <postponements-list v-if="hasRequestedPostponements" v-bind:postponements="postponements"/>
    <!-- Praktikum gefunden -->
    <complete-internship v-if="internshipModuleHasBeenPlanned"
                         v-bind:internshipModule="internshipModule"
                          v-on:replaceInternship="replaceInternship"/>
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { InternshipModule } from '@/store/types/InternshipModule';
import { Event } from '@/store/types/Event';
import http from '@/utils/http-common';
import { Internship } from '@/store/types/Internship';
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
  // @TODO: Type Interfaces deklarieren
  data() {
    return {
      loadingState: true,
      internshipModule: {} as InternshipModule,
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
      } catch (err: any) {
        console.log(err);
      }
    },
    replaceInternship(newInternship: Internship) {
      console.log(newInternship);
      if (typeof this.internshipModule !== 'undefined') {
        console.log(newInternship._id);
        const index = this.internshipModule.internships.findIndex(
          (internship) => internship._id === newInternship._id,
        );
        console.log(index);
        this.internshipModule.internships.splice(
          index,
          1,
          newInternship,
        );
      }
    },
  },
  created() {
    this.getUserInternship();
  },
  computed: {
    // @TODO: postponement requested, postponement rejected, ansonsten als planned gekennzeichnet
    // @TODO: Die Option zum erstelen eines Postponements sollte es immer geben
    loadingStateComputed(): boolean {
      return this.loadingState;
    },
    postponements(): Event[] {
      return this.internshipModule.events.filter((event) => event.changes.status.includes('postponement'));
    },
    plannedInternshipModules(): Event[] {
      return this.internshipModule.events.filter((event) => event.changes.status.includes('planned'));
    },
    hasRequestedPostponements(): boolean {
      return this.postponements.length > 0;
    },
    internshipModuleHasBeenPlanned(): boolean {
      return this.plannedInternshipModules.length > 0;
    },
    hasInternships(): boolean {
      return this.internshipModule.internships.length > 0;
    },
  },
});
</script>

<style scoped>

</style>
