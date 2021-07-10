<template>
  <template v-if="isLoggedInUser()">
    <HeaderComponent></HeaderComponent>
    <main>
      <router-view></router-view>
    </main>
    <footer-component></footer-component>
    <NotificationsListComponent></NotificationsListComponent>
  </template>

  <template v-else>
    <router-view></router-view>
    <NotificationsListComponent></NotificationsListComponent>
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import NotificationsListComponent from '@/components/notification/NotificationListComponent.vue';
import { isLoggedIn } from '@/utils/auth';

export default defineComponent({
  name: 'Layout',
  methods: {
    isLoggedInUser(): boolean {
      return isLoggedIn();
    },
  },
  components: {
    HeaderComponent,
    FooterComponent,
    NotificationsListComponent,
  },
  beforeCreate() {
    this.$i18n.locale = this.$route.params.locale as string;
  },
});
</script>

<style lang="scss">
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
</style>
