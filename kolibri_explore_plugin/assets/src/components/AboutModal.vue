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
              {{ $tr('aboutHeading') }}
            </h3>
            <p>
              {{ $tr('aboutBody') }}
            </p>
            <hr>
            <template v-if="buildInfo">
              <h5>{{ $tr('releaseInformationHeading') }}</h5>
              <b-list-group class="bg-light p-3 rounded-lg">
                <b-list-group-item class="bg-light rounded-0">
                  {{ $tr('releaseKey') }} {{ buildInfo.version_name }} {{ buildInfo.last_release }}
                </b-list-group-item>
                <b-list-group-item class="bg-light rounded-0">
                  {{ $tr('dateKey') }} {{ translatedBuildDate }}
                </b-list-group-item>
                <b-list-group-item class="bg-light rounded-0">
                  {{ $tr('commitKey') }} {{ buildInfo.commit }}
                </b-list-group-item>
                <b-list-group-item class="bg-light rounded-0">
                  {{ $tr('kolibriKey') }} {{ kolibriVersion }}
                </b-list-group-item>
              </b-list-group>
              <hr>
            </template>
          </div>
          <div>
            <h3 id="support-section" class="pt-3 text-primary">
              {{ $tr('supportHeading') }}
            </h3>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <p v-html="$tr('supportBody')"></p>
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
              {{ $tr('imagesAndIconsHeading') }}
            </h3>

            <h5>{{ $tr('creditsFinancialLiteracy') }}</h5>
            <p>
              {{ $tr('genericCreditsEntry', {
                logoName: 'savings',
                logoAuthor: 'abderraouf omara',
                logoLocation: 'NounProject.com',
                thumbnailAuthor: 'Sharon McCutcheon',
                thumbnailLocation: 'unsplash.com',
                backgroundAuthor: 'Sharon McCutcheon',
                backgroundLocation: 'unsplash.com',
              }) }}
            </p>

            <h5>{{ $tr('creditsGardening') }}</h5>
            <p>
              {{ $tr('genericCreditsEntry', {
                logoName: 'Beetroot',
                logoAuthor: 'dDara',
                logoLocation: 'NounProject.com',
                thumbnailAuthor: 'Julia Kadel',
                thumbnailLocation: 'unsplash.com',
                backgroundAuthor: 'Julia Kadel',
                backgroundLocation: 'unsplash.com',
              }) }}
            </p>

            <h5>{{ $tr('creditsHealthyMind') }}</h5>
            <p>
              {{ $tr('genericCreditsEntry', {
                logoName: 'well being',
                logoAuthor: 'Karen Santiago',
                logoLocation: 'NounProject.com',
                thumbnailAuthor: 'Alejandro Piñero Amerio',
                thumbnailLocation: 'unsplash.com',
                backgroundAuthor: 'Clyde RS',
                backgroundLocation: 'unsplash.com',
              }) }}
            </p>

            <h5>{{ $tr('creditsReadAlong') }}</h5>
            <p>
              {{ $tr('genericCreditsEntry', {
                logoName: 'Reading',
                logoAuthor: 'dDara',
                logoLocation: 'NounProject.com',
                thumbnailAuthor: 'Annie Spratt',
                thumbnailLocation: 'unsplash.com',
                backgroundAuthor: 'Roman Trifonov',
                backgroundLocation: 'unsplash.com',
              }) }}
            </p>

            <h5>{{ $tr('creditsMusic') }}</h5>
            <p>
              {{ $tr('genericCreditsEntry', {
                logoName: 'Guitar',
                logoAuthor: 'dDara',
                logoLocation: 'NounProject.com',
                thumbnailAuthor: 'Sigmund',
                thumbnailLocation: 'unsplash.com',
                backgroundAuthor: 'Sigmund',
                backgroundLocation: 'unsplash.com',
              }) }}
            </p>

            <h5>{{ $tr('creditsHealthyBody') }}</h5>
            <p>
              {{ $tr('genericCreditsEntry', {
                logoName: 'yoga',
                logoAuthor: 'Eucalyp',
                logoLocation: 'NounProject.com',
                thumbnailAuthor: 'madison lavern',
                thumbnailLocation: 'unsplash.com',
                backgroundAuthor: 'Conscious Design',
                backgroundLocation: 'unsplash.com',
              }) }}
            </p>

            <h5>{{ $tr('creditsDance') }}</h5>
            <p>
              {{ $tr('genericCreditsEntry', {
                logoName: 'dance',
                logoAuthor: 'ArmOkay',
                logoLocation: 'NounProject.com',
                thumbnailAuthor: 'Drew Graham',
                thumbnailLocation: 'unsplash.com',
                backgroundAuthor: 'Ahmad Odeh',
                backgroundLocation: 'unsplash.com',
              }) }}
            </p>

            <h5>{{ $tr('creditsSteam') }}</h5>
            <p>
              {{ $tr('genericCreditsEntry', {
                logoName: 'Science',
                logoAuthor: 'Turkkub',
                logoLocation: 'NounProject.com',
                thumbnailAuthor: 'David Clode',
                thumbnailLocation: 'unsplash.com',
                backgroundAuthor: 'Joel Filipe',
                backgroundLocation: 'unsplash.com',
              }) }}
            </p>

            <h5>{{ $tr('creditsSports') }}</h5>
            <p>
              {{ $tr('genericCreditsEntry', {
                logoName: 'Basketball',
                logoAuthor: 'Eucalypt',
                logoLocation: 'NounProject.com',
                thumbnailAuthor: 'Steven Lelham',
                thumbnailLocation: 'unsplash.com',
                backgroundAuthor: 'Caroline Justine',
                backgroundLocation: 'unsplash.com',
              }) }}
            </p>

            <h5>{{ $tr('creditsArtsAndCrafts') }}</h5>
            <p>
              {{ $tr('genericCreditsEntry', {
                logoName: 'Scissor',
                logoAuthor: 'Muhammad Auns',
                logoLocation: 'NounProject.com',
                thumbnailAuthor: 'Siora Photography',
                thumbnailLocation: 'unsplash.com',
                backgroundAuthor: 'Munro Studio',
                backgroundLocation: 'unsplash.com',
              }) }}
            </p>

            <h5>{{ $tr('creditsCareers') }}</h5>
            <p>
              {{ $tr('genericCreditsEntry', {
                logoName: 'Path',
                logoAuthor: 'Adrien Coquet',
                logoLocation: 'NounProject.com',
                thumbnailAuthor: 'Estee Janssens',
                thumbnailLocation: 'unsplash.com',
                backgroundAuthor: 'Shane',
                backgroundLocation: 'unsplash.com',
              }) }}
            </p>

            <h5>{{ $tr('creditsCooking') }}</h5>
            <p>
              {{ $tr('genericCreditsEntry', {
                logoName: 'Cooking Tool',
                logoAuthor: 'Made by Made',
                logoLocation: 'NounProject.com',
                thumbnailAuthor: 'LUM3N',
                thumbnailLocation: 'unsplash.com',
                backgroundAuthor: 'LUM3N',
                backgroundLocation: 'unsplash.com',
              }) }}
            </p>

            <h5>{{ $tr('creditsGames') }}</h5>
            <p>
              {{ $tr('genericCreditsEntry', {
                logoName: 'Games',
                logoAuthor: 'dDara',
                logoLocation: 'NounProject.com',
                thumbnailAuthor: 'Block of Netherite',
                thumbnailLocation: 'youtube.com',
                backgroundAuthor: 'Ty Feague',
                backgroundLocation: 'unsplash.com',
              }) }}
            </p>

            <h5>{{ $tr('creditsMediaThumbnails') }}</h5>
            <p>
              {{ $tr('iconCreditsEntry') }}
            </p>

            <h5>{{ $tr('creditsFashion') }}</h5>
            <p>
              {{ $tr('fashionCreditsEntry') }}
            </p>

            <h5>{{ $tr('creditsJewelryMaking') }}</h5>
            <p>
              {{ $tr('genericCreditsEntry', {
                logoName: 'earrings',
                logoAuthor: 'Eucalyp',
                logoLocation: 'NounProject.com',
                thumbnailAuthor: 'FLY:D',
                thumbnailLocation: 'unsplash.com',
                backgroundAuthor: 'FLY:D',
                backgroundLocation: 'unsplash.com',
              }) }}
            </p>

            <h5>{{ $tr('creditsGenderIdentity') }}</h5>
            <p>
              {{ $tr('genderIdentityCreditsEntry') }}
            </p>

            <h5>{{ $tr('creditsBeauty') }}</h5>
            <p>
              {{ $tr('genericCreditsEntry', {
                logoName: 'Beauty',
                logoAuthor: 'ferdizzimo',
                logoLocation: 'NounProject.com',
                thumbnailAuthor: 'Siora Photography',
                thumbnailLocation: 'unsplash.com',
                backgroundAuthor: 'Valeriia Kogan',
                backgroundLocation: 'unsplash.com',
              }) }}
            </p>

            <h5>{{ $tr('creditsVirtualFieldTrips') }}</h5>
            <p>
              {{ $tr('genericCreditsEntry', {
                logoName: 'Map',
                logoAuthor: 'Eucalyp',
                logoLocation: 'NounProject.com',
                thumbnailAuthor: 'Juan Ordonez',
                thumbnailLocation: 'unsplash.com',
                backgroundAuthor: 'Jad Limcaco',
                backgroundLocation: 'unsplash.com',
              }) }}
            </p>

            <h5>{{ $tr('creditsChapterBooks') }}</h5>
            <p>
              {{ $tr('chapterBooksCreditsEntry') }}
            </p>

            <h5>{{ $tr('creditsStaffPlaylist') }}</h5>
            <p>
              {{ $tr('genericCreditsEntry', {
                logoName: 'feedback',
                logoAuthor: 'Andi',
                logoLocation: 'NounProject.com',
                thumbnailAuthor: 'Sharon McCutcheon',
                thumbnailLocation: 'unsplash.com',
                backgroundAuthor: 'Sharon McCutcheon',
                backgroundLocation: 'unsplash.com',
              }) }}
            </p>

          </div>
        </b-col>
      </b-row>
    </div>
  </b-modal>

