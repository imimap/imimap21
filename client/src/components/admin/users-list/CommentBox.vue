<template>
  <div class="card">
    <textarea
      class="card-body"
      name="comment"
      id="comment"
      v-model="comment"
      placeholder="Leave a comment"
      @keydown.meta.enter="post"
      @keydown.ctrl.enter="post"
    />
    <div class="card-footer d-flex flex-row justify-content-end">
      <button
        class="btn btn-success btn-sm"
        :disabled="!postingAllowed"
        @click="post"
      >
        Comment
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { postComment } from '@/utils/gateways';

export default defineComponent({
  props: {
    internshipId: {
      type: String,
      required: true,
    },
  },
  emits: ['updateInternship'],
  data() {
    return {
      comment: '',
      loading: false,
    };
  },
  computed: {
    cleanedComment(): string {
      return this.comment.trim();
    },
    postingAllowed(): boolean {
      return this.cleanedComment !== '' && !this.loading;
    },
  },
  methods: {
    async post(): Promise<void> {
      this.loading = true;
      const updatedInternship = await postComment(this.internshipId, this.cleanedComment);
      if (!updatedInternship) {
        this.loading = false;
        return;
      }
      this.comment = '';
      this.loading = false;
      this.$emit('updateInternship', updatedInternship);
    },
  },
});
</script>

<style scoped lang="scss">
textarea {
  resize: vertical;
  height: 96px;
  min-height: 96px;
  max-height: 256px;

  border: none;
  border-radius: 0.25rem 0.25rem 0 0;
}
</style>
