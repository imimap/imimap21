<template>
  <div
    class="notification alert alert-dismissible fade show"
    :class="classType"
    role="alert"
  >
    <small>
      {{ this.text }}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        v-on:click="fadeClose($event.target)"
      ></button>
    </small>
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
      }, 1000);
    },
  },
});
</script>

<style lang="scss">
.notification {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  opacity: 1;
  transition: opacity 1s ease-out;
}

.notification.fade-notification {
  opacity: 0;
}
</style>
