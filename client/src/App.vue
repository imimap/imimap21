<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  getUserInfo,
  isLoggedIn,
} from '@/utils/auth';

export default defineComponent({
  name: 'App',
  beforeCreate() {
    if (this.$route.params.locale !== 'de' && this.$route.params.locale !== 'en') {
      this.$router.push({ params: { locale: 'de' } });
    }
    if (isLoggedIn() && this.$store.getters.getUser.id === '') {
      const decodedToken = getUserInfo();
      if (decodedToken !== null) {
        this.$store.dispatch('setUser', {
          displayName: decodedToken.displayName,
          email: decodedToken.email,
          firstName: decodedToken.firstName,
          id: decodedToken.id,
          lastName: decodedToken.lastName,
          sub: decodedToken.sub,
        });
      }
    }
  },
});
</script>

<style lang="scss">
html {
  font-family: sans-serif;
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

body {
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: left;
  background-color: #fff;
}

@include media-breakpoint-up(md) {
  html, body {
    min-height: 100%;
    height: 100%;
  }

  body {
    font-family: 'Merriweather Sans', sans-serif;
    background: url('/assets/bg.gif');
    color: $black;
  }
}

a {
  color: $htw-green-color !important;
  text-decoration: none !important;
  background-color: transparent;
}

#app {
  height: 100%;
  min-height: 100%;
}
</style>
