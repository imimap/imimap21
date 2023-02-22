<template>
  <div class="card">
    <div class="card-body card-text">
      <pre class="mb-0">{{ comment.content }}</pre>
    </div>
    <div class="card-footer">
      <span class="text-muted">
        {{ formatTimestamp(comment.timestamp) }} &ndash; {{ authorName }}
      </span>
      <button v-if="isOwnComment" @click="deleteComment">
        <font-awesome-icon icon="trash" class="text-muted"/>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Comment } from '@/store/types/Comment';
import Student from '@/models/Student';
import { LOAD_USER } from '@/store/actions';

const DAY_MILLIS = 24 * 60 * 60 * 1000;

export default defineComponent({
  props: {
    comment: {
      type: Object as PropType<Comment>,
      required: true,
    },
  },
  emits: ['deleteComment'],
  data() {
    return {
      author: undefined as Student | undefined,
    };
  },
  computed: {
    authorName(): string {
      if (!this.author?.firstName || !this.author?.lastName) return this.author?.emailAddress ?? '';
      return `${this.author?.firstName} ${this.author?.lastName}`;
    },
    dateFormatter(): Intl.DateTimeFormat {
      return new Intl.DateTimeFormat([this.$i18n.locale, 'en'], { day: '2-digit', month: '2-digit', year: 'numeric' });
    },
    timeFormatter(): Intl.DateTimeFormat {
      return new Intl.DateTimeFormat([this.$i18n.locale, 'en'], { hour: '2-digit', minute: '2-digit' });
    },
    isOwnComment(): boolean {
      return this.$store.getters.getAuthUser.id === this.comment.author;
    },
  },
  methods: {
    formatTimestamp(timestamp: number): string {
      const date = new Date(timestamp);
      const timeDifference = Math.abs(new Date().getTime() - date.getTime());
      return timeDifference < DAY_MILLIS ? this.timeFormatter.format(date) : this.dateFormatter.format(date);
    },
    async deleteComment() {
      this.$emit('deleteComment');
    },
  },
  async mounted() {
    this.author = await this.$store.dispatch(LOAD_USER, { id: this.comment.author });
  },
});
</script>

<style scoped lang="scss">
.card-footer {
  font-size: 0.9em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  border: none;
  background: transparent;
  padding: 0.2em;
  display: flex;
}

pre {
  font-family: var(--bs-body-font-family);
  font-size: 1em;
}
</style>
