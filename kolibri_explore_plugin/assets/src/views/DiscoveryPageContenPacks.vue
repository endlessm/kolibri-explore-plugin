<template>

  <div class="channels-page d-flex flex-column min-vh-100">
    <DiscoveryNavBar />

    <template v-if="loading || loadingNodes">
      <EkCardGridPlaceholder />
    </template>
    <template v-else>
      <b-container class="mb-2 mt-4 no-container-padding">
        <template v-if="hasNodesForSection('featured-channel')">
          <b-container>
            <h5 class="mt-2 text-muted">
              {{ $tr('channelLabel') }}
            </h5>
          </b-container>
          <!-- These classes must match EkCardGrid -->
          <b-container class="mb-5 mt-3 no-container-padding section-container">
            <EkSlidableGrid
              v-slot="slotProps"
              :nodes="sectionNodes['featured-channel']"
            >
              <EkChannelCard
                v-for="node in slotProps.slideNodes"
                :key="node.id"
                :channel="node"
                @click.native="goToChannel(node.id)"
              />
            </EkSlidableGrid>
          </b-container>
        </template>
        <template v-if="hasNodesForSection('highlight')">
          <b-container>
            <h5 class="mt-2 text-muted">
              {{ $tr('highlightLabel') }}
            </h5>
          </b-container>
          <EkCardGrid
            :nodes="sectionNodes['highlight']"
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
        <template v-if="hasNodesForSection('career')">
          <b-container>
            <h5 class="mt-2 text-muted">
              {{ $tr('careerLabel') }}
            </h5>
          </b-container>
          <EkCardGrid
            :nodes="sectionNodes['career']"
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

        <AboutFooter />

      </b-container>
    </template>

  </div>

</template>


<script>

  import partial from 'lodash/partial';
  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';

  import { utils, constants } from 'ek-components';
  import DiscoveryNavBar from '../components/DiscoveryNavBar';
  import AboutFooter from '../components/AboutFooter';
  import { ChannelResource, ContentNodeExtrasResource } from '../apiResources';
  import navigationMixin from '../mixins/navigationMixin';
  import { getBigThumbnail, getChannelIcon } from '../customApps';

  export default {
    name: 'DiscoveryPageContenPacks',
    components: { DiscoveryNavBar, AboutFooter },
    mixins: [commonCoreStrings, navigationMixin],
    data() {
      return {
        sectionNodes: {},
        loadingNodes: true,
      };
    },
    computed: {
      ...mapState('topicsRoot', { rootNodes: 'rootNodes' }),
      ...mapState({
        loading: state => state.core.loading,
      }),
    },
    watch: {
      loading() {
        if (!this.loading) {
          return this.fetchHighlighted();
        }
      },
    },
    mounted() {
      if (!this.loading) {
        return this.fetchHighlighted();
      }
    },
    methods: {
      fetchHighlighted() {
        this.loadingNodes = true;

        const addChannelToNode = partial(utils.addChannelToNode, this.rootNodes);

        const promises = constants.CollectionsSections.map(tag => {
          return ContentNodeExtrasResource.fetchByExternalTag(tag).then(({ data }) => {
            const nodes = data
              // Tweak the nodes with EK customizations:
              .map(utils.addStructuredTag)
              .map(utils.updateExploreNodeUrl)
              .map(addChannelToNode);
            this.sectionNodes[tag] = nodes;
          });
        });

        const featuredPromise = ContentNodeExtrasResource.fetchByExternalTag('featured-channel', {
          only_root_nodes: true,
          no_available_filtering: true,
        })
          .then(({ data }) => {
            return Promise.all(
              data.map(n => {
                return ChannelResource.fetchModel({ id: n.channel_id }).then(c => {
                  n.bigThumbnail = getBigThumbnail(c);
                  n.thumbnail = getChannelIcon(c);
                  return n;
                });
              })
            );
          })
          .then(nodes => {
            this.sectionNodes['featured-channel'] = nodes;
          });

        return Promise.all([featuredPromise, ...promises]).then(() => {
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
      channelLabel: 'Your channels',
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
