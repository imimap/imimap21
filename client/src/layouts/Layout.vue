<template>
  <template v-if="isLoggedInUser()">
    <HeaderComponent></HeaderComponent>
    <main class="margin_bottom_10">
      <router-view></router-view>
    </main>
    <footer-component></footer-component>
    <NotificationsListComponent></NotificationsListComponent>
  </template>

  <template v-else>
    <router-view></router-view>
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
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

</style>
