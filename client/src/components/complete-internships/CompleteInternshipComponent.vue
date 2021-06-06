<template>
  <div id="form-block4" class="text-left">
    <h4>Onur Stoll's Praktikum im SS 21 (4. Fachsemester)</h4>
    <br>

    <div class="mb-5">
    </div>

    <div class="card mt-3 mb-3">
      <div class="card-body">
        <p class="card-text">

        </p>
        <table class="table table-sm table-borderless">
          <thead>
          <tr>
            <th scope="col" colspan="2">Modulnummer</th>
            <th scope="col">Modulname</th>
            <th scope="col">Status</th>
          </tr>
          </thead>
          <thead>
          <tr>
            <th scope="col" colspan="4"></th>
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

        <p></p>
      </div>
    </div>

    <div class="card-deck">
      <InternshipPartComponent></InternshipPartComponent>
    </div>
    <!--<strong></strong>-->
    <br>
    <a href="/de/internships/new">Weiteres Teilpraktikum eintragen.</a>
    <br><br><br>
    <a href="/de/complete_internships/80/edit">Bearbeiten</a>
    |
    <a href="javascript:history.back()">Zurück</a>
  </div>
</template>

<script  lang="ts">
import { defineComponent } from 'vue';
import InternshipPartComponent from '@/components/complete-internships/InternshipPartComponent.vue';

export default defineComponent({
  name: 'CompleteInternshipComponent',
  components: {
    InternshipPartComponent,
  },
});
</script>

<style lang="scss">

</style>
