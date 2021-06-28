<template>
  <LoginComponent></LoginComponent>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoginComponent from '@/components/LoginComponent.vue';

export default defineComponent({
  name: 'Login',
  data() {
    return {
      user: false,
    };
  },
  components: {
    LoginComponent,
  },
});
</script>

<style lang="scss">

</style>
