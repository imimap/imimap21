<template>
  <div class="container-fluid">
    <!-- Kein Praktikum gefunden -->
    <NoCompleteInternshipComponent></NoCompleteInternshipComponent>
    <!-- Praktikum gefunden -->
    <CompleteInternshipComponent></CompleteInternshipComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NoCompleteInternshipComponent from '@/components/internship-module/NoInternshipModuleComponent.vue';
import CompleteInternshipComponent from '@/components/internship-module/InternshipModuleComponent.vue';

export default defineComponent({
  name: 'InternshipModule',
  components: {
    NoCompleteInternshipComponent,
    CompleteInternshipComponent,
  },
  data() {
    return {
      completeInternship: {},
    };
  },
});
</script>

<style scoped>

</style>
