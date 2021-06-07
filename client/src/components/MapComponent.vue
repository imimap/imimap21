<template>
  <div id="mapContainer"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  Map, Marker, Popup, TileLayer,
} from 'leaflet';

export default defineComponent({
  name: 'MapComponent',
  props: ['locations'],
  data() {
    return {
      parsedLocations: this.getLocations,
    };
  },
  mounted() {
    this.setupLeafletMap();
  },
  computed: {
    getLocations(): { city: string; lat: number; lng: number }[] {
      return JSON.parse(JSON.stringify(this.locations));
    },
  },
  methods: {
    setupLeafletMap() {
      const container = new Map('mapContainer').setView([55, 0], 2);
      console.log('setupLeafletMap executed');

      new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(container);
      const popup = new Popup();

      function onMapClick(e) {
        popup
          .setLatLng(e.latlng)
          .setContent(`You clicked the map at ${e.latlng.toString()}`)
          .openOn(container);
      }
      container.on('click', onMapClick);
      this.locations.forEach((location) => {
        new Marker([location.lat, location.lng])
          .bindPopup(location.city)
          .addTo(container);
      });
    },
  },
});
</script>

<style lang="scss" scoped>
#mapContainer {
  height: 500px;
}
</style>
