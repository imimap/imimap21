<template>
  <div class="card border-htw-green">
    <div class="card-header">
      <h5 class="card-title " id="h5_block">Praktikum @
        Hasse UG</h5>
    </div>
    <div class="card-body">
      <div class="card mb-3 p-0">
        <div class="card-body pt-3 pb-0">
          <p class="card-text">
            <strong> Informationen </strong>
          </p>
          <table class="table table-striped table-sm table-borderless">
            <tbody>
            <tr>
              <td style="width:20%">
                Semester
              </td>
              <td>
                <!-- @TODO: inSemester am internship fehlt -->
                5
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Anfangsdatum
              </td>
              <td>
                {{ startDate }}
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Enddatum
              </td>
              <td>
                {{ internship.endDate }}
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Dauer
              </td>
              <td>
                lang genug für ein Teilpraktikum (13.86 Wochen)
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Einsatzgebiet
              </td>
              <td>
                {{ internship.operationalArea }}
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Aufgaben
              </td>
              <td>
                {{ internship.tasks }}
              </td>
            </tr>
            </tbody>
          </table>

        </div>
      </div>
      <div class="card mb-3 p-0">
        <div class="card-body pt-3 pb-0">
          <p class="card-text">
            <strong> Statusübersicht </strong>
          </p>
          <table class="table table-striped table-sm table-borderless">
            <tbody>
            <tr>
              <td style="width:20%">
                Status der Anmeldung
              </td>
              <td>
                 13
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Status des Vertrags
              </td>
              <td>
                 6
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Status des Berichts
              </td>
              <td>
                Dein Bericht ist noch nicht bei uns eingetroffen.
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Status des Zertifikats
              </td>
              <td>
                7
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Status des Praktikums
              </td>
              <td>
                 6
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Kommentar
              </td>
              <td>
                Life? Don't talk to me about life.
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="my-3">
        <router-link :to="{ name: 'EditInternship', params: { id: this.internship._id } }">
          Bearbeiten
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'Internship',
  props: {
    internship: {} as PropType<{[key: string]: any}>,
  },
  computed: {
    startDate(): Date | null {
      return this.internship != null ? new Date(this.internship.startDate) : null;
    },
  },
});
</script>

<style lang="scss">

</style>
