<template>

  <b-modal
    :id="id"
    headerCloseVariant="light"
    size="xl"
    centered
    @shown="onShown"
    @hidden="onHidden"
  >
    <div ref="mainDiv" tabindex="0" class="bg-white text-dark wrapper" @keyup="onKeyUp">
      <b-row>
        <b-col class="pt-3" md="3" sm="12">
          <b-list-group v-b-scrollspy:sections-column>
            <b-list-group-item
              v-for="item in menuItems"
              :id="item.id"
              :ref="'ref-' + item.id"
              :key="item.id"
              :active="item.id === activeItemId"
              :href="item.href"
              class="rounded-0"
              @click="setActiveItem"
            >
              {{ item.label }}
            </b-list-group-item>
          </b-list-group>
        </b-col>
        <b-col id="sections-column" class="sections-column" md="9" sm="12">
          <div>
            <h3 id="about-section" class="pt-3 text-primary">
              Endless Key — learning and discovery resources, no internet required.
            </h3>
            <p>
              The Endless Key unlocks the potential for student
              curiosity and choice through independent
              learning. Curated to be interest-based and inclusive,
              our collection of content encourages students to
              discover knowledge and skills that will support them now
              and in their futures. The Endless Key is designed to
              complement the broadband-for-all roll-out in the United
              States and provide offline students with equitable
              access to engaging content. Students can access Endless
              Key content by downloading the Endless Key app
              (available for ChromeOS and Windows). After the initial
              download, no internet is required to interact with the
              content.
            </p>
            <hr>
            <template v-if="buildInfo">
              <h5>Release information</h5>
              <b-list-group class="bg-light p-3 rounded-lg">
                <b-list-group-item class="bg-light rounded-0">
                  Release: {{ buildInfo.version_name }} {{ buildInfo.last_release }}
                </b-list-group-item>
                <b-list-group-item class="bg-light rounded-0">
                  Date: {{ buildInfo.date }}
                </b-list-group-item>
                <b-list-group-item class="bg-light rounded-0">
                  Commit: {{ buildInfo.commit }}
                </b-list-group-item>
                <b-list-group-item class="bg-light rounded-0">
                  Kolibri: {{ kolibriVersion }}
                </b-list-group-item>
              </b-list-group>
              <hr>
            </template>
          </div>
          <div>
            <h3 id="support-section" class="pt-3 text-primary">
              Support
            </h3>
            <p>
              You can find more information on how to use your Endless Key on
              <strong>The Quick Start Guide</strong> document. For more
              information, when you have an internet connection, you can access
              Endless Support Site at
              <a href="https://support.endlessos.org/en/endless-key" target="_blank">https://support.endlessos.org/en/endless-key</a>.
            </p>
            <hr>
          </div>
          <div>
            <h3 id="privacy-policy-section" class="pt-3 text-primary">
              {{ $tr('privacyPolicyHeader') }}
            </h3>
            <EkPrivacyPolicyText />
          </div>
          <div>
            <h3 id="credits-section" class="pt-3 text-primary">
              Images and Icons Attribution
            </h3>

            <h5>Financial Literacy</h5>
            <p>
              Credits: logo – savings by abderraouf omara from
              NounProject.com; thumbnail – Photo by Sharon McCutcheon
              on unsplash.com; background – Photo by Sharon McCutcheon
              on unsplash.com.
            </p>

            <h5>Gardening</h5>
            <p>
              Credits: logo – Beetroot by dDara from NounProject.com;
              thumbnail – Photo by Julia Kadel on unsplash.com;
              background – Photo by Julia Kadel on unsplash.com.
            </p>

            <h5>Healthy Mind </h5>
            <p>
              Credits: logo – well being by Karen Santiago from
              NounProject.com; thumbnail – Photo by Alejandro Piñero
              Amerio on unsplash.com; background – Photo by Clyde RS
              on unsplash.com.
            </p>

            <h5>Read Along </h5>
            <p>
              Credits: logo – Reading by dDara from the Noun Project
              from NounProject.com; thumbnail – Photo by Annie Spratt
              on unsplash.com; background – Photo by Roman Trifonov on
              unsplash.com.
            </p>

            <h5>Music</h5>
            <p>
              Credits: logo – Guitar by dDara from the Noun Project
              from NounProject.com; thumbnail – Photo by Sigmund on
              unsplash.com; background – Photo by Sigmund on
              unsplash.com.
            </p>

            <h5>Healthy Body</h5>
            <p>
              Credits: logo – yoga by Eucalyp from the Noun Project
              from NounProject.com; thumbnail – Photo by madison
              lavern on unsplash.com; background – Photo by Conscious
              Design on unsplash.com.
            </p>

            <h5>Dance</h5>
            <p>
              Credits: logo – dance by ArmOkay from NounProject.com;
              thumbnail – Photo by Drew Graham on unsplash.com;
              background – Photo by Ahmad Odeh on unsplash.com.
            </p>

            <h5>STEAM</h5>
            <p>
              Credits: logo – Science by Turkkub from NounProject.com;
              thumbnail – Photo by David Clode on unsplash.com;
              background – Photo by Joel Filipe on unsplash.com.
            </p>

            <h5>Sports</h5>
            <p>
              Credits: logo – Basketball by Eucalypt from
              NounProject.com; thumbnail – Photo by Steven Lelham on
              unsplash.com; background – Photo by Caroline Justine on
              unsplash.com.
            </p>

            <h5>Arts &amp; Crafts</h5>
            <p>
              Credits: logo – Scissor By Muhammad Auns from
              NounProject.com; thumbnail – Photo by Siora Photography
              on unsplash.com; background – Photo by Munro Studio on
              unsplash.com.
            </p>

            <h5>Careers</h5>
            <p>
              Credits: logo – Path by Adrien Coquet from
              NounProject.com; thumbnail – Photo by Estee Janssens on
              unsplash.com; background – Photo by Shane on
              unsplash.com.
            </p>

            <h5>Cooking</h5>
            <p>
              Credits: logo – Cooking Tool by Made by Made from
              NounProject.com; thumbnail – Photo by LUM3N on
              unsplash.com; background – Photo by LUM3N on
              unsplash.com.
            </p>

            <h5>Games</h5>
            <p>
              Credits: logo – Games by dDara from NounProject.com;
              thumbnail – Screenshot from by Block of Netherite on
              youtube.com; background – Photo by Ty Feague on
              unsplash.com.
            </p>

            <h5>Media Thumbnails</h5>
            <p>
              Icon design credits: Puzzle, Idea, Online Education,
              Online Test, Audio Book and Book by Komkrit
              Noenpoempisut from NounProject.com;
            </p>

            <h5>Fashion</h5>
            <p>
              Credits: logo – sneakers by Smalllike from
              NounProject.com; thumbnail – Screenshot from Vanessa
              Sirias, Fly With Johnny Thai and SuppleChicTV on
              youtube.com; background – Photo by Francesco Cavallini
              on unsplash.com.
            </p>

            <h5>Jewelry Making</h5>
            <p>
              Credits: logo – earrings by Eucalyp from
              NounProject.com; thumbnail and background – Photos by
              FLY:D on unsplash.com.
            </p>

            <h5>Gender Identity</h5>
            <p>
              Credits: thumbnail – Screenshot from Angel and Nicole on
              youtube.com; background – Photo by Cecilie Johnsen on
              unsplash.com.
            </p>

            <h5>Beauty</h5>
            <p>
              Credits: logo – Beauty by ferdizzimo from
              NounProject.com; thumbnail – Photo by Siora Photography
              on unsplash.com; background – Photo by Valeriia Kogan on
              unsplash.com.
            </p>

            <h5>Virtual Field Trips</h5>
            <p>
              Credits: logo – Map by Eucalyp from NounProject.com;
              thumbnail – Photo by Juan Ordonez on unsplash.com;
              background – Photo by Jad Limcaco on unsplash.com.
            </p>

            <h5>Chapter Books</h5>
            <p>
              Credits: logo – Map by Eucalyp from NounProject.com;
              thumbnail – Photo by Ed Robertson on unsplash.com;
              background – Photo by Gulfer Ergin on unsplash.com. All
              book thumbnails are taken from the original book covers
              (fair use) or Public Domain original artwork.
            </p>

            <h5>Staff Playlist</h5>
            <p>
              Credits: logo – feedback by Andi from NounProject.com;
              thumbnail – Photo by Sharon Mccutcheon on unsplash.com;
              background – Photo by Sharon Mccutcheon on unsplash.com.
            </p>

          </div>
        </b-col>
      </b-row>
    </div>
  </b-modal>

