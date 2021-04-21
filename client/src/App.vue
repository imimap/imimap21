<template>
  <header class="container-fluid imimap-header">
    <div class="row">
      <div class="col-2">
        <img src="/assets/logo.png" alt="">
      </div>
      <div class="col-10">NAV</div>
    </div>
  </header>
  <main>
    <div class="dropdown">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Check Bootstrap
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
      </ul>
    </div>
    <router-view></router-view>
  </main>
  <footer></footer>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';

export default {
  name: 'App',
  components: {
  },
};
</script>

<style lang="scss">
.imimap-header {
  background: url('/assets/topbar-background.png'),#292929;
  background-repeat: no-repeat;
  background-size: 100%;
  width: 100%;
  border-radius: 0 !important;
  height: 129px;
  text-align: center;
  overflow: visible;
  margin-bottom: 20px;
}
</style>
