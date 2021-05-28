<template>
  <div id="form-block4" class="text-left">
    <h4>Onur Stoll's Praktikum im SS 21 (4. Fachsemester)</h4>
    <div class="mb-5"></div>

    <div class="card mt-3 mb-3">
      <div class="card-body">
        <table class="table table-sm table-borderless">
          <thead>
          <tr>
            <th scope="col" colspan="2">Modulnummer</th>
            <th scope="col">Modulname</th>
            <th scope="col">Status</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th scope="row" colspan="2">B20</th>
            <td>Praxisphase 1: Fachpraktikum im Ausland</td>
            <td>
              noch offen
            </td>
          </tr>
          <tr>
            <th></th>
            <th scope="row">B20.1</th>
            <td>Auswertung von Erfahrungen am Praxisplatz</td>
            <td>noch offen</td>
          </tr>
          <tr>
            <th></th>
            <th scope="row">B20.2</th>
            <td>Fachpraktikum</td>
            <td>noch offen</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card-deck">
      <InternshipComponent></InternshipComponent>
    </div>
    <div class="mt-3 mb-5"><a href="/de/internships/new">Weiteres Teilpraktikum eintragen.</a></div>
    <div>
      <a href="/de/complete_internships/80/edit">Bearbeiten</a>
      |
      <a href="javascript:history.back()">Zurück</a>
    </div>
  </div>
</template>

<script  lang="ts">
import { defineComponent } from 'vue';
import InternshipComponent from '@/components/internship-module/InternshipComponent.vue';

export default defineComponent({
  name: 'InternshipModuleComponent',
  components: {
    InternshipComponent,
  },
});
</script>

<style lang="scss">

</style>
