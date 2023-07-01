<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-4 col-md-6">
        <div class="card text-center">
          <div class="card-body">
            <p class="large-number">
              {{ usersCount }}
            </p>
            <p>User Names</p>
            <div v-for="u of usersOnline" :key="u">
                {{ u }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6">
        <div class="card text-center">
          <div class="card-body">
            <p class="card-text"> Maintenance Meldung </p>
            <button class="btn btn-success text-white" v-on:click="toggleMaintain()">
              MaintainMode {{ maintenanceMode ? 'OFF' : 'ON' }}
            </button>
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
import { addServerEventListener, getOnlineUsers, setMaintenanceMode } from '@/utils/gateways';
import { formatTimeout } from '@/utils/stringHelper';

export default defineComponent({
  name: 'ServerAdmin',
  data() {
    return {
      usersCount: 0,
      usersOnline: [] as string[],
      maintenanceMode: false,
      maintenanceTimeout: 'x:xx',
    };
  },
  mounted() {
    this.getOnlineUsersCount();
    addServerEventListener('admintab', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'maintenanceInfo') {
        this.maintenanceMode = data.maintenanceMode;
        this.maintenanceTimeout = formatTimeout(data.maintenanceTimeout);
      }
    });
  },
  methods: {
    async toggleMaintain() {
      await setMaintenanceMode(!this.maintenanceMode);
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
