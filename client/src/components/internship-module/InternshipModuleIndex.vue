<template>
  <template v-if="loadingState !== true && internshipModule !== null">
    <!-- Kein Praktikum gefunden -->
    <no-complete-internship
      v-if="internshipModule.status === 'unknown' || hasPostponements"
    ></no-complete-internship>
    <!-- Kein Praktikum aber Verschiebungen -->
    <postponements-list v-if="hasPostponements" v-bind:postponements="postponements" />
    <!-- Praktikum gefunden -->
    <complete-internship v-else></complete-internship>
  </template>
</template>

<script>
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
  data() {
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
    postponements() {
      return this.internshipModule.events.filter((event) => event.changes?.newSemester);
    },
    hasPostponements() {
      return this.postponements.length > 0;
    },
  },
});
</script>

<style scoped>

</style>
