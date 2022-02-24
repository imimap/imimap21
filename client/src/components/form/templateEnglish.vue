<template>
   <p style="text-align: center; margin-top: 150px;">
    <strong>
      <span style="font-family: Arial, Helvetica, sans-serif; font-size: 18px;">
        Report on the specialized internship
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
            Period of the specialized internship:
          </span>
        </strong>
      </td>
      <td>
        <span style="font-family: Arial, Helvetica, sans-serif;">
          {{ inSemester }}  / from {{ getDateString(startDate) }} to {{ getDateString(endDate) }}
        </span>
      </td>
    </tr>
    <tr>
      <td>
        <span style="font-family: Arial, Helvetica, sans-serif;">
          <strong>
            Name, surname:
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
            Matriculation number:
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
            Course of study, department:
          </strong>
        </span>
      </td>
      <td>
        <span style="font-family: Arial, Helvetica, sans-serif;">
          IMI (B), Faculty 4
        </span>
      </td>
    </tr>
    <tr>
      <td>
        <strong>
          <span style="font-family: Arial, Helvetica, sans-serif;">
            E-Mail:
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
            Training position:
          </span>
        </strong>
      </td>
      <td>
        <span style="font-family: Arial, Helvetica, sans-serif;">
          as "{{ operationalArea }}" in "{{ companyName }}"
        </span>
      </td>
    </tr>
    <tr>
      <td>
        <strong>
          <span style="font-family: Arial, Helvetica, sans-serif;">
            Address:
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
            Person in charge:
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
            E-Mail:
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
            Date and signature of the student
          </span>
        </strong>
      </td>
      <td>
        <strong>
          <span style="font-family: Arial, Helvetica, sans-serif;">
            &nbsp;&nbsp;&nbsp;&nbsp;Date and signature of the Company
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
  name: 'templateEnglish',
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
