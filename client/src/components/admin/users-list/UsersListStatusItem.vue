<template>
  <li :class="`list-group-item ${liClass} d-flex align-items-center`">
    <svg v-if="item.status === 'accepted'" xmlns="http://www.w3.org/2000/svg" width="16"
         height="16" fill="currentColor"
         class="bi bi-check-circle-fill me-2" viewBox="0 0 16 16">
      <path
        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477
            9.417 5.384 7.323a.75.75 0 0 0-1.06
            1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0
            0-.01-1.05z"/>
    </svg>
    <svg v-else-if="item.status === 'unknown'" xmlns="http://www.w3.org/2000/svg" width="16"
         height="16" fill="currentColor"
         class="bi bi-x-circle-fill me-2" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647
      2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0
      0 0-.708-.708L8 7.293 5.354 4.646z"/>
    </svg>
    <span class="flex-grow-1">{{ text }} ({{ $t(`internshipModule.pdfStatus.${item.status}`) }})</span>
    <a v-if="item.status !== 'unknown'" href="#" @click.prevent="viewPDF" class="pe-3">
      {{ $t('internshipModule.forms.view') }}
    </a>
    <a v-if="item.status !== 'unknown'" href="#" @click.prevent="downloadPDF">
      {{ $t('internshipModule.forms.download') }}
    </a>
    <a :href="pdfLink" :download="fileName" hidden ref="downloadButton"></a>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { PdfDocument } from '@/store/types/PdfDocument';
import { loadPDFFile } from '@/utils/gateways';

export default defineComponent({
  name: 'UsersListStatusItem',
  props: {
    item: {
      type: Object as PropType<PdfDocument>,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      pdfLink: undefined as string | undefined,
    };
  },
  computed: {
    liClass() {
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
    },
    fileName() {
      if (!this.item.filePath) return 'unknown';
      return this.item.filePath.split('/').pop();
    },
  },
  methods: {
    async loadPDF() {
      const pdfFile = await loadPDFFile(this.item.filePath);
      this.pdfLink = URL.createObjectURL(pdfFile);
    },
    async viewPDF() {
      if (this.pdfLink === undefined) {
        await this.loadPDF();
      }
      window.open(this.pdfLink, '_blank');
    },
    async downloadPDF() {
      if (this.pdfLink === undefined) {
        await this.loadPDF();
      }
      (this.$refs.downloadButton as HTMLAnchorElement).click();
    },
  },
  unmounted() {
    if (this.pdfLink === undefined) return;
    URL.revokeObjectURL(this.pdfLink);
  },
});
</script>

<style scoped lang="scss">
iframe {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
