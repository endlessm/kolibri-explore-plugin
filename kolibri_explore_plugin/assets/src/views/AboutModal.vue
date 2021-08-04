<template>

  <b-modal
    :id="id"
    headerCloseVariant="light"
    size="xl"
    centered
  >
    <b-container class="bg-white text-dark">
      <b-row>
        <b-col class="pt-3" md="3" sm="12">
          <b-list-group v-b-scrollspy:sections-column>
            <b-list-group-item
              v-for="item in menuItems"
              :id="item.id"
              :key="item.id"
              :active="item.id === activeItemId"
              :href="item.href"
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
              <h4>Release information</h4>
              <b-list-group class="bg-light p-3 rounded-lg">
                <b-list-group-item class="bg-light">
                  Release: {{ buildInfo.last_release }}
                </b-list-group-item>
                <b-list-group-item class="bg-light">
                  Date: {{ buildInfo.date }}
                </b-list-group-item>
                <b-list-group-item class="bg-light">
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
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <hr>
          </div>
          <div>
            <h3 id="credits-section" class="pt-3 text-primary">
              Credits
            </h3>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
          </div>
        </b-col>
      </b-row>
    </b-container>
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

  .sections-column {
    position: relative;
    height: 75vh;
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
