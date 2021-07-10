<template>
  <div class="container-fluid">
    <template v-if="loadingState !== true && internshipModule !== null">
      <!-- Kein Praktikum gefunden -->
      <NoCompleteInternshipComponent
        v-if="internshipModule.status === 'unknown'"
      ></NoCompleteInternshipComponent>
      <!-- Praktikum gefunden -->
      <CompleteInternshipComponent v-else ></CompleteInternshipComponent>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NoCompleteInternshipComponent from '@/components/internship-module/NoInternshipModuleComponent.vue';
import CompleteInternshipComponent from '@/components/internship-module/InternshipModuleComponent.vue';
import http from '@/utils/http-common';

export default defineComponent({
  name: 'InternshipModule',
  components: {
    NoCompleteInternshipComponent,
    CompleteInternshipComponent,
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
