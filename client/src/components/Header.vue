<template>
  <header class="container-fluid imimap-header">
    <div class="row">
      <div class="col-2">
        <router-link class="navbar-brand imi-map-logo" :to="{ name: 'Home', params: { locale: $route.params.locale } }">
          <img src="/assets/plane.gif" alt="Plane">
        </router-link>
      </div>
      <div class="col-10">
        <div class="container">
          <div v-if="maintenanceMode" id="maintain">
            IMPORTANT: Maintaning server in {{ maintenanceTimeout }} Minutes. <br>
            Please log out immediately to avoid data loss!
          </div>
          <div class="row">
            <div class="col-12">
              <ul class="nav float-right imi-nav-right">
                <li class="imimap-nav-right-li">
                  <router-link :to="{ name: 'Help', params: { locale: $route.params.locale } }">
                    <font-awesome-icon icon="question-circle" />
                  </router-link>
                </li>
                <li class="imi-nav-right-spacer"></li>
                <li class="imimap-nav-right-li">
                  <router-link :to="{ name: 'Student', params: { locale: $route.params.locale } }">
                    <font-awesome-icon icon="user" />
                  </router-link>
                </li>
                <li class="dropdown imimap-nav-right-li">
                  <a href="#" id="drop3" role="button" class="dropdown-toggle" data-bs-toggle="dropdown">
                    <font-awesome-icon icon="cog" />
                  </a>
                  <ul class="dropdown-menu" role="menu" aria-labelledby="drop3">
                    <li class="locale-de dropdown-item" v-for="(locale, i) in $i18n.availableLocales" :key="`lang-${i}`"
                      :value="locale" v-on:click="switchLocale(locale)">
                      {{ locale }}
                    </li>
                    <li v-if="isAdmin" class="dropdown-item" v-on:click="toggleMaintain()">
                      MaintainMode {{ maintenanceMode ? 'OFF' : 'ON' }}
                    </li>
                  </ul>
                </li>
                <li class="imimap-nav-right-li">
                  <a v-on:click="logout()">
                    <font-awesome-icon icon="sign-out-alt" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <nav class="mt-4 ml-3 pb-3 navbar navbar-expand-md navbar-dark bg-dark" id="imi-maps-navbar-main">
                <button class="navbar-toggler imi-map-toggler mt-3" data-bs-toggle="collapse"
                  data-bs-target="#imi-map-navbar-core" aria-controls="imi-map-navbar-core" aria-expanded="false"
                  aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse navbar-dark bg-dark navbar-expand-lg pr-3" id="imi-map-navbar-core">
                  <ul class="navbar-nav">
                    <li class="nav-item imi-nav-item">
                      <router-link class="nav-link imi-nav-link imi-map-navlink"
                        :to="{ name: 'Home', params: { locale: $route.params.locale } }">
                        Start
                      </router-link>
                    </li>
                    <li class="nav-item imi-nav-item">
                      <router-link class="nav-link imi-nav-link imi-map-navlink"
                        :to="{ name: 'Search', params: { locale: $route.params.locale } }">
                        {{ $t("header.headerLinks.internshipSearch") }}
                      </router-link>
                    </li>
                    <li class="nav-item imi-nav-item" v-if="hasInternshipModule">
                      <router-link class="nav-link imi-nav-link imi-map-navlink" :to="{
                        name: 'InternshipModuleIndex',
                        params: { locale: $route.params.locale }
                      }">
                        {{ $t("header.headerLinks.myInternship") }}
                      </router-link>
                    </li>
                    <li v-if="isAdmin" class="nav-item imi-nav-item">
                      <router-link class="nav-link imi-nav-link imi-map-navlink admin-link"
                        :to="{ name: 'Admin', params: { locale: $route.params.locale } }">
                        {{ $t("header.headerLinks.administration") }}
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

<script lang="ts">
import { defineComponent } from 'vue';
import { logoutUser } from '@/utils/auth';
import { UserProfileState } from '@/store/types/UserProfileState';
import { useStore } from 'vuex';
import { addServerEventListener, removeServerEventListener, setMaintenanceMode } from '@/utils/gateways';

