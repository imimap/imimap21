<template>
  <header class="container-fluid imimap-header">
    <div class="row">
      <div class="col-2">
        <router-link
          class="navbar-brand imi-map-logo"
          :to="{name: 'Home', params: { locale: $route.params.locale }}"
        >
          <img src="/assets/plane.gif" alt="Plane">
        </router-link>
      </div>
      <div class="col-10">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <ul class="nav float-right imi-nav-right">

                <li class="imimap-nav-right-li">
                  <a href="/de/help">
                    <font-awesome-icon icon="question-circle" />
                  </a>
                </li>
                <li> &nbsp;</li>
                <li class="imimap-nav-right-li">
                  <a href="/de/students/778">
                    <font-awesome-icon icon="user" />
                  </a>
                </li>

                <li class="dropdown imimap-nav-right-li">
                  <a href="#" id="drop3" role="button"
                     class="dropdown-toggle" data-bs-toggle="dropdown"
                  >
                    <font-awesome-icon icon="cog" />
                  </a>
                  <ul class="dropdown-menu" role="menu" aria-labelledby="drop3">
                      <li
                        class="locale-de dropdown-item"
                        v-for="(locale, i) in $i18n.availableLocales"
                        :key="`lang-${i}`"
                        :value="locale"
                        v-on:click="switchLocale(locale)"
                      >
                        {{ locale }}
                      </li>
                  </ul>
                </li>
                <li class="imimap-nav-right-li">
                  <a rel="nofollow" data-method="delete" href="/de/users/sign_out">
                    <font-awesome-icon icon="sign-out-alt" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <nav class="mt-4 ml-3 pb-3 navbar navbar-expand-md navbar-dark bg-dark"
                   id="imi-maps-navbar-main"
              >
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
                      <router-link
                        class="nav-link im-nav-link imi-map-navlink"
                        :to="{name: 'Home', params: { locale: $route.params.locale }}"
                      >
                        Start
                      </router-link>
                    </li>
                    <li class="nav-item im-nav-item">
                      <router-link
                        class="nav-link im-nav-link imi-map-navlink"
                        :to="{name: 'Search', params: { locale: $route.params.locale }}"
                      >
                        {{ $t("header.headerLinks.internshipSearch") }}
                      </router-link>
                    </li>
                    <li class="nav-item im-nav-item">
                      <router-link
                        class="nav-link im-nav-link imi-map-navlink"
                        :to="{name: 'InternshipModule', params: { locale: $route.params.locale }}"
                      >
                        {{ $t("header.headerLinks.myInternship") }}
                      </router-link>
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
</template>

<script  lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HeaderComponent',
  methods: {
    switchLocale(locale: string) {
      this.$i18n.locale = locale;
      this.$router.push({ params: { locale } });
    },
  },
});
</script>

<style lang="scss">
.imimap-header {
  background: url('/assets/topbar-background.png'), $htw-gray-color;
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

.imi-nav-right {
  margin-left: 50%;
}

.float-right {
  float: right !important;
}

.imi-nav-right>li>a {
  text-decoration: none;
}

.imi-nav-right>li>a {
  float: left;
  display: inline;
  vertical-align: top;
  font-size: 12px;
  font-weight: bold;
  background-color: #77b900 !important;
  color: #fff !important;
  padding-bottom: 3px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 3px;
  font-weight: 100;
}

.navbar-dark .navbar-toggler {
  color: rgba(255,255,255,0.5);
  border-color: rgba(255,255,255,0.1);
}

@include media-breakpoint-up(md) {
  .navbar-expand-md .navbar-toggler {
    display: none;
  }
}

.bg-dark.navbar-dark {
  background-color: transparent !important;
}

.imi-map-navlink {
  color: #c0b9b9 !important;
  text-decoration: none;
}

.im-nav-link {
  color: #000;
  text-shadow: none;
  font-family: 'Josefin Sans', sans-serif;
  text-transform: uppercase;
  text-decoration: none;
  font-size: 1rem;
  float: right;
  color: #6b6b6b;
}
</style>