</template>


<script>

  import urls from 'kolibri.urls';
  import { currentLanguage } from 'kolibri.utils.i18n';
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
            label: this.$tr('aboutLink'),
            href: '#about-section',
          },
          {
            id: 'support-link',
            label: this.$tr('supportLink'),
            href: '#support-section',
          },
          {
            id: 'privacy-policy-link',
            label: this.$tr('privacyPolicyLink'),
            href: '#privacy-policy-section',
          },
          {
            id: 'credits-link',
            label: this.$tr('creditsLink'),
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
      translatedBuildDate() {
        if (!this.buildInfo) {
          return '';
        }
        const timestamp = Date.parse(this.buildInfo.date);
        return Intl.DateTimeFormat(currentLanguage, {
          dateStyle: 'full',
          timeStyle: 'long',
        }).format(new Date(timestamp));
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
      aboutHeading: {
        message: 'Endless Key — learning and discovery resources, no internet required.',
        context: 'Heading at the top of the About dialogue',
      },
      aboutBody: {
        message:
          'The Endless Key unlocks the potential for student curiosity and choice through independent learning. Curated to be interest-based and inclusive, our collection of content encourages students to discover knowledge and skills that will support them now and in their futures. The Endless Key is designed to complement the broadband-for-all roll-out in the United States and provide offline students with equitable access to engaging content. Students can access Endless Key content by downloading the Endless Key app (available for ChromeOS and Windows). After the initial download, no internet is required to interact with the content.',
        context: 'Paragraph of information about Endless Key',
      },
      releaseInformationHeading: {
        message: 'Release information',
        context: 'Heading for a table of software release information',
      },
      releaseKey: {
        message: 'Release:',
        context: 'Table key for software release information',
      },
      dateKey: {
        message: 'Date:',
        context: 'Table key for software release date',
      },
      commitKey: {
        message: 'Commit:',
        context: 'Table key for software release commit',
      },
      kolibriKey: {
        message: 'Kolibri:',
        context: 'Table key for software Kolibri version',
      },
      supportHeading: {
        message: 'Support',
        context: 'Heading for technical support section',
      },
      supportBody: {
        message:
          'You can find more information on how to use your Endless Key on <strong>The Quick Start Guide</strong> document. For more information, when you have an internet connection, you can access the Endless Support Site at <a href="https://support.endlessos.org/en/endless-key" target="_blank">https://support.endlessos.org/en/endless-key</a>.',
        context: 'Paragraph of information about technical support',
      },
      imagesAndIconsHeading: {
        message: 'Images and Icons Attribution',
        context: 'Heading for attribution section',
      },
      aboutLink: {
        message: 'About',
        context: 'Menu item',
      },
      supportLink: {
        message: 'Support',
        context: 'Menu item',
      },
      privacyPolicyLink: {
        message: 'Privacy Policy',
        context: 'Menu item',
      },
      creditsLink: {
        message: 'Credits',
        context: 'Menu item',
      },
      genericCreditsEntry: {
        message:
          'Credits: logo – {logoName} by {logoAuthor} from {logoLocation}; thumbnail – Photo by {thumbnailAuthor} on {thumbnailLocation}; background – Photo by {backgroundAuthor} on {backgroundLocation}.',
        context: 'Credits entry',
      },
      iconCreditsEntry: {
        message:
          'Icon design credits: Puzzle, Idea, Online Education, Online Test, Audio Book and Book by Komkrit Noenpoempisut from NounProject.com.',
        context: 'Credits entry',
      },
      fashionCreditsEntry: {
        message:
          'Credits: logo – sneakers by Smalllike from NounProject.com; thumbnail – Screenshot from Vanessa Sirias, Fly With Johnny Thai and SuppleChicTV on youtube.com; background – Photo by Francesco Cavallini on unsplash.com.',
        context: 'Credits entry',
      },
      genderIdentityCreditsEntry: {
        message:
          'Credits: thumbnail – Screenshot from Angel and Nicole on youtube.com; background – Photo by Cecilie Johnsen on unsplash.com.',
        context: 'Credits entry',
      },
      chapterBooksCreditsEntry: {
        message:
          'Credits: logo – Map by Eucalyp from NounProject.com; thumbnail – Photo by Ed Robertson on unsplash.com; background – Photo by Gulfer Ergin on unsplash.com. All book thumbnails are taken from the original book covers (fair use) or Public Domain original artwork.',
        context: 'Credits entry',
      },
      creditsFinancialLiteracy: {
        message: 'Financial Literacy',
        context: 'Credits section title',
      },
      creditsGardening: {
        message: 'Gardening',
        context: 'Credits section title',
      },
      creditsHealthyMind: {
        message: 'Healthy Mind',
        context: 'Credits section title',
      },
      creditsReadAlong: {
        message: 'Read Along',
        context: 'Credits section title',
      },
      creditsMusic: {
        message: 'Music',
        context: 'Credits section title',
      },
      creditsHealthyBody: {
        message: 'Healthy Body',
        context: 'Credits section title',
      },
      creditsDance: {
        message: 'Dance',
        context: 'Credits section title',
      },
      creditsSteam: {
        message: 'STEAM',
        context: 'Credits section title',
      },
      creditsSports: {
        message: 'Sports',
        context: 'Credits section title',
      },
      creditsArtsAndCrafts: {
        message: 'Arts and Crafts',
        context: 'Credits section title',
      },
      creditsCareers: {
        message: 'Careers',
        context: 'Credits section title',
      },
      creditsCooking: {
        message: 'Cooking',
        context: 'Credits section title',
      },
      creditsGames: {
        message: 'Games',
        context: 'Credits section title',
      },
      creditsMediaThumbnails: {
        message: 'Media Thumbnails',
        context: 'Credits section title',
      },
      creditsFashion: {
        message: 'Fashion',
        context: 'Credits section title',
      },
      creditsJewelryMaking: {
        message: 'Jewelry Making',
        context: 'Credits section title',
      },
      creditsGenderIdentity: {
        message: 'Gender Identity',
        context: 'Credits section title',
      },
      creditsBeauty: {
        message: 'Beauty',
        context: 'Credits section title',
      },
      creditsVirtualFieldTrips: {
        message: 'Virtual Field Trips',
        context: 'Credits section title',
      },
      creditsChapterBooks: {
        message: 'Chapter Books',
        context: 'Credits section title',
      },
      creditsStaffPlaylist: {
        message: 'Staff Playlist',
        context: 'Credits section title',
      },
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
