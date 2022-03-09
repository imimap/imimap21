<template>
  <div class="modal fade"
       id="companyEditModal"
       tabindex="-1"
       aria-labelledby="companyEditModalLabel"
       aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="companyEditModalLabel">Firma bearbeiten</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control" id="name"
                   aria-describedby="name"
                   :placeholder="company?.companyName"
                   v-model="companyName"
            />
          </div>

          <div class="mb-3">
            <label for="branchName" class="form-label">Zweig Name</label>
            <input type="text" class="form-control" id="branchName"
                   aria-describedby="branchName"
                   :placeholder="company?.branchName"
                   v-model="branchName"
            />
          </div>

          <div class="mb-3">
            <label for="industry" class="form-label">Industrie</label>
            <input type="text" class="form-control" id="industry"
                   aria-describedby="industry"
                   :placeholder="company?.industry"
                   v-model="industry"
            />
          </div>

          <div class="mb-3">
            <label for="mainLanguage" class="form-label">Sprache</label>
            <input type="text" class="form-control" id="mainLanguage"
                   aria-describedby="mainLanguage"
                   :placeholder="company?.mainLanguage"
                   v-model="mainLanguage"
            />
          </div>

          <div class="mb-3">
            <label for="comment" class="form-label">Kommentar</label>
            <textarea class="form-control"
                      id="comment"
                      :placeholder="company?.comment"
                      v-model="comment"
            ></textarea>
          </div>

          <div class="mb-3">
            <label for="excludedFromSearch" class="form-label">Unsichtbar in der Suche</label>
            <div class="form-check form-switch">
              <input class="form-check-input"
                     type="checkbox"
                     id="excludedFromSearch"
                     :placeholder="company?.excludedFromSearch"
                     v-model="excludedFromSearch"
              >
            </div>
          </div>

          <div class="mb-3">
            <label for="size" class="form-label">Größe</label>
            <select
                class="form-select"
                aria-label="Größe"
                id="size"
                v-model="size"
            >
              <option>SMALL</option>
              <option>MEDIUM</option>
              <option>LARGE</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="address" class="form-label">Adresse</label>
            <div class="mb-2 row g-2 align-items-center">
              <div class="col-6">
                <input type="text"
                       class="form-control"
                       id="address"
                       aria-describedby="address"
                       :placeholder="company?.address.street"
                       v-model="street"
                />
              </div>

              <div class="col-6">
                <input type="text"
                       class="form-control"
                       aria-describedby="number"
                       :placeholder="company?.address.streetNumber"
                       v-model="streetNumber"
                />
              </div>
            </div>

            <div class="mb-2 row g-2 align-items-center">
              <div class="col-6">
                <input type="text"
                       class="form-control"
                       aria-describedby="zip"
                       :placeholder="company?.address.zip"
                       v-model="zip"
                />
              </div>

              <div class="col-6">
                <input type="text"
                       class="form-control"
                       aria-describedby="city"
                       :placeholder="company?.address.city"
                       v-model="city"
                />
              </div>

              <div class="col-12">
                <input type="text"
                       class="form-control"
                       aria-describedby="country"
                       :placeholder="company?.address.country"
                       v-model="country"
                />
              </div>

              <div class="col-12">
                <input type="text"
                       class="form-control"
                       aria-describedby="additionalLines"
                       :placeholder="company?.address.additionalLines"
                       v-model="additionalLines"
                />
              </div>

              <div class="col-6">
                <input type="text"
                       class="form-control"
                       aria-describedby="latitude"
                       :placeholder="company?.address.coordinates.latitude"
                       v-model="latitude"
                />
              </div>

              <div class="col-6">
                <input type="text"
                       class="form-control"
                       aria-describedby="longitude"
                       :placeholder="company?.address.coordinates.longitude"
                       v-model="longitude"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Schließen
          </button>
          <button type="button"
                  class="btn btn-success"
                  @click="updateCompany"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Company from '@/models/Company';
import { createPayloadFromChangedProps } from "@/utils/admin";
import { updateInternship } from "@/utils/gateways";
import { showSuccessNotification } from "@/utils/notification";

export default defineComponent({
  name: 'EditCompanyModal',
  props: {
    company: Object as PropType<Company>,
  },
  data() {
    const initialProps = {
      companyName: undefined as string | undefined,
      branchName: undefined as string | undefined,
      industry: undefined as string | undefined,
      mainLanguage: undefined as string | undefined,
      comment: undefined as string | undefined,
      excludedFromSearch: undefined as boolean | undefined,
      size: undefined as string | undefined,
      street: undefined as string | undefined,
      streetNumber: undefined as string | undefined,
      zip: undefined as string | undefined,
      city: undefined as string | undefined,
      country: undefined as string | undefined,
      additionalLines: undefined as string | undefined,
      latitude: undefined as string | undefined,
      longitude: undefined as string | undefined,
    };

    const updatableProperties = Object.keys(initialProps);

    return {
      updatableProperties,
      ...initialProps,
    };
  },
  methods: {
    async updateCompany() {
      // TODO: Remodel to fit company
      if (!this.company) return;
      const payload = createPayloadFromChangedProps(
          this.updatableProperties,
          this.$data,
          this.company,
      );
      const updatedInternship = await updateInternship(this.company._id, payload);
      if (updatedInternship === null) return;
      this.$emit('updateInternship', this.student?._id, this.company, updatedInternship);
      await showSuccessNotification('Änderungen am Praktikum gespeichert');
      (this.$refs.closeButton as HTMLButtonElement).click();
      this.reset();
    },
    reset() {
      this.updatableProperties.forEach((prop) => {
        this.$data[prop] = undefined;
      });
    },
  },
});
</script>

<style scoped lang="scss">

</style>
