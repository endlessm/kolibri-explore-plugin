<template>

  <b-container class="mb-5">

    <b-row
      :class="{
        'd-flex': true,
        'justify-content-between': showStoreButtons,
        'justify-content-around': !showStoreButtons,
      }"
    >

      <b-col class="col-auto d-flex justify-content-start">
        <b-container class="h-100" fillHeight>
          <b-row class="d-flex h-100 justify-content-center">

            <b-col class="col-auto d-flex justify-content-start">
              <button
                v-b-modal.about-modal
                class="btn d-md-block d-none shadow-none"
              >
                {{ $tr('aboutLabel') }}
              </button>
            </b-col>

            <b-col class="col-auto d-flex justify-content-end">
              <button
                v-b-modal.about-modal
                class="btn d-md-block d-none shadow-none"
                @click="$root.$emit('setAboutSection', 'privacy-policy-link')"
              >
                {{ $tr('privacyPolicyLabel') }}
              </button>
            </b-col>

          </b-row>
        </b-container>
      </b-col>

      <b-col v-if="showStoreButtons" class="col-auto d-flex justify-content-end">
        <b-container class="h-100" fillHeight>
          <b-row class="d-flex h-100 justify-content-center">

            <b-col class="col-auto d-flex justify-content-start">
              <a
                :href="googleStoreUrl"
                target="_blank"
                class="google-play-button"
                @click="installFromPlayStore"
              >
                <img :src="googlePlayImage" :alt="$tr('getOnGooglePlay')">
              </a>
            </b-col>

            <b-col class="col-auto d-flex justify-content-end">
              <script type="module" src="https://get.microsoft.com/badge/ms-store-badge.bundled.js"></script>
              <ms-store-badge
                :productid="windowsApplicationId"
                cid="ek-online"
              />
            </b-col>

          </b-row>
        </b-container>
      </b-col>

    </b-row>

  </b-container>

</template>


<script>

  import { currentLanguage } from 'kolibri.utils.i18n';
  import logger from 'kolibri.lib.logging';
  import plugin_data from 'plugin_data';

  const logging = logger.getLogger(__filename);

  export default {
    name: 'AboutFooter',
    data() {
      return {
        deferredInstallPrompt: null,
      };
    },
    computed: {
      googlePlayImage() {
        return `https://play.google.com/intl/en_us/badges/static/images/badges/${encodeURIComponent(
          currentLanguage
        )}_badge_web_generic.png`;
      },
      googleStoreUrl() {
        return `https://play.google.com/store/apps/details?id=${encodeURIComponent(
          plugin_data.androidApplicationId
        )}&referrer=utm_source%3dek-online`;
      },
      windowsApplicationId() {
        return plugin_data.windowsApplicationId;
      },
      showStoreButtons() {
        return !!plugin_data.androidApplicationId && !!plugin_data.windowsApplicationId;
      },
    },
    mounted() {
      // Add a listener for Chrome, to support an in-browser prompt to install
      // the Android app.
      // See https://developer.chrome.com/blog/app-install-banners-native/.
      window.addEventListener('beforeinstallprompt', this.beforeInstallPrompt);
    },
    beforeDestroy() {
      window.removeEventListener('beforeinstallprompt', this.beforeInstallPrompt);
      this.deferredInstallPrompt = null;
    },
    methods: {
      beforeInstallPrompt(e) {
        logging.debug('beforeInstallPrompt called to provide deferred Play Store prompt');

        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        this.deferredInstallPrompt = e;
      },
      installFromPlayStore(e) {
        logging.debug('Prompting to install app from Play Store');

        if (!this.deferredInstallPrompt) return;

        // Show the prompt and prevent the link being followed
        e.preventDefault();
        this.deferredInstallPrompt.prompt();

        // Wait for the user to respond to the prompt
        this.deferredInstallPrompt.userChoice.then(choiceResult => {
          if (choiceResult.outcome === 'accepted') {
            logging.log('User accepted the app install prompt');
          } else {
            logging.log('User dismissed the app install prompt');
          }
          this.deferredInstallPrompt = null;
        });
      },
    },
    $trs: {
      aboutLabel: 'About Endless Key',
      privacyPolicyLabel: 'Privacy Policy',
      getOnGooglePlay: 'Get it on Google Play',
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  /* The Google image comes with an unhelpful 1/4 height transparent border all
   * the way round, whereas the Microsoft one has no border. Play all sorts of
   * bespoke sizing games to get them to match. */
  .google-play-button img {
    max-width: 200px;
    max-height: 60px;
  }

  ms-store-badge::part(img) {
    max-width: 200px;
    max-height: 40px;
    margin: 10px 0;
  }

</style>
