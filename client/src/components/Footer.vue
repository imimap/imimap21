<template>
  <footer>
    <div class="container m-0">
      <div class="im-items">
        <div style="float: left">
          <div class="imi_logo"></div>
          <div class="htw_logo"></div>
        </div>
        <div class="im-items">
        <div class="footer-text my-3">
          <div>
            Die IMIMAP 2021 © IMI-HTW 2021 - heute<br>
            Internationale Medieninformatik der HTW Berlin. <a href="/impressum.html">Impressum</a>
          </div>
          <div style="float: right; font-size: 1rem;">
            Designed and build by humans for humans. Be kind.
          </div>
        </div>
        <div class="footer-text"><a href="https://www.htw-berlin.de/datenschutz/" target="_blank">Datenschutz</a></div>
      </div>
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
  border-top: 1px solid #000;
  margin-top: 0px;
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
  float: left;
  height: 30px;
  width: 52px;
  background: url('/assets/htw_logo.png');
  background-size: 52px 30px;
  margin-right: 10px;
}

.im-items {
  width: 100%;
  margin-right: 20px;
  margin-top: 4px;
}

.footer-text {
  font-size: 12px;
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
    width: 747px;
  }

  .footer-text {
    display: block;
    white-space: normal;
  }
}
</style>
