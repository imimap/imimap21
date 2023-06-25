<template>
  <li :class="`list-group-item ${liClass} d-flex align-items-center`">
    <font-awesome-icon v-if="icon" :icon="icon" class="me-1"/>
    <span class="flex-grow-1">{{ text }} ({{ $t(`internshipModule.pdfStatus.${item.status}`) }})</span>
    <template v-if="item.status !== 'unknown'">
      <a
        v-if="type == 'request' || type == 'certificate'"
        href="#"
        @click.prevent="modalAccept?.show"
        class="pe-3 text-success"
        :title="$t('internshipModule.pdfActions.accept')"
      >
        <font-awesome-icon icon="upload"/>
        <font-awesome-icon icon="check-circle"/>
      </a>
      <a
        v-if="type !== 'request' && type !== 'certificate'"
        href="#"
        @click.prevent="accept"
        class="pe-3 text-success"
        :title="$t('internshipModule.pdfActions.accept')"
      >
        <font-awesome-icon icon="check-circle"/>
      </a>
      <!--suppress TypeScriptUnresolvedReference -->
      <a
        href="#"
        @click.prevent="modalReject?.show"
        class="pe-3 text-danger"
        :title="$t('internshipModule.pdfActions.reject')"
      >
        <font-awesome-icon icon="circle-xmark"/>
      </a>
      <a
        href="#"
        @click.prevent="viewPDF"
        class="pe-3 text-primary"
        :title="$t('internshipModule.forms.view')"
      >
        <font-awesome-icon icon="eye"/>
      </a>
      <a
        href="#"
        @click.prevent="downloadPDF"
        class="text-primary"
        :title="$t('internshipModule.forms.download')"
      >
        <font-awesome-icon icon="download"/>
      </a>
      <a :href="pdfLink" :download="fileName" hidden ref="downloadButton"></a>
    </template>
  </li>
  <!--suppress TypeScriptUnresolvedReference -->
  <PdfRejectModal :pdf-id="item.id" @reject="reject" @close="modalReject?.hide"/>
  <PdfAcceptModal :internship-id="internshipId" :pdf-type="type" :pdf-id="item.id" @accept="accept" @close="modalAccept?.hide"/>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { PdfDocument } from '@/store/types/PdfDocument';
import { loadPDFFile } from '@/utils/gateways';
import PdfRejectModal from '@/components/admin/modals/PdfRejectModal.vue';
import PdfAcceptModal from '@/components/admin/modals/PdfAcceptModal.vue';
import { Modal } from 'bootstrap';

export default defineComponent({
  name: 'UsersListStatusItem',
  components: { PdfRejectModal, PdfAcceptModal },
  props: {
    internshipId: String,
    item: {
      type: Object as PropType<PdfDocument>,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  emits: ['acceptPdf', 'rejectPdf'],
  data() {
    return {
      pdfLink: undefined as string | undefined,
      modalReject: null as Modal | null,
      modalAccept: null as Modal | null,
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
    icon() {
      switch (this.item.status) {
        case 'accepted':
          return 'check-circle';
        case 'rejected':
          return 'circle-xmark';
        default:
          return '';
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
    async accept() {
      if (this.modalAccept !== null) this.modalAccept.hide();
      this.$emit('acceptPdf', this.type);
    },
    async reject(reason: string) {
      if (this.modalReject !== null) this.modalReject.hide();
      this.$emit('rejectPdf', this.type, reason);
    },
  },
  mounted() {
    this.modalReject = new Modal(`#reject-pdf-modal-${this.item.id}`);
    this.modalAccept = new Modal(`#accept-pdf-modal-${this.item.id}`);
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
