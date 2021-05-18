<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <table class="table table-sm table-striped table-hover">
          <thead>
          <tr>
            <th v-for="head in tableHeads" v-bind:key="head" scope="col">
              {{ head }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, index) in tableContent" v-bind:key="index" >
            <th scope="row">{{ row.matrikelNr }}</th>
            <td>{{ row.firstName }}</td>
            <td>{{ row.lastName }}</td>
            <td>{{ row.role }}</td>
            <td>{{ row.internshipsSeen }}</td>
            <td>{{ row.companiesSeen }}</td>
            <td>
              <button type="button" class="btn btn-secondary mx-3">
                <font-awesome-icon icon="edit" /> Edit
              </button>
              <button type="button" class="btn btn-danger">
                <font-awesome-icon icon="trash-alt" /> Delete
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AdminList',
  data() {
    return {};
  },
  props: {
    tableHeads: Array,
    tableContent: Array,
  },
});
</script>

<style scoped>
  template {
    padding: 20px;
  }

  .table-nav button {
    margin-right: 20px;
  }

</style>