</template>


<script>

  import urls from 'kolibri.urls';
  import EkPrivacyPolicyText from 'ek-components/src/components/EkPrivacyPolicyText.vue';

  const DEVICE_CHEATCODE = 'showmedevice';

  export default {
    name: 'AboutModal',
    components: { EkPrivacyPolicyText },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        buildInfo: null,
        activeItemId: null,
        initialItem: null,
        menuItems: [
          {
            id: 'about-link',
            label: 'About',
            href: '#about-section',
          },
          {
            id: 'support-link',
            label: 'Support',
            href: '#support-section',
          },
          {
            id: 'privacy-policy-link',
            label: 'Privacy Policy',
            href: '#privacy-policy-section',
          },
          {
            id: 'credits-link',
            label: 'Credits',
            href: '#credits-section',
          },
        ],
        pendingDeviceCheatCode: DEVICE_CHEATCODE,
      };
    },
    computed: {
      kolibriVersion() {
        return window.kolibriCoreAppGlobal.version;
      },
      deviceContentUrl() {
        const deviceContentUrl = urls['kolibri:kolibri.plugins.device:device_management'];
        if (deviceContentUrl) {
          return `${deviceContentUrl()}#/content`;
        }
        return '';
      },
    },
    mounted() {
      this.$root.$on('setAboutSection', section => {
        this.initialItem = section;
      });
      this.activeItemId = this.menuItems[2].id;
      this.getBuildInfo();
    },
    methods: {
      setActiveItem(event) {
        this.activeItemId = event.target.id;
      },
      getBuildInfo() {
        const buildInfo = urls.static(`build-info.json`);
        fetch(buildInfo)
          .then(response => response.json())
          .then(data => {
            this.buildInfo = data;
          })
          .catch(error => {
            console.error(error);
          });
      },
      onShown() {
        // Reset cheat code state and focus div to receive keyboard input:
        this.pendingDeviceCheatCode = DEVICE_CHEATCODE;
        const mainDivRef = this.$refs.mainDiv;
        mainDivRef.focus();

        if (this.initialItem) {
          const component = this.$refs['ref-' + this.initialItem][0];
          component.$el.click();
        }
      },
      onHidden() {
        this.initialItem = null;
      },
      onKeyUp(event) {
        if (event.key === this.pendingDeviceCheatCode.charAt(0)) {
          // User pressed the next key in cheat code:
          this.pendingDeviceCheatCode = this.pendingDeviceCheatCode.substring(1);
          if (this.pendingDeviceCheatCode.length === 0) {
            // User wrote the entire cheat code:
            window.open(this.deviceContentUrl, '_self');
          }
        } else {
          // Not the next key in cheat code, reset it:
          this.pendingDeviceCheatCode = DEVICE_CHEATCODE;
        }
      },
    },
    $trs: {
      privacyPolicyHeader: 'Privacy Policy',
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .wrapper {
    padding-right: $spacer;
    padding-left: $grid-gutter-width + $circled-button-size;
  }

  .sections-column {
    position: relative;
    height: 75vh;
    padding-right: $grid-gutter-width + $circled-button-size;
    overflow-y: scroll;
  }

  .list-group-item {
    border-right-width: 0;
    border-left-width: 0;
  }

  ::v-deep .modal-body {
    padding-top: 0;
  }

  ::v-deep .modal-footer {
    display: none;
  }

</style>
