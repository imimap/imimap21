<template>
  <div class="container">
    <div class="row my-5 table-nav">
      <div class="col-12">
        <button type="button" class="btn btn-primary">Users</button>
        <button type="button" class="btn btn-primary">Internships</button>
        <button type="button" class="btn btn-primary">Companies</button>
      </div>
    </div>
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
            <tr>
              <th scope="row"></th>
              <td>qwertyu</td>
              <td>qwertyu</td>
              <td>qwertyu</td>
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
