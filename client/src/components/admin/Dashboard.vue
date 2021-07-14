<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-4">
        <div class="card text-center">
          <div class="card-body">
            <p class="large-number">5</p>
            <p class="card-text">unvollständige Praktika</p>

            <router-link class="btn btn-success text-white"
                         to="users">Praktika bearbeiten</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Dashboard',
  data() {
    return {
      internshipModuleCount: 0,
    };
  },
  methods: {
    getInternshipModuleCount(filterStatus: string, filterDuration: string) {
      return true;
    },
    getCompaniesCount() {
      return true;
    },
    getPostponementCount(filterStatus: string, filterDuration: string) {
      return true;
    },
  },
});
</script>

<style scoped>
  template {
    padding: 20px;
  }

  .card .large-number {
     font-size: 5rem;
  }

  .btn-success {
    background: rgba(119, 185, 0, 0.9);
    border-color: rgba(119, 185, 0, 0.9);
  }

  .btn-success:hover, .btn-success:active, .btn-success:focus {
    background: rgba(119, 185, 0, 1);
    border-color: rgba(119, 185, 0, 1);
  }

  .table-nav button {
    margin-right: 20px;
  }

</style>
