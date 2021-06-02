<template>
  <h2>Home View</h2>
  <div id="map">
    <l-map
      v-model:zoom="zoom"
      :center="[52.52, 13.405]"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        :attribution="attribution"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
    </l-map>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';

export default defineComponent({
  name: 'Home',
  components: {
    LMap,
    LTileLayer,
  },
  data() {
    return {
      zoom: 11,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    };
  },
  method: {
    log(a: string) {
      console.log(a);
    },
  },
});
</script>

<style lang="scss" scoped>
#map {
  height: 500px;
}
</style>
