<template>
  <div className="container">
    <div id="form">
      <fieldset class="form-group border p-3" style="background-color: #FFFFFF">
        <div>
          <h3>
            {{ $t("askForFeedback.header.giveFeedback") }}
          </h3>
        </div>
        <div>
          <label>
            {{ $t("askForFeedback.notice.share") }}
          </label>
        </div>
        <br>
        <form @submit.prevent="saveFeedback">
          <div className="col-auto">
            <select class="form-select"
                    id="selectFeedback"
                    v-model="selectedFeedback"
                    style="width: auto">
              <option selected value="null">
                {{ $t("askForFeedback.notice.dropdown") }}
              </option>
              <option v-for="(row, index) in dropdownMenu"
                      :key="index"
                      :value="row._id">{{ row.title }}
              </option>
            </select>
          </div>
          <br>
          <div className="col-auto">
            <div>
              <fieldset class="border p-3 rounded-3">
                <label>
                  {{ $t("askForFeedback.notice.onStudent") }}
                </label>
              </fieldset>
            </div>
            <br>
            <div>
              <textarea v-model="explanation"
                        className="form-control"
                        id="explanationTextarea"
                        rows="3"></textarea>
            </div>
          </div>
          <br>
          <div className="row">
            <div className="col-1" style="flex: 0 0 0;
            margin-right: 1px !important; padding-right: 1px;">
              <router-link to="../internship-module">
                <button type="button"
                        className="btn btn-secondary">
                  {{ $t("askForFeedback.button.skip") }}
                </button>
              </router-link>
            </div>
            <div className="col">
              <button className="btn btn-success btn-htw-green" type="submit">
                {{ $t("askForFeedback.button.save") }}
              </button>
            </div>
          </div>
        </form>
      </fieldset>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import http from '@/utils/http-common';
import Feedback from '@/models/Feedback';

export default defineComponent({
  name: 'AskForFeedback',
  data() {
    return {
      dropdownMenu: [] as Feedback[],
      explanation: null,
      selectedFeedback: null,
    };
  },
  mounted() {
    this.askForDropdownMenu();
  },
  methods: {
    async askForDropdownMenu() {
      try {
        const res = await http.get('/feedbacks', {
          params: {
            isFeedbackActive: true,
          },
        });
        this.dropdownMenu = await res.data;
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `${err.response.data.error.message}`,
          type: 'danger',
        });
      }
    },
    async saveFeedback() {
      try {
        await http.patch(`/internships/${this.$route.params.id}/feedbackToUpdate`, null, {
          params: {
            feedbackId: this.selectedFeedback,
            freetextFeedback: this.explanation,
          },
        });
        await this.$store.dispatch('addNotification', {
          text: 'Danke für Ihr Feedback',
          type: 'success',
        }).then(() => this.$router.push({ name: 'InternshipModuleIndex' }));
      } catch (err) {
        await this.$store.dispatch('addNotification', {
          text: `${err.response.data.error.message}`,
          type: 'danger',
        });
      }
    },
  },
});
</script>

<style scoped>
</style>
