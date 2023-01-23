<template>

  <div class="channels-page d-flex flex-column min-vh-100">
    <DiscoveryNavBar />

    <template v-if="loading && loadingNodes">
      <CardGridPlaceholder />
    </template>
    <template v-else>
      <b-container class="mb-2 mt-4 no-container-padding">
        <template v-if="hasNodesForSection('highlight')">
          <h5 class="mt-2 text-center text-muted">
            {{ $tr('highlightLabel') }}
          </h5>
          <CardGrid
            :nodes="sectionNodes['highlight']"
            :itemsPerSlide="{ lg: 3, md: 2, sm: 1 }"
          />
        </template>
        <template v-if="hasNodesForSection('skill')">
          <h5 class="mt-2 text-center text-muted">
            {{ $tr('skillLabel') }}
          </h5>
          <CardGrid
            :nodes="sectionNodes['skill']"
          />
        </template>
        <template>
          <h5 class="mt-2 text-center text-muted">
            {{ $tr('channelLabel', { channel: 'test' }) }}
          </h5>
          <CardGridPlaceholder />
        </template>
        <template v-if="hasNodesForSection('career')">
          <h5 class="mt-2 text-center text-muted">
            {{ $tr('careerLabel') }}
          </h5>
          <CardGrid
            :nodes="sectionNodes['career']"
            :itemsPerSlide="{ lg: 3, md: 2, sm: 1 }"
          />
        </template>
        <template v-if="hasNodesForSection('curious')">
          <h5 class="mt-2 text-center text-muted">
            {{ $tr('curiousLabel') }}
          </h5>
          <CardGrid
            :nodes="sectionNodes['curious']"
          />
        </template>
      </b-container>
    </template>

  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';

  import { utils, constants } from 'eos-components';
  import DiscoveryNavBar from '../components/DiscoveryNavBar';
  import { ContentNodeExtrasResource } from '../apiResources';

  export default {
    name: 'DiscoveryPageCollections',
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
              this.loadingNodes = false;
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
      channelLabel: "This week's channel: {channel}",
      careerLabel: 'Explore careers',
      curiousLabel: 'Feeling curious?',
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
