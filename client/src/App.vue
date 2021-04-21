<template>
  <header class="container-fluid imimap-header">
    <div class="row">
      <div class="col-2">
        <a href="" class="navbar-brand imi-map-logo">
          <img src="/assets/plane.gif" alt="">
        </a>
      </div>
      <div class="col-10">
        <div class="container">
          <div class="row">
            <div class="col-12"></div>
          </div>
          <div class="row">
            <div class="col-12">
              <nav class="mt-4 ml-3 pb-3 navbar navbar-expand-md navbar-dark">
                <button class="navbar-toggler imi-map-toggler"
                        type="button" data-toggle="collapse"
                        data-target="#imi-map-navbar-core"
                        aria-controls="imi-map-navbar-core"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                >
                  <span class="navbar-toggler-icon"></span>
                </button>
                <div
                  class="collapse navbar-collapse navbar-expand-lg pr-3"
                  id="imi-map-navbar-core"
                >
                  <ul class="navbar-nav ">
                    <li class="nav-item im-nav-itemactive">
                      <a class="nav-link im-nav-link imi-map-navlink" href="#">Start</a>
                    </li>
                    <li class="nav-item im-nav-item">
                      <a class="nav-link im-nav-link imi-map-navlink" href="#">
                        Praktikumssuche
                      </a>
                    </li>
                    <li class="nav-item im-nav-item">
                      <a class="nav-link im-nav-link imi-map-navlink" href="#">
                        Mein Praktikum
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
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
$screen-md: 768px;

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

.navbar-brand {
  display: inline-block;
  padding-top: 0.3125rem;
  padding-bottom: 0.3125rem;
  margin-right: 1rem;
  font-size: 1.25rem;
  line-height: inherit;
  white-space: nowrap;
}

.imi-map-logo {
  background: url('/assets/logo.png') no-repeat;
  background-size: 100%;
  margin-top: -20px;
  width: 130px;
  height: 130px;
  margin-top: 8px;

  img {
    height: 130px;
    width: 130px;
  }
}

.navbar-dark .navbar-toggler {
  color: rgba(255,255,255,0.5);
  border-color: rgba(255,255,255,0.1);
}

@media (min-width: $screen-md) {
  .navbar-expand-md .navbar-toggler {
    display: none;
  }
}

.bg-dark.navbar-dark {
  background-color: transparent !important;
}
</style>
