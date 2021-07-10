<template>
  <footer>
    <div class="container m-0">
      <div class="im-items">
        <div class="imi_logo"></div>
        <div class="htw_logo"></div>
        <div class="footer-text">IMI-Maps @ V 1.4.1, production
          - Projekt im Studiengang Internationale Medieninformatik der HTW Berlin.</div>
        <br>
        <div class="footer-text"><a href="https://www.htw-berlin.de/datenschutz/" target="_blank">Datenschutz</a></div>
      </div>
    </div>
  </footer>
</template>

<script  lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FooterComponent',
});
</script>

<style lang="scss">
@include media-breakpoint-up(lg) {
  footer {
    color: $text-color-gray;
    background: $htw-gray-color;
    padding: 17px 0 18px 0;
    border-top: 1px solid #000;
    margin-bottom: -20px;
    margin-top: 100px;
  }

  .im-items {
    width: 560px;
    margin-right: 20px;
    margin-top: 4px;
  }

  .imi_logo {
    height: 60px;
    width: 66px;
    background: url('/assets/imi_logo.png');
    background-size: 66px 60px;
    display: inline-block;
    margin-right: 15px;
  }

  .htw_logo {
    height: 60px;
    width: 104px;
    background: url('/assets/htw_logo.png');
    background-size: 104px 60px;
    display: inline-block;
    margin-right: 10px;
  }

  .footer-text {
    font-size: 10px;
    display: inline-block;
    margin-right: 5px;
  }
}
</style>
