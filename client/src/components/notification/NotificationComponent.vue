<template>
  <div
    v-show="isActive"
    class="notification alert alert-dismissible fade show"
    :class="classType"
    role="alert"
  >
    {{ this.text }}
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
      v-on:click="fadeClose($event.target)"
    ></button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NotificationComponent',
  props: {
    id: String,
    text: String,
    type: String,
  },
  data() {
    return {
      isActive: true,
    };
  },
  computed: {
    classType(): string {
      return `alert-${this.type}`;
    },
  },
  created() {
    setTimeout(() => {
      this.fadeClose(this.$el);
    }, 5000);
  },
  methods: {
    fadeClose(notification) {
      notification.classList.add('fade-notification');
      this.remove();
    },
    remove() {
      setTimeout(() => {
        this.$store.dispatch('removeNotification', this.id);
        this.isActive = false;
      }, 300);
    },
  },
});
</script>

<style lang="scss">
.notification {
  opacity: 1;
  transition: opacity 1s ease-out;
}

.notification.fade-notification {
  opacity: 0;
}
</style>
