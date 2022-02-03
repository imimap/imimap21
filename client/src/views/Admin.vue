<template>
  <div class="container my-5">
    <ul class="nav nav-pills">
      <li class="nav-item me-2">
        <router-link class="nav-link" :class="{ active: isDashboardRoute }"
                     to="dashboard">Dashboard</router-link>
      </li>
      <li class="nav-item me-2">
        <router-link class="nav-link" :class="{ active: isUsersRoute }"
                     to="users">Praktika</router-link>
      </li>
      <li class="nav-item me-2">
        <router-link class="nav-link" :class="{ active: isCompaniesRoute }"
                     to="companies">Unternehmen</router-link>
      </li>
      <li class="nav-item me-2">
        <router-link class="nav-link" :class="{ active: isPostponementsRoute }"
                     to="postponements">Verschiebungen</router-link>
      </li>
      <li class="nav-item me-2">
        <router-link class="nav-link" :class="{ active: isAEPModuleRoute }"
                     to="aepDashboard">AEP Dashboard</router-link>
      </li>
    </ul>
  </div>

  <div class="container admin-container mt-5">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Admin',
  data() {
    return {};
  },
  computed: {
    isDashboardRoute() {
      return this.$router.currentRoute.value.path.includes('dashboard');
    },
    isUsersRoute() {
      return this.$router.currentRoute.value.path.includes('users');
    },
    isCompaniesRoute() {
      return this.$router.currentRoute.value.path.includes('companies');
    },
    isPostponementsRoute() {
      return this.$router.currentRoute.value.path.includes('postponements');
    },
    isAEPModuleRoute() {
      return this.$router.currentRoute.value.path.includes('aepDashboard');
    },
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

  .admin-container {
    background: #FFFFFF;
    box-shadow: 4px 6px 1px 0px rgba(0,0,0,0.3);
    padding-top: 30px;
    padding-bottom: 30px;
  }

  .nav-pills .nav-item .nav-link {
    background: gray;
    color: white !important;
  }

  .nav-pills .nav-item .active {
    background: rgba(119, 185, 0, 1);
    color: white !important;
  }

</style>
