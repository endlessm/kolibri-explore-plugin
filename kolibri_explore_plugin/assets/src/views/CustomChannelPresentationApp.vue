<template>

  <iframe
    v-show="isKolibriApiInjected"
    ref="iframe"
    class="custom-presentation-iframe"
    frameBorder="0"
    :src="rooturl"
    @load="onIframeLoad"
  >
  </iframe>

</template>


<script>

  import { mapState } from 'vuex';
  import urls from 'kolibri.urls';

  import plugin_data from 'plugin_data';
  import { getAppNameByID } from '../customApps';
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
        isIframeloaded: false,
        isKolibriApiInjected: false,
      };
    },
    computed: {
      canInjectKolibriApi() {
        return !this.coreLoading && this.isIframeloaded;
      },
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
      ...mapState('topicsTree', ['channel', 'customAppParameters']),
      ...mapState({
        coreLoading: state => state.core.loading,
      }),
      iframeWindow() {
        return this.$refs.iframe.contentWindow;
      },
    },
    watch: {
      canInjectKolibriApi() {
        if (!this.canInjectKolibriApi || this.isKolibriApiInjected) {
          return;
        }
        this.iframeWindow.kolibri = new KolibriApi(this.channel.id);
        this.isKolibriApiInjected = true;
        this.$emit('customPresentationLoadCompleted');
      },
    },
    mounted() {
      this.$emit('customPresentationLoadStarted');
    },
    beforeDestroy() {
      this.$emit('customPresentationLoadCompleted');
    },
    methods: {
      onIframeLoad() {
        this.isIframeloaded = true;
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
