<template>
  <div
    class="text-left modal fade"
    id="uploadPdfModal"
    tabindex="-1"
    aria-labelledby="consentModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            {{ $t("internshipModule.forms.uploadFile", {file: $t(`internshipModule.pdfTypes.${pdfType}`)}) }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close">
          </button>
        </div>
        <div class="modal-body text-left">
          <div>
            <label for="pdfFileInput" class="form-label">
              {{ $t("internshipModule.forms.pickPDF") }}
            </label>
            <input
              class="form-control form-control-lg"
              id="pdfFileInput"
              type="file"
              ref="pdfFileInput"
              accept=".pdf"
              @change="previewPdf"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-htw-green"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="uploadPdf"
            :disabled="pdfFile === null"
          >
            {{ $t("internshipModule.forms.upload") }}
          </button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
            {{ $t("internshipModule.forms.cancel") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { uploadPDFFile } from '@/utils/gateways';

export default defineComponent({
  name: 'UploadPDFModal',
  props: {
    pdfType: String,
    internshipId: String,
  },
  emits: ['updateInternship'],
  data: () => ({
    pdfFile: null as File | null,
  }),
  methods: {
    previewPdf(event: InputEvent) {
      const { files } = event.target as HTMLInputElement;
      if (!files || !files.length) return;
      // eslint-disable-next-line prefer-destructuring
      this.pdfFile = files[0];
    },
    async uploadPdf() {
      if (!this.pdfFile || !this.internshipId || !this.pdfType) return;

      const pdfResponse = await uploadPDFFile(this.internshipId, this.pdfFile, this.pdfType);
      if (!pdfResponse) return;

      await this.$emit('updateInternship', pdfResponse);
    },
  },
  watch: {
    pdfType() {
      (this.$refs.pdfFileInput as HTMLInputElement).value = '';
      this.pdfFile = null;
    },
  },
});
</script>
