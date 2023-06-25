<template>
  <td>
    <template v-if="pdf.status === 'unknown'">{{ name }}</template>
    <a v-else href="#" @click.prevent="openPDF">{{ name }}</a>
  </td>
  <td>
    <a
      v-if="pdf.status === 'unknown' || pdf.status === 'rejected'"
      href="#"
      data-bs-toggle="modal"
      :data-bs-target="idComm"
      @click.prevent="$emit('setModalPdfType')"
    >
      {{ $t(`internshipModule.forms.${pdf.status === 'unknown' ? 'upload' : 'reUpload'}`) }}
    </a>
  </td>
  <td class="text-end">
    <span v-if="type === 'locationJustification'" >
      <font-awesome-icon
      icon="question-circle"
      class="ms-1"
      data-bs-toggle="loctooltip"
      data-bs-placement="right"
      :data-bs-title="locComm"
      ref="locationTooltip"
      />
    </span>
    <span
      v-if="pdf.status !== 'unknown'"
      :class="['badge', statusBadgeClass]"
    >
      {{ $t(`internshipModule.pdfStatus.${pdf.status}`) }}
    </span>

    <font-awesome-icon
      v-if="showStatusReason"
      icon="question-circle"
      class="ms-1"
      data-bs-toggle="tooltip"
      data-bs-placement="right"
      :data-bs-title="statusReason"
      ref="statusReasonTooltip"
    />
  </td>
</template>

<script lang="ts">
import { ComponentPublicInstance, defineComponent } from 'vue';
import { PdfDocument } from '@/store/types/PdfDocument';
import { Event } from '@/store/types/Event';
import { loadPDFFile } from '@/utils/gateways';
import { Tooltip } from 'bootstrap';

export default defineComponent({
  name: 'InternshipPdf',
  props: {
    pdf: {
      type: Object as () => PdfDocument,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    id: String,
  },
  emits: ['setModalPdfType'],
  computed: {
    idComm(): string {
      return `#UploadPDFModal_${this.id}`;
    },
    locComm(): string {
      return this.$t('internshipModule.commentLocation');
    },
    name(): string {
      return this.$t(`internshipModule.pdfTypes.${this.type}`);
    },
    statusBadgeClass(): string {
      switch (this.pdf.status) {
        case 'submitted':
          return 'bg-warning';
        case 'accepted':
          return 'bg-success';
        case 'rejected':
          return 'bg-danger';
        default:
          return 'bg-secondary';
      }
    },
    showStatusReason(): boolean {
      return this.pdf.status === 'rejected';
    },
    statusReason(): string {
      const latestEvent = this.pdf.events.reduce(
        (event, next) => (event.timestamp < next.timestamp ? next : event),
        { timestamp: 0 } as Event,
      );
      return latestEvent.comment ?? '';
    },
  },
  methods: {
    async openPDF(): Promise<void> {
      const pdfFile = await loadPDFFile(this.pdf.filePath);
      window.open(URL.createObjectURL(pdfFile), '_blank');
    },
  },
  mounted() {
    if (this.$refs.locationTooltip) {
      const loctooltip = (this.$refs.locationTooltip as ComponentPublicInstance).$el;
      // eslint-disable-next-line no-new
      new Tooltip(loctooltip as Element);
    }
    if (!this.showStatusReason) return;
    const tooltip = (this.$refs.statusReasonTooltip as ComponentPublicInstance).$el;
    // eslint-disable-next-line no-new
    new Tooltip(tooltip as Element);
  },
});
</script>

<style scoped>

</style>
