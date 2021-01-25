<template>

  <div class="channels">
    <PageHeader
      :title="coreString('channelsLabel')"
      class="visuallyhidden"
    />

    <div class="searchbar">
      <label class="visuallyhidden" for="searchfield">{{ coreString('searchLabel') }}</label>
      <input
        id="searchfield"
        ref="searchInput"
        v-model.trim="searchQuery"
        type="search"
        class="search-input"
        dir="auto"
        :placeholder="coreString('searchLabel')"
        @focus="searchFocus = true"
        @blur="searchFocus = false"
      >

      <KIconButton
        icon="search"
        :appearance="searchAppareance()"
        @click="filter"
      />
    </div>

    <div
      v-for="group in groups"
      :key="group.name"
      class="channelsgrid"
    >
      <h3>{{ group.name }}</h3>
      <ChannelCardGroupGrid
        class="grid"
        :size="group.size"
        :contents="getChannels(group)"
        :genContentLink="genChannelLink"
      />
    </div>
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import KIconButton from 'kolibri-design-system/lib/buttons-and-links/KIconButton';
  import { PageNames, CustomChannelGroups } from '../constants';
  import PageHeader from './PageHeader';
  import ChannelCardGroupGrid from './ChannelCardGroupGrid';

  export default {
    name: 'ChannelsPage',
    metaInfo() {
      return {
        title: this.$tr('documentTitle'),
      };
    },
    components: {
      KIconButton,
      PageHeader,
      ChannelCardGroupGrid,
    },
    mixins: [commonCoreStrings],
    data() {
      return {
        searchQuery: '',
        searchFocus: false,
      };
    },
    computed: {
      ...mapState('topicsRoot', { channels: 'rootNodes' }),
      filteredChannels() {
        const re = new RegExp(`.*${this.searchQuery}.*`, 'i');
        return this.channels.filter(c => c.title.match(re));
      },
      groups() {
        return CustomChannelGroups.filter(g => this.getChannels(g).length);
      },
    },
    methods: {
      genChannelLink(channel_id) {
        return {
          name: PageNames.TOPICS_CHANNEL,
          params: { channel_id },
        };
      },
      filter() {
        console.log('search!');
      },
      searchAppareance() {
        return this.searchFocus ? 'raised-button' : 'flat-button';
      },
      getChannels(group) {
        return this.filteredChannels.filter(c => group.channels.includes(c.id));
      },
    },
    $trs: {
      documentTitle: 'All channels',
    },
  };

</script>


<style lang="scss" scoped>

  .channels {
    width: 100%;
    height: 100vh;
    min-height: 600px;
    padding: 20px;
    color: white;
    background-color: #3a3a3a;

    .channelsgrid {
      clear: both;
    }

    .searchbar {
      width: 100%;
      text-align: right;

      .search-input {
        background-color: transparent;
        border: 0;
        border-bottom: 1px solid white;
        opacity: 0.5;
        transition: all 1s ease;

        &:focus {
          opacity: 1;
        }
      }

      button {
        transition: all 1s ease;
      }
    }
  }

</style>
