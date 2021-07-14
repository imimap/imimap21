<template>
  <div id="form-block4" class="text-left">
      <h3>Deine beantragten Verschiebungen</h3>
      <div class="row mt-3">
        <table class="table">
          <thead>
          <tr>
            <th scope="col">Neues Semester</th>
            <th scope="col">Neues Fachsemester</th>
            <th scope="col">Begründung</th>
            <th scope="col">Status</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="postponement in postponements"
            v-bind:key="postponement._id"
            v-bind:postponement="postponement">
            <th scope="row">{{ postponement.changes.newSemester}}</th>
            <td>{{ postponement.changes.newSemesterOfStudy }}</td>
            <td>{{ postponement.comment }}</td>
            <td>
              <span class="badge" :class="getPostponementStatusClass(postponement)">
                {{ postponement.changes.status }}
              </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'PostponementsList',
  props: {
    postponements: Array as PropType<{
      _id: string;
      changes: {};
      comment: string;
      status: string;
    }[]>,
  },
  methods: {
    getPostponementStatusClass(postponement) {
      if (postponement.changes.status === 'postponement requested') return 'bg-warning';
      if (postponement.changes.status === 'planned') return 'bg-success';
      return null;
    },
  },
});
</script>

<style lang="scss">

</style>
