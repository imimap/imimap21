<template>
  <HeaderComponent></HeaderComponent>
  <main class="margin_bottom_10">
    <router-view></router-view>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';

export default defineComponent({
  name: 'App',
  components: {
    HeaderComponent,
  },
});
</script>

<style lang="scss">
html {
  font-family: sans-serif;
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0)
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

@media (min-width: $screen-md) {
  html, body {
    min-height: 100%;
    height: 100%;
  }

  body {
    font-family: 'Merriweather Sans', sans-serif;
    background: url('/assets/bg.gif');
    color: #000;
  }
}

#form-block4 {
  background-color: #FFFFFF;
  color: #000000;
  font-weight: 100;
  height: 96%;
  margin-bottom: 30px;
  margin-top: 50px;
  padding: 30px 50px;
  box-shadow: 4px 6px 1px 0px rgb(0 0 0 / 30%);
}

#search_options > * {
  width: auto;
}
</style>
