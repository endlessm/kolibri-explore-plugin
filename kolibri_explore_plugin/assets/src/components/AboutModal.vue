<template>

  <b-modal
    :id="id"
    headerCloseVariant="light"
    size="xl"
    centered
  >
    <div class="bg-white text-dark wrapper">
      <b-row>
        <b-col class="pt-3" md="3" sm="12">
          <b-list-group v-b-scrollspy:sections-column>
            <b-list-group-item
              v-for="item in menuItems"
              :id="item.id"
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
              The Endless Key Initiative is a project created to help offline
              kids access great educational and learning resources, even
              without an internet connection.
            </p>

            <p>
              The Endless OS Foundation has partnered with Common Sense and
              Learning Equality to launch the Endless Key initiative. The Key
              is designed as a complement to the USA's broadband-for-all
              rollout, and offline students' distance learning challenges.
            </p>

            <p>
              The Endless Key is a 128 gigabyte USB drive that is designed to
              provide a robust, engaging and safe digital learning environment,
              with high-quality learning and discovery resources that can be
              accessed offline (without internet) by students using Windows
              computers.
            </p>

            <hr>
            <template v-if="buildInfo">
              <h5>Release information</h5>
              <b-list-group class="bg-light p-3 rounded-lg">
                <b-list-group-item class="bg-light rounded-0">
                  Release: {{ buildInfo.last_release }}
                </b-list-group-item>
                <b-list-group-item class="bg-light rounded-0">
                  Date: {{ buildInfo.date }}
                </b-list-group-item>
                <b-list-group-item class="bg-light rounded-0">
                  Commit: {{ buildInfo.commit }}
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
              Endless Community Forum at
              <a href="https://community.endlessos.com/c/endless-key/">
                https://community.endlessos.com/c/endless-key/
              </a>.
            </p>
            <hr>
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

            <h5>Arts & Crafts</h5>
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

  export default {
    name: 'AboutModal',
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
            id: 'credits-link',
            label: 'Credits',
            href: '#credits-section',
          },
        ],
      };
    },
    mounted() {
      this.activeItemId = this.menuItems[0].id;
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
