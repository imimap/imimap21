<template>
  <div class="d-flex justify-content-center pb-3">
    <div class="mt-1">
      Zeige mir Praktika im
      <select v-model="this.selectedSemester" name="semester_id" id="semester_select">
        <option value="">All</option>
        <option value="ws2122">WS 21/22</option>
        <option value="SS21">SS 21</option>
        <option value="ws2021">WS 20/21</option>
        <option value="ws1920">WS 19/20</option>
      </select>
    </div>
  </div>
  <Map :locations="this.locations"></Map>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Map from '@/components/Map.vue';
import http from '@/utils/http-common';

export default defineComponent({
  name: 'Home',
  components: { Map },
  methods: {
    async getInternshipLocations() {
      try {
        const res = await http.get('/internship-modules/', { params: { semester: this.selectedSemester } });
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    },
  },
  data() {
    return {
      selectedSemester: '',
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
  created() {
    this.getInternshipLocations();
  },
});
</script>
