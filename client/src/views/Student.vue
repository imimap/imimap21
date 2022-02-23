<template>
<div class="container">
  <div id="form-block4" class="text-left mt-5 mx-3">
    <h3> Persönliche Details</h3>
    <div class="alert alert-primary">
        <small>
          <label class="required_application">Die mit </label>
          markierten Felder werden für einen vollständigen Antrag benötigt.
          Speichern kannst du aber auch, ohne diese auszufüllen.
        </small>
    </div>
    <div class="row mb-3">
      <div class="col-md-4">
        Matrikelnummer<br>
        <span class="form-control-static pl-2 pt-5">
          {{ userProfile.studentProfile.studentId.substring(
          2,
          userProfile.studentProfile.studentId.length
          ) }}
        </span>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-md-4">
        Email<br>
        <span class="form-control-static pl-2 pt-5">
          {{ userProfile.emailAddress }}
        </span>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-md-4">
        <div class="field">
          <div class="form-group" data-children-count="1">
            <label class="required_application" for="studentFirstName">Vorname</label>
            <input maxlength="50"
                   class="form-control"
                   size="50"
                   type="text"
                   v-model="newFirstName"
                   :placeholder="userProfile.firstName"
                  id="studentFirstName"/>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="field">
          <div class="form-group" data-children-count="1">
            <label class="required_application" for="studentLastName">Nachname</label>
            <input
              maxlength="50"
              class="form-control"
              size="50"
              type="text"
              v-model="newLastName"
              :placeholder="userProfile.lastName"
              id="studentLastName"
            >
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-md-4">
        <div class="field">
          <button
            type="submit"
            name="commit"
            value="Informationen speichern"
            class="btn btn-secondary mt-3"
            data-disable-with="Informationen speichern"
            v-on:click="save()"
          >
            Informationen speichern
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import http from '@/utils/http-common';

export default defineComponent({
  name: 'Student',
  data() {
    return {
      newFirstName: null,
      newLastName: null,
      newPrivateEmail: null,
    };
  },
  computed: mapState(['userProfile']),
  methods: {
    async save() {
      try {
        const res = await http.patch('/auth/profile', {
          firstName: this.newFirstName ? this.newFirstName : this.userProfile.firstName,
          lastName: this.newLastName ? this.newLastName : this.userProfile.lastName,
        });
        await this.$store.dispatch('setUserProfile', { ...res.data });
        await this.$store.dispatch('addNotification', { text: 'Dein Profil wurde erfolgreich gespeichert!', type: 'success' });
      } catch (err: any) {
        await this.$store.dispatch('addNotification', { text: 'Es gab einen Fehler beim Speichern deines Profils!', type: 'error' });
      }
    },
  },
});
</script>

<style lang="scss">
label.required_application::after {
  content: " *";
  color: #0000b9;
  font-weight: bold;
}
</style>
