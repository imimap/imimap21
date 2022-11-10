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
                {{ internshipStatus }}
              <br>
              <p v-if="internship?.status == 'planned'">
              <span v-if="missingDocuments && missingDocuments?.length > 0" >
                {{ $t("internshipModule.status.missingDocuments") }}
                <ul v-for="doc in missingDocuments" :key="doc">
                  <li>{{ doc }}</li>
                </ul>
                <p>Bitte lade diese hier noch hoch.</p>
              </span>
              <span v-if="missingFields && missingFields?.length > 0">Folgende <strong>Angaben</strong> fehlen für die Beantragung deines Praktikums:
                <ul v-for="field in missingFields" :key="field">
                  <li>{{ field }}</li>
                </ul>
                <p>Bitte bearbeite dafür dein Praktikum nochmal.</p>
              </span>

              </p>
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
        'startDate',
        'endDate',
        'operationalArea',
        'tasks',
        'workingHoursPerWeek',
      ];
      const missingFields = [] as string[];
      // eslint-disable-next-line no-restricted-syntax
      for (const field of requiredFields) {
        if (!Object.prototype.hasOwnProperty.call(this.internship, field)) missingFields.push(field);
      }
      // nested object
      if (!Object.prototype.hasOwnProperty.call(this.internship, 'supervisor')) {
        missingFields.push('supervisor.fullName');
        missingFields.push('supervisor.emailAddress');
      } else {
        if (!Object.prototype.hasOwnProperty.call(this.internship.supervisor, 'fullName')) missingFields.push('supervisor.fullName');
        if (!Object.prototype.hasOwnProperty.call(this.internship.supervisor, 'emailAddress')) missingFields.push('supervisor.emailAddress');
      }

      return missingFields;
    },
    missingDocuments(): string[] | null {
      if (!this.internship) return null;
      const requiredPdfs = ['lsfEctsProofPdf', 'contractPdf', 'requestPdf'];
      const missingDocuments = [] as string[];
      // eslint-disable-next-line no-restricted-syntax
      for (const doc of requiredPdfs) {
        if (this.internship[doc].status === 'unknown') missingDocuments.push(doc);
      }
      return missingDocuments;
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
