<template>
  <div class="w-100 h-100 text-center " style="background-color: #333333;">
    <div class="w-50 h-25 m-auto pt-5"/>
    <div id="login_inputs" class="w-50 h-50 m-auto mt-0 container">
      <router-link
        class="m-0 navbar-brand imi-map-logo"
        :to="{name: 'Home', params: { locale: $route.params.locale }}">
        <img width="130" height="130" alt="" src="/assets/plane.gif">
      </router-link>
      <div class="mt-3 text-white">
        This is a staging environment set up for demonstration purposes only.
        It is only meant to be used for showcasing the MEVN-IMI-Map during the showtime.
      </div>
        <form v-on:submit.prevent>
          <div class="input-group w-auto mt-3 row">
            <div class="col">
              <input
                autofocus="autofocus"
                class="form-control"
                placeholder="s0123456@htw-berlin.de"
                type="email"
                v-model="username"/>
            </div>
          </div>
          <div class="input-group w-auto mt-1 row">
            <div class="col">
              <input
                autocomplete="off"
                class="form-control"
                placeholder="********"
                type="password"
                v-model="password"/>
            </div>
          </div>
          <div id="submit" class="mt-3">
            <button
              v-on:click="login()"
              type="submit"
              class="btn btn-htw-green">
              Login
            </button>
          </div>
        </form>
    </div>
    <div class="w-75 h-25 m-auto"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { login } from '@/utils/auth';

export default defineComponent({
  name: 'LoginComponent',
  data() {
    return {
      username: '',
      password: '',
      error: null,
    };
  },
  methods: {
    // @TODO: Genauere Fehler beim Login angeben
    async login() {
      if (await login(this.username, this.password)) {
        await this.$router.push({ name: 'Index' });
      }
    },
  },
});
</script>

<style scoped>

</style>
