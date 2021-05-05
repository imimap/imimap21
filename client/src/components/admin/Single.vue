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
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" v-bind:key="index" >
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ user.name }}</td>
              <td>{{ user.lastname }}</td>
              <td>{{ user.handle }}</td>
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
  name: 'Admin',
  data() {
    return {
      users: [{
        name: 'Mark',
        lastname: 'Otto',
        handle: '@qwerty',
      },
      {
        name: 'Mark',
        lastname: 'Otto',
        handle: '@qwerty',
      },
      {
        name: 'Mark',
        lastname: 'Otto',
        handle: '@qwerty',
      },
      ],
    };
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
