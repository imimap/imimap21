<template>
  <div class="d-flex justify-content-center pb-3">
    <div class="mt-1">
      Zeige mir Praktika im
      <select name="semester_id" id="semester_select" class="chzn-select">
        <option value="-1">All</option>
        <option value="5">WS 21/22</option>
        <option selected="selected" value="4">SS 21</option>
        <option value="6">WS 20/21</option>
        <option value="7">WS 19/20</option>
      </select>
    </div>
  </div>
  <div id="map">
    <l-map
      v-model:zoom="zoom"
      :center="[45, 40]"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        :attribution="attribution"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>

      <template
        v-for="(location, index) in locations"
        v-bind:location="location"
        v-bind:key="index"
      >
        <l-marker :lat-lng="[location.lat, location.lng]">
          <l-tooltip>
            {{ location.city }}
          </l-tooltip>
        </l-marker>
      </template>

    </l-map>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  LMap, LTileLayer, LMarker, LTooltip,
} from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';

export default defineComponent({
  name: 'Home',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
  },
  data() {
    return {
      zoom: 3,
      center: [65, 125],
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      locations: [
        { city: 'Cordesfeld, Türkei', lat: 45.710104134368976, lng: 121.99267841926189 },
        { city: 'Bad Timmberg, Irland', lat: 74.21327053768769, lng: 13.116135124688158 },
        { city: 'Süd Yvonneburg, Paraguay', lat: 44.03991137006575, lng: 123.41142179083323 },
        { city: 'Süd Ryan, San Marino', lat: -62.29543725687513, lng: 56.42148686469456 },
        { city: 'Liviaberg, Malediven', lat: -52.42357507892453, lng: -110.79512989239608 },
        { city: 'Preyhagen, Malaysia', lat: 50.29290286464618, lng: 163.48467247061268 },
      ],
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
