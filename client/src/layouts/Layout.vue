<template>
  <template v-if="isAnonymousRoute">
    <router-view></router-view>
    <footer-component></footer-component>
  </template>

  <template v-else>
    <header-component></header-component>
    <main>
      <router-view></router-view>
    </main>
    <footer-component></footer-component>
  </template>

  <notification-list></notification-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import NotificationList from '@/components/notification/NotificationList.vue';

export default defineComponent({
  name: 'Layout',
  computed: {
    isAnonymousRoute(): boolean {
      return this.$route.meta.allowAnonymous as boolean;
    },
  },
  components: {
    HeaderComponent,
    FooterComponent,
    NotificationList,
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
  padding: 2em 1em;
  box-shadow: 4px 6px 1px 0 rgb(0 0 0 / 30%);
  @include media-breakpoint-up(md) {
    padding: 2.5em 5em;
  }
}

main {
  flex: 1;
}

</style>