export default defineComponent({
  name: 'Header',
  data() {
    return {
      maintenanceMode: false,
      maintenanceTimeout: 'x:xx',
    };
  },
  computed: {
    hasInternshipModule(): boolean {
      return this.$store.getters.getUserInternshipId !== null;
    },
    isAdmin(): boolean {
      const store = useStore();
      const user: UserProfileState = store.getters.getUserProfile;
      return user.isAdmin;
    },
  },
  async mounted() {
    const store = useStore();
    const user: UserProfileState = store.getters.getUserProfile;
    console.log(user);
    const email = user.emailAddress || 'unknown';
    addServerEventListener(email, (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'maintenanceInfo') {
        this.maintenanceMode = data.maintenanceMode;
        this.maintenanceTimeout = this.formatTimeout(data.maintenanceTimeout);
      }
    });
  },
  methods: {
    formatTimeout(t: number): string {
      const min = Math.floor(t / 60000);
      const sec = (t % 60000) / 1000;
      return `${min}:${sec}`;
    },
    switchLocale(locale: string) {
      this.$i18n.locale = locale;
      this.$router.push({ params: { locale } });
    },
    async toggleMaintain() {
      await setMaintenanceMode(!this.maintenanceMode);
    },
    logout() {
      removeServerEventListener();
      logoutUser();
      this.$store.commit('resetUser');
      this.$store.commit('resetUserProfile');
      this.$store.dispatch('addNotification', {
        text: 'Du wurdest erfolgreich ausgeloggt!',
        type: 'success',
      });
      this.$router.push({ name: 'Login' });
    },
  },
});
</script>

<style lang="scss">
.imimap-header {
  background: url('/assets/topbar-background.png') no-repeat, $htw-gray-color;
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
  position: relative;
  background-size: 100%;
  width: 130px;
  height: 130px;
  margin-top: 8px;
  z-index: $zindex-modal-backdrop;

  img {
    height: 130px;
    width: 130px;
  }
}

#imi-maps-navbar-main {
  justify-content: right !important;
}

.imi-nav-right {
  margin-left: 50%;
  width: 175px;
}

.imi-nav-right-spacer {
  width: 1em;
}

.float-right {
  float: right !important;
}

.dropdown-menu.show {
  position: relative;
  z-index: 100000;
}

.imi-nav-right>li>a {
  text-decoration: none;
}

.imi-nav-right>li>a {
  float: left;
  display: inline;
  vertical-align: top;
  font-size: 16px;
  background-color: #77b900 !important;
  color: #fff !important;
  padding: 3px 8px 3px 8px;
  font-weight: 100;
}

.nav-bar {
  justify-content: right;
}

.navbar-collapse {
  background-color: #292929 !important;
  z-index: 1000;
}

.navbar-dark .navbar-toggler {
  color: rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.1);
}

#imi-map-navbar-core {
  padding: .75em 0;
}

@include media-breakpoint-up(md) {
  .imi-nav-right>li>a {
    font-size: 12px;
  }

  .navbar-expand-md .navbar-toggler {
    display: none;
  }

  .navbar-collapse {
    background-color: transparent;
  }

  #imi-maps-navbar-main {
    justify-content: normal;
  }
}

.bg-dark.navbar-dark {
  background-color: transparent !important;
}

.imi-nav-item {
  background-color: $htw-gray-color;
  padding: .25em 1em;

  @include media-breakpoint-up(md) {
    background-color: transparent;
  }
}

#imi-maps-navbar-main .router-link-exact-active,
#imi-maps-navbar-main .admin-link.router-link-active {
  text-decoration: none;
  border-bottom: 1px solid #77b900;
}

.imi-map-navlink {
  color: #c0b9b9 !important;
  text-decoration: none;
}

.imi-nav-link {
  text-shadow: none;
  font-family: 'Josefin Sans', sans-serif;
  text-transform: uppercase;
  text-decoration: none;
  font-size: 1rem;
  float: right;
  padding: .5em 0;
  color: #6b6b6b;
}

#maintain {
  position: fixed;
  left: 35vw;
  background-color: red;
  color: white;
}
</style>
