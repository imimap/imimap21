<template>
  <p style="text-align: center; margin-top: 150px;">
    <strong>
      <span style="font-family: Arial, Helvetica, sans-serif; font-size: 18px;">
        Bericht über das Fachpraktikum
      </span>
    </strong>
  </p>
  <br>
  <br>
  <br>
  <br>
  <table
    style="margin-left: auto;margin-right: auto;">
    <tbody>
    <tr style="border: none;">
      <td>
        <strong>
          <span style="font-family: Arial, Helvetica, sans-serif;">
            Zeitraum des Fachpraktikums
          </span>
        </strong>
      </td>
      <td>
        <span style="font-family: Arial, Helvetica, sans-serif;">
          {{ inSemester }}  / von {{ getDateString(startDate) }} bis {{ getDateString(endDate) }}
        </span>
      </td>
    </tr>
    <tr>
      <td>
        <span style="font-family: Arial, Helvetica, sans-serif;">
          <strong>
            Vorname, Nachname:
          </strong>
        </span>
      </td>
      <td>
        <span style="font-family: Arial, Helvetica, sans-serif;">
          {{ firstName }}, {{ lastName }}
        </span>
      </td>
    </tr>
    <tr>
      <td>
        <span style="font-family: Arial, Helvetica, sans-serif;">
          <strong>
            Matrikelnummer:
          </strong>
        </span>
      </td>
      <td>
        <span style="font-family: Arial, Helvetica, sans-serif;">
          {{ matriculation }}
        </span>
      </td>
    </tr>
    <tr>
      <td>
        <span style="font-family: Arial, Helvetica, sans-serif;">
          <strong>
            Studiengang, Fachbereich:
          </strong>
        </span>
      </td>
      <td>
        <span style="font-family: Arial, Helvetica, sans-serif;">
          IMI (B), FB 4
        </span>
      </td>
    </tr>
    <tr>
      <td>
        <strong>
          <span style="font-family: Arial, Helvetica, sans-serif;">
            Mail:
          </span>
        </strong>
      </td>
      <td>
        {{ emailStudent }}
      </td>
    </tr>
    </tbody>
  </table>
  <br>
  <br>
  <br>
  <br>
  <table style="margin-left: auto;margin-right: auto;">
    <tbody>
    <tr>
      <td>
        <strong>
          <span style="font-family: Arial, Helvetica, sans-serif;">
            Ausbildungsplatz:
          </span>
        </strong>
      </td>
      <td>
        <span style="font-family: Arial, Helvetica, sans-serif;">
          "{{ companyName }}"
        </span>
      </td>
    </tr>
    <tr>
      <td>
        <strong>
          <span style="font-family: Arial, Helvetica, sans-serif;">
            Anschrift:
          </span>
        </strong>
      </td>
      <td>
        {{ address }}
      </td>
    </tr>
    </tbody>
  </table>
  <br>
  <br>
  <br>
  <br>
  <table style="margin-left: auto;margin-right: auto;">
    <tbody>
    <tr>
      <td>
        <strong>
          <span style="font-family: Arial, Helvetica, sans-serif;">
            Ansprechpartner*in :
          </span>
        </strong>
      </td>
      <td>
        <span style="font-family: Arial, Helvetica, sans-serif;">
          {{ supervisor }}
        </span>
      </td>
    </tr>
    <tr>
      <td>
        <strong>
          <span style="font-family: Arial, Helvetica, sans-serif;">
            Mail:
          </span>
        </strong>
      </td>
      <td>
        {{ emailSupervisor }}
      </td>
    </tr>
    </tbody>
  </table>
  <br>
  <br>
  <br>
  <br>
  <table style="margin-left: auto;margin-right: auto;">
    <tbody>
    <tr>
      <td>
        <strong>
          <span style="font-family: Arial, Helvetica, sans-serif;">
            Datum und Unterschrift der/des Studierenden
          </span>
        </strong>
      </td>
      <td>
        <strong>
          <span style="font-family: Arial, Helvetica, sans-serif;">
            &nbsp;&nbsp;&nbsp;&nbsp;Datum und Unterschrift der Firma
          </span>
        </strong>
      </td>
    </tr>
    </tbody>
  </table>
  <p style="page-break-after: always;">&nbsp;</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getDateString } from '@/utils/admin';

export default defineComponent({
  name: 'templateGerman',
  data() {
    return {
      inSemester: '',
      startDate: '',
      endDate: '',
      firstName: '',
      lastName: '',
      matriculation: '',
      emailStudent: '',
      companyName: '',
      operationalArea: '',
      address: '',
      supervisor: '',
      emailSupervisor: '',
    };
  },
  methods: {
    getDateString,
  },
});
</script>

<style scoped>
table, tr, td {
  border: none;
}
</style>
