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
          <button type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  ref="closeButton"
          />
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
            <label for="industry" class="form-label">Website</label>
            <input type="text" class="form-control" id="website"
                   aria-describedby="website"
                   :placeholder="company?.website"
                   v-model="website"
            />
          </div>

          <div class="mb-3">
            <label for="mainLanguage" class="form-label">Sprache</label>
            <select id="mainLanguage"
                    class="form-select"
                    aria-describedby="mainLanguage"
                    @change="changeLanguage"
            >
              <option value="" :selected="!company?.mainLanguage">Bitte auswählen</option>
              <option v-for="[id, language] in languages"
                      :key="id"
                      :value="id"
                      :selected="company?.mainLanguage === id"
              >
                {{ language.prettyPrint() }}
              </option>
            </select>
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
                     :checked="company?.excludedFromSearch"
                     @change="changeExcludedFromSearch"
              >
            </div>
          </div>

          <div class="mb-3">
            <label for="size" class="form-label">Größe</label>
            <select
              class="form-select"
              aria-label="Größe"
              id="size"
              @change="changeSize"
            >
              <option v-for="size in companySizes"
                      :key="size[0]"
                      :value="size[0]"
                      :selected="company?.size === size[0]"
              >
                {{ size[1] }}
              </option>
            </select>
          </div>

          <fieldset class="mb-3">
            <legend>Adresse</legend>
            <div class="mb-2 row g-2 align-items-center">
              <div class="col-9">
                <label for="street" class="form-label">Straße</label>
                <input type="text"
                       class="form-control"
                       id="street"
                       aria-describedby="street"
                       :placeholder="company?.address.street"
                       v-model="street"
                />
              </div>

              <div class="col-3">
                <label for="number" class="form-label">Nr.</label>
                <input type="text"
                       class="form-control"
                       aria-describedby="number"
                       id="number"
                       :placeholder="company?.address.streetNumber"
                       v-model="streetNumber"
                />
              </div>
            </div>

            <div class="col-12 mb-2">
              <label for="additionalLines" class="form-label">Zusätzliche Angaben</label>
              <input type="text"
                     class="form-control"
                     aria-describedby="additionalLines"
                     id="additionalLines"
                     :placeholder="company?.address.additionalLines"
                     v-model="additionalLines"
              />
            </div>

            <div class="mb-2 row g-2 align-items-center">
              <div class="col-3">
                <label for="zip" class="form-label">PLZ</label>
                <input type="text"
                       class="form-control"
                       aria-describedby="zip"
                       id="zip"
                       :placeholder="company?.address.zip"
                       v-model="zip"
                />
              </div>

              <div class="col-9">
                <label for="city" class="form-label">Stadt</label>
                <input type="text"
                       class="form-control"
                       aria-describedby="city"
                       id="city"
                       :placeholder="company?.address.city"
                       v-model="city"
                />
              </div>

              <div class="col-12">
                <label for="country" class="form-label">Land</label>
                <input type="text"
                       class="form-control"
                       aria-describedby="country"
                       id="country"
                       :placeholder="company?.address.country"
                       v-model="country"
                />
              </div>
            </div>
          </fieldset>
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
import Company, { companySizes } from '@/models/Company';
import { createPayloadFromChangedProps } from '@/utils/admin';
import { updateCompany } from '@/utils/gateways';
import { showSuccessNotification } from '@/utils/notification';
import Language from '@/store/types/Language';

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
      website: undefined as string | undefined,
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
    };

    const updatableProperties = Object.keys(initialProps);

    return {
      updatableProperties,
      ...initialProps,
      companySizes: Object.entries(companySizes),
    };
  },
  computed: {
    languages(): Map<string, Language> {
      return this.$store.getters.getLanguages;
    },
  },
  methods: {
    async updateCompany() {
      if (!this.company) return;
      const payload = createPayloadFromChangedProps(
        this.updatableProperties,
        this.$data,
        this.company,
      );
      const updatedCompany = await updateCompany(this.company._id, payload);
      if (updatedCompany === null) return;
      this.$emit('updateCompany', this.company, updatedCompany);
      await showSuccessNotification('Änderungen am Unternehmen gespeichert');
      (this.$refs.closeButton as HTMLButtonElement).click();
      this.reset();
    },
    reset() {
      this.updatableProperties.forEach((prop) => {
        this.$data[prop] = undefined;
      });
    },
    changeLanguage(event: Event) {
      this.mainLanguage = (event.target as HTMLSelectElement).value;
    },
    changeSize(event: Event) {
      this.size = (event.target as HTMLSelectElement).value;
    },
    changeExcludedFromSearch(event: Event) {
      this.excludedFromSearch = Boolean((event.target as HTMLInputElement).checked);
    },
  },
});
</script>
