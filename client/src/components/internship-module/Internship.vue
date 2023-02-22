<template>
  <UploadPDFModal :internship-id="internship?._id" :pdf-type="pdfType" @updateInternship="data => $emit('updateInternship', data)"/>

  <div class="card internship-card border-htw-green">
    <div class="card-header">
      <h5 class="card-title">{{ $t("internshipModule.internship") }}</h5>
    </div>
    <div class="card-body">
      <div class="card mb-3 p-0">
        <div class="card-body pt-3 pb-0">
          <p class="card-text">
            <strong>{{ $t("internshipModule.information") }}</strong>
          </p>
          <table class="table table-striped table-sm table-borderless">
            <tbody>
            <tr>
              <td>{{ $t("internshipModule.semester") }}</td>
              <!-- @TODO: inSemester am internship fehlt -->
              <td>5 (TODO)</td>
            </tr>
            <tr>
              <td>{{ $t("internshipModule.startDate") }}</td>
              <td>
                {{
                  startDate?.toLocaleDateString($i18n.locale,
                    {day: "2-digit", month: "2-digit", year: "numeric"})
                }}
              </td>
            </tr>
            <tr>
              <td>{{ $t("internshipModule.endDate") }}</td>
              <td>
                {{
                  endDate?.toLocaleDateString($i18n.locale,
                    {day: "2-digit", month: "2-digit", year: "numeric"})
                }}
              </td>
            </tr>
            <tr>
              <td>{{ $t("internshipModule.duration") }}</td>
              <td v-if="duration">
                {{ duration }} {{ $t("internshipModule.weeks") }};
                <span v-if="duration < 16 && duration >= 8">{{ $t("internshipModule.longEnoughForPartial") }}</span>
                <span v-if="duration < 8"> {{ $t("internshipModule.notLongEnough") }}</span>
                <span v-if="duration >= 16">  {{ $t("internshipModule.longEnough") }}</span>
              </td>
            </tr>
            <tr>
              <td>{{ $t("internshipModule.operationalArea") }}</td>
              <td>{{ internship?.operationalArea }}</td>
            </tr>
            <tr>
              <td>{{ $t("internshipModule.tasks") }}</td>
              <td>{{ internship?.tasks }}</td>
            </tr>
            </tbody>
          </table>
          <p v-if="internship?.status === 'planned'" class="text-center">
            <a href="#" @click.prevent="loadRequestPdf">Antrag generieren</a>
          </p>
        </div>
      </div>
      <div class="card mb-3 p-0">
        <div class="card-body pt-3 pb-0">
          <p class="card-text">
            <strong> {{ $t("internshipModule.status.overview") }} </strong>
          </p>
          <table class="table table-striped table-sm table-borderless">
            <tbody>
            <tr v-for="(name, type) in pdfFiles" :key="type">
              <template v-for="pdfState in [getPdfState(type)]" :key="pdfState">
                <td>
                  <template v-if="pdfState === 'unknown'">{{ name }}</template>
                  <a v-else href="#" @click.prevent="openPDF(type)">{{ name }}</a>
                </td>
                <td>
                  <a
                    v-if="pdfState === 'unknown' || pdfState === 'rejected'"
                    href="#" data-bs-toggle="modal"
                    data-bs-target="#uploadPdfModal"
                    @click.prevent="pdfType = type"
                  >
                    {{ $t(`internshipModule.forms.${pdfState === 'unknown' ? 'upload' : 'reUpload'}`) }}
                  </a>
                </td>
                <td class="text-end">
                  <span
                    v-if="pdfState !== 'unknown'"
                    :class="['badge', getPdfStatusBadgeClass(pdfState)]"
                  >
                    {{ $t(`internshipModule.pdfStatus.${pdfState}`) }}
                  </span>
                </td>
              </template>
            </tr>
            <tr>
              <td>
                {{ $t("internshipModule.status.internship") }}
              </td>
              <td colspan="2">
                <p class="mb-1">{{ internshipStatus }}</p>
                <br>
                <!-- Status: planned -->
                <div v-if="internship?.status === 'planned'">
                  <div v-if="missingDocuments && missingDocuments?.length > 0">
                    {{ $t("internshipModule.status.missingPart1") }}
                    <span class="fw-bold">{{ $t("internshipModule.status.documents") }}</span>
                    {{ $t("internshipModule.status.missingPart2") }}
                    <ul class="mt-2" v-for="doc in missingDocuments" :key="doc">
                      <li>{{ doc }}</li>
                    </ul>
                    <p>{{ $t("internshipModule.status.pleaseUpload") }}</p>
                  </div>
                  <div v-if="missingFields && missingFields?.length > 0">
                    {{ $t("internshipModule.status.missingPart1") }}
                    <span class="fw-bold">{{ $t("internshipModule.status.details") }}</span>
                    {{ $t("internshipModule.status.missingPart2") }}
                    <ul class="mt-2" v-for="field in missingFields" :key="field">
                      <li>{{ field }}</li>
                    </ul>
                    <p>{{ $t("internshipModule.status.pleaseEditInternship") }}</p>
                  </div>
                </div>
                <!-- Status: requested -->
                <div v-if="internship?.status === 'requested'">
                  <p> {{ $t("internshipModule.status.requestedExplanation") }}</p>
                </div>
                <!-- Status: approved -->
                <div v-if="internship?.status === 'approved'">
                  <p> {{ $t("internshipModule.status.approvedExplanation") }}</p>
                </div>
                <!-- Status: over -->
                <div v-if="internship?.status === 'over'">
                  <div v-if="missingProof && missingProof?.length > 0">
                    {{ $t("internshipModule.status.missingProofPart1") }}
                    <span class="fw-bold">{{ $t("internshipModule.status.documents") }}</span>
                    {{ $t("internshipModule.status.missingProofPart2") }}
                    <ul class="mt-2" v-for="doc in missingProof" :key="doc">
                      <li>{{ doc }}</li>
                    </ul>
                  </div>
                </div>
                <!-- Status: readyForGrading -->
                <div v-if="internship?.status === 'readyForGrading'">
                  <p> {{ $t("internshipModule.status.readyForGradingExplanation") }}</p>
                </div>
                <!-- Status: passed -->
                <div v-if="internship?.status === 'passed'">
                  <p> {{ $t("internshipModule.status.passedExplanation") }}</p>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="my-3">
        <router-link v-if="internship?.status !== 'passed'" :to="{ name: 'EditInternship', params: { id: internship?._id } }">
          {{ $t("internshipModule.edit") }}
        </router-link>
        <button
          v-if="internship?.status === 'unknown' || internship?.status === 'planned'"
          @click="deleteInternship(internship?._id)"
          class="delete-button"
        >
          {{ $t("internshipModule.delete") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Internship } from '@/store/types/Internship';
import UploadPDFModal from '@/components/internship/UploadPDFModal.vue';
import http from '@/utils/http-common';
import { showErrorNotification, showSuccessNotification } from '@/utils/notification';
import { generateRequestPdf, loadPDFFile } from '@/utils/gateways';

export default defineComponent({
  name: 'Internship',
  components: { UploadPDFModal },
  data() {
    const pdfFiles = [
      'request',
      'lsfEctsProof',
      'locationJustification',
      'contract',
      'bvgTicketExemption',
      'certificate',
      'report',
    ].reduce((map, value) => ({ ...map, [value]: this.$t(`internshipModule.pdfTypes.${value}`) }), {});

    return {
      pdfType: 'request',
      pdfFiles,
    };
  },
  emits: ['updateInternship', 'deleteInternship'],
  props: {
    internship: {} as PropType<Internship>,
  },
  computed: {
    startDate(): Date | null {
      return this.internship != null ? new Date(this.internship.startDate) : null;
    },
    endDate(): Date | null {
      return this.internship != null ? new Date(this.internship.endDate) : null;
    },
    duration(): number | null {
      return this.internship != null ? Math.round(this.internship.duration * 10) / 10 : null;
    },
    internshipStatus(): string | null {
      const currentStatus = this.internship != null ? this.internship.status : null;
      if (!currentStatus) return null;
      const s = `internshipModule.status.${currentStatus}`;
      return `${this.$t(s)}`;
    },
    missingFields(): string[] | null {
      if (!this.internship) return null;
      const requiredFields = [
        { startDate: `${this.$t('internshipModule.startDate')}` },
        { endDate: `${this.$t('internshipModule.endDate')}` },
        { operationalArea: `${this.$t('internshipModule.operationalArea')}` },
        { tasks: `${this.$t('internshipModule.tasks')}` },
        { workingHoursPerWeek: `${this.$t('internshipModule.workingHoursPerWeek')}` },

      ];
      const missingFields = [] as string[];
      // eslint-disable-next-line no-restricted-syntax
      for (const field of requiredFields) {
        if (!Object.prototype.hasOwnProperty.call(this.internship, Object.keys(field)[0])) missingFields.push(Object.values(field)[0]);
      }
      const supervisorExists = this.internship?.supervisor;
      // nested object
      if (!supervisorExists || !this.internship.supervisor?.fullName || this.internship.supervisor?.fullName.length < 1) {
        missingFields.push(`${this.$t('company.supervisor.name')}`);
      }
      if (!supervisorExists || !this.internship.supervisor?.emailAddress || this.internship.supervisor?.emailAddress.length < 1) {
        missingFields.push(`${this.$t('company.supervisor.email')}`);
      }
      return missingFields;
    },
    missingDocuments(): string[] | null {
      if (!this.internship) return null;
      const requiredPdfs = [
        { lsfEctsProofPdf: `${this.$t('internshipModule.status.lsfEctsProofPdf')}` },
        { contractPdf: `${this.$t('internshipModule.status.contractPdf')}` },
        { requestPdf: `${this.$t('internshipModule.status.requestPdf')}` },
      ];
      const missingDocuments = [] as string[];
      // eslint-disable-next-line no-restricted-syntax
      for (const doc of requiredPdfs) {
        if (this.internship[Object.keys(doc)[0]].status === 'unknown') missingDocuments.push(Object.values(doc)[0]);
      }
      return missingDocuments;
    },
    missingProof(): string[] | null {
      if (!this.internship) return null;
      const requiredProof = [
        { reportPdf: `${this.$t('internshipModule.status.reportPdf')}` },
        { certificatePdf: `${this.$t('internshipModule.status.certificatePdf')}` },
      ];
      const missingProof = [] as string[];
      // eslint-disable-next-line no-restricted-syntax
      for (const doc of requiredProof) {
        if (this.internship[Object.keys(doc)[0]].status === 'unknown') missingProof.push(Object.values(doc)[0]);
      }
      return missingProof;
    },
  },
  methods: {
    async loadRequestPdf(): Promise<void> {
      if (!this.internship) return;
      const requestPdf = await generateRequestPdf(this.internship._id);
      window.open(URL.createObjectURL(requestPdf), '_blank');
    },
    getPdfState(pdfType: string): string | null {
      if (!this.internship) return null;
      return this.internship[`${pdfType}Pdf`].status;
    },
    getPdfStatusBadgeClass(pdfState: string): string {
      switch (pdfState) {
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
    async openPDF(pdfType: string): Promise<void> {
      if (!this.internship) return;
      const pdfFile = await loadPDFFile(this.internship[`${pdfType}Pdf`].filePath);
      window.open(URL.createObjectURL(pdfFile), '_blank');
    },
    async deleteInternship(internshipId: string | undefined) {
      if (!internshipId) return;
      const userDoubleChecked = window.confirm('Praktikum wirklich löschen?');
      if (userDoubleChecked) {
        try {
          const res = await http.delete(`/internships/${internshipId}`);
          if (res.status === 204) {
            await showSuccessNotification('Praktikum gelöscht!');
            this.$emit('deleteInternship');
          }
        } catch (err: any) {
          if (err.response?.data?.error?.message) err.message = err.response.data.error.message;
          await showErrorNotification(`Fehler beim Löschen vom Praktikum ${internshipId} [ERROR: ${err.message}]`);
        }
      }
    },
  },
});
</script>

<style lang="scss">
.internship-card {
  flex: 0 0 calc(50% - 1rem);
}

.delete-button {
  background: none;
  color: $danger;
  border: none;
  padding: 0;
  padding-left: 5px;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}
</style>
