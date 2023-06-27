<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-4 col-md-6">
        <div class="card text-center">
          <div class="card-body">
            <p class="large-number">
              {{ usersCount }}
            </p>
            <div v-for="u of usersOnline" :key="u">
                {{ u }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6">
        <div class="card text-center">
          <div class="card-body">
            <p class="card-text">{{ $t("adminDashboard.postponements.open") }}</p>
            <router-link class="btn btn-success text-white" to="postponements">
              {{ $t("adminDashboard.postponements.edit") }}
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6">
        <div class="card text-center">
          <div class="card-body">
            <p class="card-text">{{ $t("adminDashboard.companies.registered") }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getOnlineUsers } from '@/utils/gateways';

export default defineComponent({
  name: 'ServerAdmin',
  data() {
    return {
      usersCount: 0,
      usersOnline: [] as string[],
    };
  },
  mounted() {
    this.getOnlineUsersCount();
  },
  methods: {
    getUpcomingSemester(): string {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      // Attention: Month is zero-based!
      if (currentMonth >= 3 && currentMonth < 9) {
        // Currently: summer semester, get upcoming winter semester
        return `WS${currentDate.getFullYear() + 1}`;
      }
      // Currently: Winter semester, get upcoming summer semester
      return `SS${currentDate.getFullYear()}`;
    },
    async getOnlineUsersCount() {
      const online = await getOnlineUsers();
      console.log(online);
      this.usersCount = online.length;
      this.usersOnline = online;
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

.btn-success:hover,
.btn-success:active,
.btn-success:focus {
  background: rgba(119, 185, 0, 1);
  border-color: rgba(119, 185, 0, 1);
}

.table-nav button {
  margin-right: 20px;
}

.text-htw {
  color: rgba(119, 185, 0, 1);
  width: 5rem;
  height: 5rem;
}
</style>
