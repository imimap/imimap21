<template>
  <div
    class="text-left modal fade"
    id="requestPdfModal"
    tabindex="-1"
    aria-labelledby="consentModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            {{ $t("internshipModule.forms.uploadApplication") }}
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
            <label for="requestPdfFileInput"
                   class="form-label">
                   {{ $t("internshipModule.forms.pickPDF") }}
            </label>
            <input class="form-control form-control-lg"
                   id="requestPdfFileInput"
                   type="file"
                   ref="requestPdfFile"
                   v-on:change="previewRequestPdf(($event.target as HTMLInputElement).files?.[0])"/>
            {{ requestPdf.name }}
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-htw-green"
            data-bs-dismiss="modal"
            aria-label="Close"
            v-on:click="uploadRequestPdf">
            {{ $t("internshipModule.forms.uploadNow") }}
          </button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
            {{ $t("internshipModule.forms.cancel") }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="card internship-card border-htw-green">
    <div class="card-header">
      <h5 class="card-title"> {{ $t("internshipModule.internship") }}</h5>
    </div>
    <div class="card-body">
      <div class="card mb-3 p-0">
        <div class="card-body pt-3 pb-0">
          <p class="card-text">
            <strong> {{ $t("internshipModule.information") }} </strong>
          </p>
          <table class="table table-striped table-sm table-borderless">
            <tbody>
            <tr>
              <td style="width:20%">
                {{ $t("internshipModule.semester") }}
              </td>
              <td>
                <!-- @TODO: inSemester am internship fehlt -->
                5 (TODO)
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                {{ $t("internshipModule.startDate") }}
              </td>
              <td>
                {{ startDate?.toLocaleDateString($i18n.locale,
                {day: "2-digit", month: "2-digit", year: "numeric"}) }}
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                {{ $t("internshipModule.endDate") }}
              </td>
              <td>
                {{ endDate?.toLocaleDateString($i18n.locale,
                {day: "2-digit", month: "2-digit", year: "numeric"}) }}
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                {{ $t("internshipModule.duration") }}
              </td>
              <td v-if="duration">
                 {{ duration}} {{ $t("internshipModule.weeks") }};
                <span v-if="duration < 16 && duration >= 8">{{ $t("internshipModule.longEnoughForPartial") }}</span>
                <span v-if="duration < 8"> {{ $t("internshipModule.notLongEnough") }}</span>
                <span v-if="duration >= 16">  {{ $t("internshipModule.longEnough") }}</span>
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                {{ $t("internshipModule.operationalArea") }}
              </td>
              <td>
                {{ internship?.operationalArea }}
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                {{ $t("internshipModule.tasks") }}
              </td>
              <td>
                {{ internship?.tasks }}
              </td>
            </tr>
            </tbody>
          </table>

        </div>
      </div>
      <div class="card mb-3 p-0">
        <div class="card-body pt-3 pb-0">
          <p class="card-text">
            <strong> {{ $t("internshipModule.status.overview") }} </strong>
          </p>
          <table class="table table-striped table-sm table-borderless">
            <tbody>
            <tr>
              <td style="width:40%">
                {{ $t("internshipModule.status.application") }}
              </td>
              <td class="text-right">
                <template v-if="requestPdfState === 'unknown'">
                  <button class="btn btn-htw-green"
                          data-bs-toggle="modal"
                          data-bs-target="#requestPdfModal">
                          {{ $t("internshipModule.forms.uploadApplication") }}
                  </button>
                </template>
                <template v-else>
                  {{ requestPdfState }}
                </template>
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                {{ $t("internshipModule.status.contract") }}              </td>
              <td>
                <template v-if="contractPdfState === 'unknown'">
                  <button class="btn btn-htw-green"
                          data-bs-toggle="modal"
                          data-bs-target="#requestPdfModal"
                          disabled>
                          {{ $t("internshipModule.forms.uploadContract") }}
                  </button>
                </template>
                <template v-else>
                  {{ contractPdfState }}
                </template>
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                {{ $t("internshipModule.status.report") }}
              </td>
              <td>
                <template v-if="reportPdfState === 'unknown'">
                  <button class="btn btn-htw-green"
                          data-bs-toggle="modal"
                          data-bs-target="#requestPdfModal"
                          disabled>
                          {{ $t("internshipModule.forms.uploadReport") }}
                  </button>
                </template>
                <template v-else>
                  {{ reportPdfState }}
                </template>
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                {{ $t("internshipModule.status.certificate") }}
              </td>
              <td>
                <template v-if="certificatePdfState === 'unknown'">
                  <button class="btn btn-htw-green"
                          data-bs-toggle="modal"
                          data-bs-target="#requestPdfModal"
                          disabled>
                          {{ $t("internshipModule.forms.uploadCertificate") }}
                  </button>
                </template>
                <template v-else>
                  {{ certificatePdfState }}
                </template>
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                {{ $t("internshipModule.status.internship") }}
              </td>
              <td>
                <p class="mb-1">{{ internshipStatus }}</p>
                <br>
                <!-- Status: planned -->
                <div v-if="internship?.status == 'planned'">
                  <div v-if="missingDocuments && missingDocuments?.length > 0" >
                    {{ $t("internshipModule.status.missingPart1") }}
                    <span class="fw-bold">{{ $t("internshipModule.status.documents") }}</span>
                    {{$t("internshipModule.status.missingPart2") }}
                    <ul class="mt-2" v-for="doc in missingDocuments" :key="doc">
                      <li>{{ doc }}</li>
                    </ul>
                    <p>{{ $t("internshipModule.status.pleaseUpload") }}</p>
                  </div>
                  <div v-if="missingFields && missingFields?.length > 0">
                    {{ $t("internshipModule.status.missingPart1") }}
                    <span class="fw-bold">{{ $t("internshipModule.status.details") }}</span>
                    {{$t("internshipModule.status.missingPart2") }}
                    <ul class="mt-2" v-for="field in missingFields" :key="field">
                      <li>{{ field }}</li>
                    </ul>
                    <p>{{ $t("internshipModule.status.pleaseEditInternship") }}</p>
                  </div>
                </div>
                  <!-- Status: requested -->
                <div v-if="internship?.status == 'requested'">
                  <p> {{ $t("internshipModule.status.requestedExplanation") }}</p>
                </div>
                 <!-- Status: approved -->
                 <div v-if="internship?.status == 'approved'">
                  <p> {{ $t("internshipModule.status.approvedExplanation") }}</p>
                </div>
                <!-- Status: over -->
                <div v-if="internship?.status == 'over'">
                  <div v-if="missingProof && missingProof?.length > 0" >
                    {{ $t("internshipModule.status.missingProofPart1") }}
                    <span class="fw-bold">{{ $t("internshipModule.status.documents") }}</span>
                    {{$t("internshipModule.status.missingProofPart2") }}
                    <ul class="mt-2" v-for="doc in missingProof" :key="doc">
                      <li>{{ doc }}</li>
                    </ul>
                  </div>
                </div>
                <!-- Status: readyForGrading -->
                <div v-if="internship?.status == 'readyForGrading'">
                  <p> {{ $t("internshipModule.status.readyForGradingExplanation") }}</p>
                </div>
                <!-- Status: passed -->
                <div v-if="internship?.status == 'passed'">
                  <p> {{ $t("internshipModule.status.passedExplanation") }}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                {{ $t("internshipModule.comment") }}
              </td>
              <td>
                Life? Don't talk to me about life.
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="my-3">
        <router-link v-if="internship?.status !== 'passed'" :to="{ name: 'EditInternship', params: { id: internship?._id } }">
          Bearbeiten
        </router-link>
        <button v-if="internship?.status == 'unknown' || internship?.status == 'planned'"
        @click="deleteInternship(internship?._id)" class="delete-button">Löschen</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Internship } from '@/store/types/Internship';
