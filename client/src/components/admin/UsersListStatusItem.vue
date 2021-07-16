<template>
  <li :class="`list-group-item ${liClass}`">
    <svg v-if="item.status === 'accepted'" xmlns="http://www.w3.org/2000/svg" width="16"
         height="16" fill="currentColor"
         class="bi bi-check-circle-fill" viewBox="0 0 16 16">
      <path
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477
            9.417 5.384 7.323a.75.75 0 0 0-1.06
            1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0
            0-.01-1.05z"/>
    </svg>

    <svg v-else-if="item.status === 'unknown'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         class="bi bi-x-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647
      2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0
      0 0-.708-.708L8 7.293 5.354 4.646z"/>
    </svg>
    {{ text }} ({{item.status}})
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UsersListStatusItem',
  props: {
    item: Object,
    text: String,
  },
  computed: {
    liClass() {
      if (!(this.item === undefined)) {
        if (!(this.item.status === undefined)) {
          switch (this.item.status) {
            case 'submitted':
              return 'list-group-item-primary';
            case 'accepted':
              return 'list-group-item-success';
            case 'rejected':
              return 'list-group-item-danger';
            default:
              return 'list-group-item-light';
          }
        } else {
          return 'list-group-item-light';
        }
      } else {
        return 'list-group-item-light';
      }
    },
  },
  data() {
    return {
    };
  },
  methods: {},
});
</script>

<style scoped>

</style>
