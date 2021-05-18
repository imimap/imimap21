<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <form>
          <div class="mb-3">
            <label for="firstName" class="form-label">First Name</label>
            <input type="text" class="form-control" id="firstName"
                   aria-describedby="firstName" v-bind:value="users[id].firstName" />
          </div>
          <div class="mb-3">
            <label for="lastName" class="form-label">Last Name</label>
            <input type="text" class="form-control" id="lastName"
                   aria-describedby="lastName" v-bind:value="users[id].lastName" />
          </div>
          <div class="mb-3">
            <label for="handle" class="form-label">Role</label>
            <input type="text" class="form-control" id="handle"
                   aria-describedby="handle" v-bind:value="users[id].role" />
          </div>
          <div class="mb-3">
            <label for="matrikelNr" class="form-label">Matrikel Nr.</label>
            <input type="text" class="form-control" id="matrikelNr"
                   aria-describedby="matrikelNr" v-bind:value="users[id].matrikelNr" />
          </div>
          <div class="mb-3">
            <label for="internshipId" class="form-label">Internship Id</label>
            <input type="text" class="form-control" id="internshipId"
                   aria-describedby="internshipId" v-bind:value="users[id].internshipId" />
          </div>
          <div class="mb-3">
            <label for="internshipsSeen" class="form-label">Internships seen</label>
            <input type="text" class="form-control" id="internshipsSeen"
                   aria-describedby="internshipsSeen" v-bind:value="users[id].internshipsSeen" />
          </div>
          <div class="mb-3">
            <label for="companiesSeen" class="form-label">Companies seen</label>
            <input type="text" class="form-control" id="companiesSeen"
                   aria-describedby="companiesSeen" v-bind:value="users[id].companiesSeen" />
          </div>
          <button class="btn btn-secondary">Cancel</button>
          <button type="submit" class="btn btn-primary mx-3">Save</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AdminSingle',
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
  props: {
    id: Number,
    type: String,
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
