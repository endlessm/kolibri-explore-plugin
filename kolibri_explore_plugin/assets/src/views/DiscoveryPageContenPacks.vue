<template>

  <div class="channels-page d-flex flex-column min-vh-100">
    <DiscoveryNavBar />

    <template v-if="loading || loadingNodes">
      <EkCardGridPlaceholder />
    </template>
    <template v-else>
      <b-container class="mb-2 mt-4 no-container-padding">
        <template v-if="hasNodesForSection('highlight')">
          <b-container>
            <h5 class="mt-2 text-muted">
              {{ $tr('highlightLabel') }}
            </h5>
          </b-container>
          <EkCardGrid
            :nodes="sectionNodes['highlight']"
            :itemsPerSlide="{ lg: 3, md: 2, sm: 1 }"
          />
        </template>
        <template v-if="hasNodesForSection('skill')">
          <b-container>
            <h5 class="mt-2 text-muted">
              {{ $tr('skillLabel') }}
            </h5>
          </b-container>
          <EkCardGrid
            :nodes="sectionNodes['skill']"
          />
        </template>
        <!-- TODO: commenting week's channel for now. -->
        <!-- <template>
          <b-container>
            <h5 class="mt-2 text-muted">
              {{ $tr('channelLabel', { channel: 'test' }) }}
            </h5>
          </b-container>
          <EkCardGridPlaceholder />
        </template> -->
        <template v-if="hasNodesForSection('career')">
          <b-container>
            <h5 class="mt-2 text-muted">
              {{ $tr('careerLabel') }}
            </h5>
          </b-container>
          <EkCardGrid
            :nodes="sectionNodes['career']"
            :itemsPerSlide="{ lg: 3, md: 2, sm: 1 }"
          />
        </template>
        <template v-if="hasNodesForSection('curious')">
          <b-container>
            <h5 class="mt-2 text-muted">
              {{ $tr('curiousLabel') }}
            </h5>
          </b-container>
          <EkCardGrid
            :nodes="sectionNodes['curious']"
          />
        </template>
        <b-container class="mb-5">
          <b-row class="d-flex justify-content-center" cols="3">
            <b-col class="col-auto d-flex justify-content-center">
              <button
                v-b-modal.about-modal
                class="btn d-md-block d-none shadow-none"
              >
                {{ $tr('aboutLabel') }}
              </button>
            </b-col>
            <b-col class="col-auto d-flex justify-content-center">
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
      </b-container>
    </template>

  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';

  import { utils, constants } from 'ek-components';
  import DiscoveryNavBar from '../components/DiscoveryNavBar';
  import { ContentNodeExtrasResource } from '../apiResources';

  export default {
    name: 'DiscoveryPageContenPacks',
    components: { DiscoveryNavBar },
    mixins: [commonCoreStrings],
    data() {
      return {
        sectionNodes: {},
        loadingNodes: true,
      };
    },
    computed: {
      ...mapState({
        loading: state => state.core.loading,
      }),
    },
    mounted() {
      return this.fetchHighlighted();
    },
    methods: {
      fetchHighlighted() {
        this.loadingNodes = true;
        return Promise.all(
          constants.CollectionsSections.map(tag => {
            return ContentNodeExtrasResource.fetchByExternalTag(tag).then(({ data }) => {
              const nodes = data
                // Tweak the nodes with EK customizations:
                .map(utils.addStructuredTag)
                .map(utils.updateExploreNodeUrl);
              this.sectionNodes[tag] = nodes;
            });
          })
        ).then(() => {
          this.loadingNodes = false;
        });
      },
      hasNodesForSection(section) {
        return section in this.sectionNodes && this.sectionNodes[section].length;
      },
    },
    $trs: {
      highlightLabel: 'Just for you',
      skillLabel: 'Learn a new skill',
      // TODO: commenting week's channel for now.
      // channelLabel: "This week's channel: {channel}",
      careerLabel: 'Explore careers',
      curiousLabel: 'Feeling curious?',
      aboutLabel: 'About Endless Key',
      privacyPolicyLabel: 'Privacy Policy',
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .channels-page {
    padding-top: $navbar-height;
    background-color: $gray-300;
  }

</style>
