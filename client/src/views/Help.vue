<template>
  <div class="container clear-top">
    <div class="text-left" id="form-block4">
      <div class="pb-5">
        <h2>{{ $t("help.welcome") }}</h2>
        <p>{{ $t("help.intro") }}</p>
        <h3>{{ $t("help.questions.intro") }}</h3>
        <h4>{{ $t("help.questions.q1") }}</h4>
        <p>{{ $t("help.questions.a1") }}</p>
        <h4>{{ $t("help.questions.q2") }}</h4>
        <ol class="list-marker-inside">
          <li><a href="https://imi-bachelor.htw-berlin.de/studium/praktikum/" target="_blank">{{ $t("help.questions.a2") }}</a></li>
          <li>
            <a href="mailto:imi-praktikum@htw-berlin.de">
              {{ $t("help.questions.email") }}
            </a>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// @TODO: Locales
export default defineComponent({
  name: 'Help',
});
</script>
