<template>
  <template v-if="!loadingState && internshipModule !== null">
    <!-- Kein Praktikum gefunden -->
    <no-complete-internship
      v-if="internshipModule!.status === 'unknown'"
    />
    <!-- Kein Praktikum aber Verschiebungen -->
    <postponements-list v-if="hasRequestedPostponements" :postponementEvents="postponements"/>
    <!-- Praktikum gefunden -->
    <complete-internship
      v-if="internshipModuleHasBeenPlanned"
      :internshipModule="internshipModule!"
      @replaceInternship="replaceInternship"
      @getUserInternship="getUserInternship"
    />
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { InternshipModule } from '@/store/types/InternshipModule';
import { Event } from '@/store/types/Event';
import { Internship } from '@/store/types/Internship';
import { getAuthUserInternship } from '@/utils/gateways';
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
  data() {
    return {
      loadingState: true,
      internshipModule: null as InternshipModule | null,
    };
  },
  methods: {
    async getUserInternship() {
      this.internshipModule = await getAuthUserInternship();
      this.loadingState = false;
    },
    replaceInternship(newInternship: Internship) {
      if (this.internshipModule === null) return;

      const index = this.internshipModule.internships.findIndex(
        (internship) => internship._id === newInternship._id,
      );
      this.internshipModule.internships.splice(index, 1, newInternship);
    },
  },
  created() {
    this.getUserInternship();
  },
  computed: {
    // @TODO: postponement requested, postponement rejected, ansonsten als planned gekennzeichnet
    // @TODO: Die Option zum erstellen eines Postponements sollte es immer geben
    postponements(): Event[] {
      if (!this.internshipModule) return [];
      return this.internshipModule.events.filter((event) => event.type === 'internshipModule.postponement');
    },
    hasRequestedPostponements(): boolean {
      return this.postponements.length > 0;
    },
    internshipModuleHasBeenPlanned(): boolean {
      if (!this.internshipModule) return false;
      return this.internshipModule.events.filter((event) => event.changes.status?.includes('planned')).length > 0;
    },
  },
});
</script>

<style scoped>

</style>
