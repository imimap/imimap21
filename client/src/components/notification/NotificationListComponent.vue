<template>
  <div class="notifications-list">
    <NotificationComponent
      v-for="notification in notifications.notifications"
      v-bind:key="notification.id"
      v-bind:id="notification.id"
      v-bind:text="notification.text"
      v-bind:type="notification.type">
    </NotificationComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NotificationComponent from '@/components/notification/NotificationComponent.vue';
import { mapState } from 'vuex';

export default defineComponent({
  name: 'NotificationListComponent',
  components: {
    NotificationComponent,
  },
  computed: {
    ...mapState(['notifications']),
  },
});
</script>

<style lang="scss">
.notifications-list {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  padding: 1em;
  z-index: 1000;

  @include media-breakpoint-up(lg) {
    width: 500px;
  }
}
</style>
