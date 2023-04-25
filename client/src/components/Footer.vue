<template>
  <footer>
    <div class="container m-0">
      <div class="im-items">
        <div class="imi_logo"></div>
        <div class="htw_logo"></div>
        <div class="footer-text my-3">
          <p>
            Die neue IMIMAP 2021 - Projekt im Studiengang
            Internationale Medieninformatik der HTW Berlin. Mehr Informationen zum Projekt
            auf der Webseite der HTW <a href="https://showtime.f4.htw-berlin.de/">Showtime</a>
          </p>
        </div>
        <div class="footer-text"><a href="https://www.htw-berlin.de/datenschutz/" target="_blank">Datenschutz</a></div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Footer',
});
</script>

<style lang="scss">
footer {
  color: $text-color-gray;
  background: $htw-gray-color;
  padding: 17px 0 18px 0;
  border-top: 1px solid #000;
  margin-top: 100px;
}

.imi_logo {
  height: 30px;
  width: 33px;
  background: url('/assets/imi_logo.png');
  background-size: 33px 30px;
  display: inline-block;
  margin-right: 15px;
}

.htw_logo {
  height: 30px;
  width: 52px;
  background: url('/assets/htw_logo.png');
  background-size: 52px 30px;
  display: inline-block;
  margin-right: 10px;
}

.im-items {
  width: 100%;
  margin-right: 20px;
  margin-top: 4px;
}

.footer-text {
  font-size: 10px;
  display: block;
  margin-right: 5px;
  white-space: normal;
}

@include media-breakpoint-up(lg) {
  .imi_logo {
    height: 60px;
    width: 66px;
    background-size: 66px 60px;
  }

  .htw_logo {
    height: 60px;
    width: 104px;
    background-size: 104px 60px;
  }

  .im-items {
    width: 560px;
  }

  .footer-text {
    display: block;
    white-space: normal;
  }
}
</style>
