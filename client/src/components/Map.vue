<template>
  <div id="mapContainer"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Map, Marker, TileLayer } from 'leaflet';
import { MapLocation } from '@/store/types/MapLocation';

export default defineComponent({
  name: 'Map',
  props: {
    locations: {
      type: [] as PropType<MapLocation[]>,
      default: [],
    },
  },
  data() {
    return {
      map: {} as Map,
      markers: [] as Marker[],
    };
  },
  mounted() {
    this.setupLeafletMap();
  },
  watch: {
    locations: {
      deep: true,
      handler() {
        this.removeLocationMarkers();
        this.addLocationMarkers();
      },
    },
  },
  methods: {
    setupLeafletMap() {
      this.map = new Map('mapContainer').setView([55, 0], 2);

      new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(this.map as Map);

      this.addLocationMarkers();
    },
    removeLocationMarkers() {
      this.markers.forEach((marker) => this.map.removeLayer(marker as Marker));
      this.markers = [];
    },
    addLocationMarkers() {
      if (!this.locations) return;
      this.locations.forEach((location) => {
        const marker = new Marker([location.coordinates.latitude, location.coordinates.longitude])
          .bindPopup(location.city)
          .addTo(this.map as Map);
        this.markers.push(marker);
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
