<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LayoutFullscreen',
  beforeCreate() {
    this.$i18n.locale = this.$route.params.locale as string;
  },
});
</script>

<style lang="scss">

</style>
