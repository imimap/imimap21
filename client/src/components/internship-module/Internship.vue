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
            Praktikumsantrag hochladen
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
              Praktikumsantrag als PDF auswählen
            </label>
            <input class="form-control form-control-lg"
                   id="requestPdfFileInput"
                   type="file"
                   ref="requestPdfFile"
                   v-on:change="previewRequestPdf($event.target.files[0])"/>
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
            Antrag hochladen
          </button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="card internship-card border-htw-green">
    <div class="card-header">
      <h5 class="card-title">Praktikum</h5>
    </div>
    <div class="card-body">
      <div class="card mb-3 p-0">
        <div class="card-body pt-3 pb-0">
          <p class="card-text">
            <strong> Informationen </strong>
          </p>
          <table class="table table-striped table-sm table-borderless">
            <tbody>
            <tr>
              <td style="width:20%">
                Semester
              </td>
              <td>
                <!-- @TODO: inSemester am internship fehlt -->
                5
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Anfangsdatum
              </td>
              <td>
                {{ startDate }}
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Enddatum
              </td>
              <td>
                {{ internship.endDate }}
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Dauer
              </td>
              <td>
                lang genug für ein Teilpraktikum (13.86 Wochen)
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Einsatzgebiet
              </td>
              <td>
                {{ internship.operationalArea }}
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Aufgaben
              </td>
              <td>
                {{ internship.tasks }}
              </td>
            </tr>
            </tbody>
          </table>

        </div>
      </div>
      <div class="card mb-3 p-0">
        <div class="card-body pt-3 pb-0">
          <p class="card-text">
            <strong> Statusübersicht </strong>
          </p>
          <table class="table table-striped table-sm table-borderless">
            <tbody>
            <tr>
              <td style="width:40%">
                Status der Anmeldung
              </td>
              <td class="text-right">
                <template v-if="requestPdfState === 'unknown'">
                  <button class="btn btn-htw-green"
                          data-bs-toggle="modal"
                          data-bs-target="#requestPdfModal">
                    Praktikumsantrag hochladen
                  </button>
                </template>
                <template v-else>
                  {{ requestPdfState }}
                </template>
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Status des Vertrags
              </td>
              <td>
                <template v-if="contractPdfState === 'unknown'">
                  <button class="btn btn-htw-green"
                          data-bs-toggle="modal"
                          data-bs-target="#requestPdfModal"
                          disabled>
                    Praktikumsvertrag hochladen
                  </button>
                </template>
                <template v-else>
                  {{ contractPdfState }}
                </template>
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Status des Berichts
              </td>
              <td>
                <template v-if="reportPdfState === 'unknown'">
                  <button class="btn btn-htw-green"
                          data-bs-toggle="modal"
                          data-bs-target="#requestPdfModal"
                          disabled>
                    Praktikumsbericht hochladen
                  </button>
                </template>
                <template v-else>
                  {{ reportPdfState }}
                </template>
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Status des Zertifikats
              </td>
              <td>
                <template v-if="certificatePdfState === 'unknown'">
                  <button class="btn btn-htw-green"
                          data-bs-toggle="modal"
                          data-bs-target="#requestPdfModal"
                          disabled>
                    Praktikumszertifikat hochladen
                  </button>
                </template>
                <template v-else>
                  {{ certificatePdfState }}
                </template>
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Status des Praktikums
              </td>
              <td>
                {{ this.internship.status }}
              </td>
            </tr>
            <tr>
              <td style="width:20%">
                Kommentar
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
        <router-link v-if="this.internship.status !== 'passed'"
        :to="{ name: 'EditInternship', params: { id: this.internship._id } }">
          Bearbeiten
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Internship } from '@/store/types/Internship';
import http from '@/utils/http-common';

export default defineComponent({
  name: 'Internship',
  data() {
    return {
      requestPdf: {} as File,
    };
  },
  emits: ['updateInternship'],
  props: {
    internship: {} as PropType<Internship>,
  },
  computed: {
    startDate(): Date | null {
      return this.internship != null ? new Date(this.internship.startDate) : null;
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
  },
  methods: {
    previewRequestPdf(file) {
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
  },
});
</script>

<style lang="scss">
.internship-card {
  flex: 0 0 calc(50% - 1rem);
}
</style>
