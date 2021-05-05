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
        <table class="table table-striped table-hover">
          <thead>
          <tr>
            <th scope="col">Matrikel Nr.</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Role</th>
            <th scope="col">internshipsSeen</th>
            <th scope="col">companiesSeen</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" v-bind:key="index" >
              <th scope="row">{{ user.matrikelNr }}</th>
              <td>{{ user.firstName }}</td>
              <td>{{ user.lastName }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.internshipsSeen }}</td>
              <td>{{ user.companiesSeen }}</td>
              <td>
                <button type="button" class="btn btn-secondary mx-3">
                  <font-awesome-icon icon="edit" />
                </button>
                <button type="button" class="btn btn-danger">
                  <font-awesome-icon icon="trash-alt" />
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
  name: 'Admin',
  data() {
    return {
      users: [{
        firstName: 'Mark',
        lastName: 'Otto',
        role: 'student',
        matrikelNr: '456123',
        internshipId: '090909',
        internshipsSeen: '8',
        companiesSeen: '3',
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        role: 'student',
        matrikelNr: '123789',
        internshipId: '091009',
        internshipsSeen: '2',
        companiesSeen: '9',
      },
      {
        firstName: 'Lisa',
        lastName: 'Muster',
        role: 'student',
        matrikelNr: '096123',
        internshipId: '120909',
        internshipsSeen: '6',
        companiesSeen: '0',
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
