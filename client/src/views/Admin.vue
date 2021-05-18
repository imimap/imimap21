<template>

  <div v-if="showSingle"  class="container mt-5">
    <div class="row">
      <div class="col-12">
        <admin-single id="1"></admin-single>
      </div>
    </div>
  </div>

  <div v-else class="container mt-5">
    <div class="row my-5 table-nav">
      <div class="col-12">
        <button type="button" class="btn btn-success">Users</button>
        <button type="button" class="btn btn-success">Internships</button>
        <button type="button" class="btn btn-success">Companies</button>
      </div>
    </div>
    <admin-list :table-heads="usersTableHeads" :table-content="users"></admin-list>
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AdminList from '@/components/admin/AdminList.vue';
import AdminSingle from '@/components/admin/AdminSingle.vue';

export default defineComponent({
  name: 'Admin',
  components: {
    AdminList,
    AdminSingle,
  },
  data() {
    return {
      showSingle: false,
      usersTableHeads: [
        'Matrikel Nr.',
        'First Name',
        'Last Name',
        'Role',
        'internshipsSeen',
        'companiesSeen',
        '',
        '',
      ],
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
