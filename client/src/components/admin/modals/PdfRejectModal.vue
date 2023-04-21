<template>
  <div class="modal fade" tabindex="-1" :id="`reject-pdf-modal-${pdfId}`">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ $t("internshipModule.pdfActions.rejectModalTitle") }}
          </h5>
          <button type="button"
                  class="btn-close"
                  aria-label="Close"
                  @click="close"
          />
        </div>
        <div class="modal-body">
          <label v-for="(text, reason) in reasons" :key="reason">
            <input
              type="radio"
              name="reject-reason"
              :id="`reject-reason-${reason}`"
              :value="reason"
              v-model="selectedReason"
            >
            {{ text }}
          </label>
          <input
            type="text"
            name="other-reason"
            id="other-reason"
            v-model="otherText"
            :disabled="selectedReason !== 'other'"
          >
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            {{ $t("actions.abort").capitalize() }}
          </button>
          <button type="button" class="btn btn-success" @click="reject" :disabled="!selectedReason">
            {{ $t("internshipModule.pdfActions.reject").capitalize() }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PdfRejectModal',
  props: {
    pdfId: {
      type: String,
      required: true,
    },
  },
  emits: ['reject', 'close'],
  data() {
    return {
      selectedReason: null as string | null,
      reasons: {
        signature: this.$t('internshipModule.pdfActions.rejectReasons.signature'),
        askProf: this.$t('internshipModule.pdfActions.rejectReasons.askProf'),
        other: `${this.$t('internshipModule.pdfActions.rejectReasons.other')}:`,
      },
      otherText: '',
    };
  },
  computed: {
    reason(): string {
      if (!this.selectedReason) return '';
      return this.selectedReason === 'other' ? this.otherText : this.reasons[this.selectedReason];
    },
  },
  methods: {
    reject() {
      this.$emit('reject', this.reason);
      this.reset();
    },
    close() {
      this.$emit('close');
      this.reset();
    },
    reset() {
      this.selectedReason = '';
      this.otherText = '';
    },
  },
});
</script>

<style scoped lang="scss">
label {
  display: flex;
  margin-block: 0.5em;
  gap: 0.2em;

  &:last-of-type {
    display: inline-block;
    margin-inline-end: 1em;
  }
}
</style>