import http from '@/utils/http-common';
import store from '@/store';
import { showErrorNotification } from '@/utils/notification';

export default defineComponent({
  name: 'Internship',
  data() {
    return {
      requestPdf: {} as File,
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
    requestPdfState(): string | null {
      return this.internship != null ? this.internship.requestPdf.status : null;
    },
    contractPdfState(): string | null {
      return this.internship != null ? this.internship.contractPdf.status : null;
    },
    lsfEctsProofPdfState(): string | null {
      return this.internship != null ? this.internship.lsfEctsProofPdf.status : null;
    },
    locationJustificationPdfState(): string | null {
      return this.internship != null ? this.internship.locationJustificationPdf.status : null;
    },
    bvgTicketExemptionRequestPdfState(): string | null {
      return this.internship != null ? this.internship.bvgTicketExemptionRequestPdf.status : null;
    },
    certificatePdfState(): string | null {
      return this.internship != null ? this.internship.certificatePdf.status : null;
    },
    reportPdfState(): string | null {
      return this.internship != null ? this.internship.reportPdf.status : null;
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
    previewRequestPdf(file: File | undefined) {
      if (!file) return;
      this.requestPdf = file;
    },
    async uploadRequestPdf() {
      try {
        const formData = new FormData();
        formData.append('pdf', this.requestPdf);
        const res = await http.post(
          `/internships/${this.internship?._id}/pdf/request`,
          formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        await this.$emit('updateInternship', res.data);
      } catch (err: any) {
        console.log(err);
      }
    },
    async deleteInternship(internshipId: string | undefined) {
      if (!internshipId) return;
      const userDoubleChecked = window.confirm('Praktikum wirklich löschen?');
      if (userDoubleChecked) {
        try {
          const res = await http.delete(`/internships/${internshipId}`);
          if (res.status === 204) {
            await store.dispatch('addNotification', {
              text: 'Praktikum gelöscht!',
              type: 'success',
            });
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
