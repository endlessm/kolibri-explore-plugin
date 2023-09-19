<template>

  <div v-if="!isIframe" class="dev mx-1 text-right">
    <span v-b-modal.buildinfo class="badge badge-warning">{{ title }}</span>

    <b-modal
      v-if="info"
      id="buildinfo"
      ref="dev-modal"
      :title="$tr('aboutThisBuild')"
      okOnly
      headerCloseVariant="light"
    >
      <h6 class="my-3">
        {{ $tr('releaseInformation') }}
      </h6>
      <b-list-group class="text-dark">
        <b-list-group-item>{{ $tr('commitKey') }} {{ info.commit }}</b-list-group-item>
        <b-list-group-item>{{ $tr('dateKey') }} {{ info.date }}</b-list-group-item>
        <b-list-group-item>{{ $tr('lastReleaseKey') }} {{ info.last_release }}</b-list-group-item>
      </b-list-group>
      <h6 class="my-3">
        Log of changes
      </h6>
      <b-list-group class="text-dark">
        <b-list-group-item v-for="commit in info.log" :key="commit.commit">
          {{ commit.subject }} <br> <i>{{ commit.author }}</i>
        </b-list-group-item>
      </b-list-group>
      <h6 class="my-3">
        {{ $tr('themeDebugging') }}
      </h6>
      <b-list-group class="text-dark">
        <b-list-group-item
          v-for="(channelName, channelId) in testChannels"
          :key="channelId"
          href="#"
          @click="goToTestPage(channelId)"
        >
          {{ channelName }}
        </b-list-group-item>
      </b-list-group>
    </b-modal>
  </div>

</template>


<script>

  import urls from 'kolibri.urls';
  import { CustomChannelApps } from '../customApps';
  import { PageNames } from '../constants';

  export default {
    name: 'DevTag',
    data() {
      return {
        info: null,
        testChannels: CustomChannelApps,
      };
    },
    computed: {
      title() {
        if (this.info) {
          return this.info.commit;
        }

        return this.$tr('loadingPlaceholder');
      },
      isIframe() {
        return window.parent.location !== window.location;
      },
    },
    mounted() {
      this.getBuildInfo();
    },
    methods: {
      getBuildInfo() {
        const buildInfo = urls.static(`build-info.json`);
        fetch(buildInfo)
          .then(response => response.json())
          .then(data => {
            this.info = data;
          })
          .catch(error => {
            console.error(error);
          });
      },
      goToTestPage(channelId) {
        this.$refs['dev-modal'].hide();
        this.$router.push({
          name: PageNames.TOPICS_TEST,
          params: { channel_id: channelId },
        });
      },
    },
    $trs: {
      aboutThisBuild: {
        message: 'About this build',
        context: 'Title for the developer information page',
      },
      releaseInformation: {
        message: 'Release information',
        context: 'Header on the developer information page',
      },
      commitKey: {
        message: 'Commit:',
        context: 'Table key for release information',
      },
      dateKey: {
        message: 'Date:',
        context: 'Table key for release information',
      },
      lastReleaseKey: {
        message: 'Last Release:',
        context: 'Table key for release information',
      },
      themeDebugging: {
        message: 'Theme debugging',
        context: 'Header on the developer information page',
      },
      loadingPlaceholder: {
        message: 'loading…',
        context: 'Placeholder while loading the developer information page',
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .dev {
    position: fixed;
    top: 0;
    right: 0;
    z-index: $zindex-tooltip !important;
  }

  ::v-deep .modal-body {
    padding-top: 0;
  }

</style>
