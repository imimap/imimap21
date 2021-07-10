<template>
  <div class="container-fluid">
    <template v-if="loadingState !== true && internshipModule !== null">
      <!-- Kein Praktikum gefunden -->
      <no-complete-internship
        v-if="internshipModule.status === 'unknown'"
      ></no-complete-internship>
      <!-- Praktikum gefunden -->
      <complete-internship v-else ></complete-internship>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NoCompleteInternship from '@/components/internship-module/NoInternshipModule.vue';
import CompleteInternship from '@/components/internship-module/InternshipModule.vue';
import http from '@/utils/http-common';

export default defineComponent({
  name: 'InternshipModule',
  components: {
    NoCompleteInternship,
    CompleteInternship,
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
});
</script>

<style scoped>

</style>
