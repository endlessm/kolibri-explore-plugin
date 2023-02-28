<template>

  <iframe
    v-show="apiIsReady"
    ref="iframe"
    class="custom-presentation-iframe"
    frameBorder="0"
    :src="rooturl"
    @load="$emit('customPresentationLoadCompleted')"
  >
  </iframe>

</template>


<script>

  import { mapState } from 'vuex';
  import urls from 'kolibri.urls';

  import plugin_data from 'plugin_data';
  import { getAppNameByID } from '../customApps';
  import { PageNames } from '../constants';
  import { KolibriApi } from '../kolibriApi';

  function serializeUrlParameters(parameters) {
    return Object.keys(parameters)
      .map(k => k + '=' + encodeURIComponent(parameters[k]))
      .join('&');
  }

  export default {
    name: 'CustomChannelPresentationApp',
    emits: ['customPresentationLoadStarted', 'customPresentationLoadCompleted'],
    data: function() {
      return {
        apiIsReady: false,
      };
    },
    computed: {
      rooturl() {
        const app = getAppNameByID(this.channel.id);
        const url = urls['kolibri:kolibri_explore_plugin:app_custom_presentation']({ app: app });
        const parameters = {
          ...this.customAppParameters,
          isStandaloneChannel: plugin_data.showAsStandaloneChannel,
        };
        const parametersString = serializeUrlParameters(parameters);
        if (parametersString !== '') {
          return `${url}?${parametersString}`;
        }
        return url;
      },
      ...mapState('topicsTree', ['backFromCustomPage', 'channel', 'customAppParameters']),
      iframeWindow() {
        return this.$refs.iframe.contentWindow;
      },
    },
    watch: {
      channel() {
        this.$nextTick(function() {
          this.iframeWindow.kolibri = new KolibriApi(this.channel.id);
          this.apiIsReady = true;
        });
      },
    },
    mounted() {
      window.addEventListener('message', this.onMessage);
      this.$emit('customPresentationLoadStarted');
    },
    beforeDestroy() {
      window.removeEventListener('message', this.onMessage);
      this.$emit('customPresentationLoadCompleted');
    },
    methods: {
      onMessage(event) {
        if (
          !event.data.event ||
          !event.data.nameSpace ||
          event.data.nameSpace !== 'customChannelPresentation'
        ) {
          return;
        }
        if (event.data.event === 'goToChannelList') {
          this.goToChannelList();
        }
      },
      goToChannelList() {
        this.$router.push({
          name: this.backFromCustomPage || PageNames.TOPICS_ROOT,
        });
      },
    },
  };

</script>


<style lang="scss" scoped>

  .custom-presentation-iframe {
    width: 100%;
    height: 100vh;
    // Remove this arbitrary value for avoiding scrollbar.
    margin-bottom: -6px;
  }

</style>
