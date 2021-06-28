<template>
  <HeaderComponent></HeaderComponent>
  <main class="margin_bottom_10">
    <router-view></router-view>
  </main>
  <footer-component></footer-component>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';

export default defineComponent({
  name: 'Layout',
  data() {
    return {
      user: false,
    };
  },
  components: {
    HeaderComponent,
    FooterComponent,
  },
  beforeCreate() {
    this.$i18n.locale = this.$route.params.locale as string;
  },
});
</script>

<style lang="scss">

</style>
