<template>
  <div class="w-100 h-100 text-center " style="background-color: #333333;">
    <div class="w-50 h-25 m-auto pt-5">
      <div v-if="error" class="alert alert-danger" >
        {{ error }}
      </div>
    </div>
    <div id="login_inputs" class="w-50 h-50 m-auto mt-0 container">
      <router-link
        class="m-0 navbar-brand imi-map-logo"
        :to="{name: 'Home', params: { locale: $route.params.locale }}"
      >
        <img width="130" height="130" alt="" src="/assets/plane.gif">
      </router-link>
      <div class="mt-3 text-white">
        Please use your HRZ-Account for logging in.
      </div>
        <div class="input-group w-auto mt-3 row">
          <div class="col">
            <input
              autofocus="autofocus"
              class="form-control"
              placeholder="s0123456@htw-berlin.de"
              type="email" name="user[email]"
              id="user_email"
              v-model="username"
            >
          </div>
        </div>
        <div class="input-group w-auto mt-1 row">
          <div class="col">
            <input
              autocomplete="off"
              class="form-control"
              placeholder="********"
              type="password"
              v-model="password"
            >
          </div>
        </div>
        <div id="submit" class="mt-3">
          <button
            v-on:keyup.enter="login"
            v-on:click="login()"
            class="btn btn-htw-green"
          >
            Login
          </button>
        </div>
    </div>
    <div class="w-75 h-25 m-auto"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import http from '@/utils/http-common';
import {
  setAuthToken,
} from '@/utils/auth';

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
    async login() {
      try {
        const res = await http.post('/auth/login', { username: this.username, password: this.password });
        setAuthToken(res.data.token);
        await this.$router.push({ name: 'Index' });
      } catch (err) {
        this.error = err.message;
      }
    },
  },
});
</script>

<style scoped>

</style>
