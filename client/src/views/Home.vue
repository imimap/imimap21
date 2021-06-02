<template>
  <h2>Home View</h2>
  <l-map
    v-model="zoom"
    v-model:zoom="zoom"
    :center="[47.41322, -1.219482]"
    @move="log('move')"
  >
  </l-map>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LMap } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';

export default defineComponent({
  name: 'Home',
  components: {
    LMap,
  },
  data() {
    return {
      zoom: 2,
    };
  },
  method: {
    log(a: string) {
      console.log(a);
    },
  },
});
</script>

<style lang="scss">

</style>
