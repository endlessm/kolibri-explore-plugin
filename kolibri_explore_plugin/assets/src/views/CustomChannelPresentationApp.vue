<template>

  <iframe
    ref="iframe"
    class="custom-presentation-iframe"
    frameBorder="0"
    :src="rooturl"
    @load="$emit('load')"
  >
  </iframe>

</template>


<script>

  import { mapState } from 'vuex';
  import urls from 'kolibri.urls';

  import axios from 'axios';
  import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';
  import { getAppNameByID } from '../customApps';
  import { PageNames } from '../constants';
  import { ContentNodeResource } from '../apiResources.js';

  const nameSpace = 'hashi';

  export default {
    name: 'CustomChannelPresentationApp',
    computed: {
      rooturl() {
        const app = getAppNameByID(this.channel.id);
        const url = urls['kolibri:kolibri_explore_plugin:app_custom_presentation']({ app: app });
        if (this.customAppContent.id) {
          const { kind, id } = this.customAppContent;
          return `${url}?${kind}Id=${id}`;
        } else if (this.customAppContent.test) {
          return `${url}?test=true`;
        }
        return url;
      },
      ...mapState('topicsTree', ['channel', 'customAppContent']),
      iframeWindow() {
        return this.$refs.iframe.contentWindow;
      },
    },
    mounted() {
      window.addEventListener('message', this.onMessage);
      this.$emit('loading');
    },
    beforeDestroy() {
      window.removeEventListener('message', this.onMessage);
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
        if (event.data.event === 'askChannelInformation') {
          this.sendChannelInformation();
        }
        if (event.data.event === 'goToChannelList') {
          this.goToChannelList();
        }
        if (event.data.event === 'getThumbnail') {
          this.sendThumbnail(event.data.data);
        }
      },
      sendChannelInformation() {
        if (!this.iframeWindow) {
          return;
        }

        ContentNodeResource.fetchCollection({
          getParams: {
            channel_id: this.channel.id,
            user_kind: this.$store.getters.getUserKind,
          },
        }).then(nodes => {
          Promise.all(nodes).then(node => {
            const event = 'sendChannelInformation';
            const message = {
              event,
              nameSpace,
              data: { channel: this.channel, nodes: node },
            };
            this.iframeWindow.postMessage(message, '*');
          });
        });
      },

      sendThumbnail(id) {
        if (!this.iframeWindow) {
          return;
        }

        const event = 'sendThumbnail';
        ContentNodeResource.fetchModel({ id }).then(node => {
          const thumbnailUrl = getContentNodeThumbnail(node);
          if (!thumbnailUrl) {
            const message = {
              event,
              nameSpace,
              data: { id, thumbnail: null },
            };
            this.iframeWindow.postMessage(message, '*');
            return;
          }
          const promise = axios
            .get(thumbnailUrl, { responseType: 'arraybuffer' })
            .then(response => {
              const returnedB64 = Buffer.from(response.data).toString('base64');
              const thumbnail = `data:${response.headers['content-type']};base64,${returnedB64}`;
              return thumbnail;
            });
          promise.then(thumbnail => {
            const message = {
              event,
              nameSpace,
              data: { id, thumbnail },
            };
            this.iframeWindow.postMessage(message, '*');
          });
        });
      },

      goToChannelList() {
        this.$router.push({
          name: PageNames.ROOT,
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
