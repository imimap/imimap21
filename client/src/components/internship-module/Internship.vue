<template>
  <UploadPDFModal :internship-id="internship._id" :pdf-type="modalPdfType" @updateInternship="data => $emit('updateInternship', data)"/>

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
              <td>{{ $t("internshipModule.startDate") }}</td>
              <td>
                {{
                  startDate?.toLocaleDateString($i18n.locale,
                    { day: "2-digit", month: "2-digit", year: "numeric" })
                }}
              </td>
            </tr>
            <tr>
              <td>{{ $t("internshipModule.endDate") }}</td>
              <td>
                {{
                  endDate?.toLocaleDateString($i18n.locale,
                    { day: "2-digit", month: "2-digit", year: "numeric" })
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
              <td>{{ internship.operationalArea }}</td>
            </tr>
            <tr>
              <td>{{ $t("internshipModule.tasks") }}</td>
              <td>{{ internship.tasks }}</td>
            </tr>
            </tbody>
          </table>
          <p v-if="internship.status === 'planned'" class="text-center">
            <a href="#" @click.prevent="loadRequestPdf">{{ $t("internship.heading.applicationForm") }}</a>
          </p>
          <p class="text-center">
            <a href="https://imi-bachelor.htw-berlin.de/studium/praktikum/#c10774" target="_blank">
              {{ $t("internship.heading.certificateForm") }}
            </a>
          </p>
        </div>
      </div>
      <div class="card mb-3 p-0">
        <div class="card-body pt-3 pb-0">
          <p class="card-text">
            <strong> {{ $t("internshipModule.status.overview") }} </strong>
          </p>
          <table class="table table-sm table-borderless">
            <tbody>
              <tr class="ds-head">
                <td colspan="42">{{ $t("internshipModule.applicationPhase") }}</td>
              </tr>
            <template v-for="type in pdfTypes" :key="type">
              <tr v-if="type === 'certificate'" class="ds-head">
                <td colspan="42">{{ $t("internshipModule.gradingPhase") }}</td>
            </tr>
              <tr>
                <InternshipPdf :pdf="internship[`${type}Pdf`]" :id="internship._id" :type="type" @setModalPdfType="modalPdfType = type"/>
              </tr>
            </template>
            <tr class="ds-head">
              <td>
                {{ $t("internshipModule.status.internship") }}
              </td>
              <td colspan="2">
                <p class="mb-1"><strong>{{ internshipStatus }}</strong></p>
                <br>
                <InternshipStatus :internship="internship"/>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card mb-3">
        <div class="card-body">
          <p class="card-text">
            <strong>{{ $t("internshipModule.links.title") }}</strong>
          </p>
          <ul>
            <li>
              <a href="https://imi-bachelor.htw-berlin.de/studium/praktikum/" target="_blank">
                {{ $t("internshipModule.links.website") }}
              </a>
            </li>
            <li>
              {{ $t("internshipModule.links.contract") }} (
              <a href="https://imi-bachelor.htw-berlin.de/files/Stg/IMI/Praktikumsvertrag_de.pdf" target="_blank">
                deutsch
              </a>,
              <a href="https://imi-bachelor.htw-berlin.de/files/Stg/IMI/Praktikumsvertrag_en.pdf" target="_blank">
                english
              </a>)
            </li>
            <li>
              {{ $t("internshipModule.links.certificate") }} (
              <a href="https://imi-bachelor.htw-berlin.de/files/Stg/IMI/Nachweisformular-Praktikum-IMI-B-de.pdf" target="_blank">
                deutsch
              </a>,
              <a href="https://imi-bachelor.htw-berlin.de/files/Stg/IMI/Certificate-Internship-IMI-B-en.pdf" target="_blank">
                english
              </a>)
            </li>
          </ul>
        </div>
      </div>
      <div class="my-3">
        <router-link v-if="internship.status !== 'passed'" :to="{ name: 'EditInternship', params: { id: internship._id } }">
          {{ $t("internshipModule.edit") }}
        </router-link>
        <button
          v-if="internship.status === 'unknown' || internship.status === 'planned'"
          @click="deleteInternship(internship._id)"
          class="delete-button"
        >
          {{ $t("internshipModule.delete") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Internship } from '@/store/types/Internship';
import UploadPDFModal from '@/components/internship/UploadPDFModal.vue';
import http from '@/utils/http-common';
import { showErrorNotification, showSuccessNotification } from '@/utils/notification';
import { generateRequestPdf } from '@/utils/gateways';
import InternshipStatus from '@/components/internship-module/InternshipStatus.vue';
import InternshipPdf from '@/components/internship-module/InternshipPdf.vue';
import internshipModule from '@/locales/de/internshipModule';

export default defineComponent({
  name: 'Internship',
  components: { InternshipPdf, InternshipStatus, UploadPDFModal },
  data() {
    return {
      modalPdfType: '',
      pdfTypes: [
        'request',
        'contract',
        'lsfEctsProof',
        'locationJustification',
        // 'bvgTicketExemption',
        'certificate',
        'report',
      ],
    };
  },
  emits: ['updateInternship', 'deleteInternship'],
  props: {
    internship: {
      type: Object as () => Internship,
      required: true,
    },
  },
  computed: {
    startDate(): Date | null {
      return new Date(this.internship.startDate);
    },
    endDate(): Date | null {
      return new Date(this.internship.endDate);
    },
    duration(): number | null {
      return Math.round(this.internship.duration * 10) / 10;
    },
    internshipStatus(): string | null {
      const currentStatus = this.internship.status;
      if (!currentStatus) return null;
      const s = `internshipModule.status.${currentStatus}`;
      return `${this.$t(s)}`;
    },
  },
  methods: {
    async loadRequestPdf(): Promise<void> {
      const requestPdf = await generateRequestPdf(this.internship._id);
      window.open(URL.createObjectURL(requestPdf), '_blank');
    },
    async deleteInternship(internshipId: string | undefined) {
      if (!internshipId) return;
      // TODO: Replace with custom popup
      // eslint-disable-next-line no-alert
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
  padding: 0 0 0 5px;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}

.ds-head {
    background-color: var(--bs-table-striped-bg);
}
</style>
