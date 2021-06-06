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
import NoCompleteInternshipComponent from '@/components/complete-internships/NoCompleteInternshipComponent.vue';
import CompleteInternshipComponent from '@/components/complete-internships/CompleteInternshipComponent.vue';

export default defineComponent({
  name: 'CompleteInternship',
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
