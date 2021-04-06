<template>

  <iframe
    ref="iframe"
    class="custom-presentation-iframe"
    frameBorder="0"
    :src="rooturl"
  >
  </iframe>

</template>


<script>

  import { mapState } from 'vuex';
  import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';
  import urls from 'kolibri.urls';
  import axios from 'axios';
  import { ContentNodeResource } from '../apiResources.js';

  import { getAppNameByID } from '../customApps';

  const nameSpace = 'hashi';

  export default {
    name: 'CustomChannelPresentationApp',
    computed: {
      rooturl() {
        const app = getAppNameByID(this.channel.id);
        const url = urls['kolibri:kolibri_explore_plugin:app_custom_presentation']({ app: app });
        if (this.topic.id) {
          return `${url}?topicId=${this.topic.id}`;
        }
        return url;
      },
      ...mapState('topicsTree', ['channel', 'topic']),
    },
    mounted() {
      window.addEventListener('message', event => {
        if (
          !event.data.event ||
          !event.data.nameSpace ||
          event.data.nameSpace !== 'customChannelPresentation'
        ) {
          return;
        }
        if (event.data.event === 'askChannelInformation') {
          const options = JSON.parse(event.data.data);
          this.sendChannelInformation(options);
        }
        if (event.data.event === 'goToContent') {
          this.goToContent(event.data.data);
        }
        if (event.data.event === 'getThumbnail') {
          this.sendThumbnail(event.data.data);
        }
      });
    },
    methods: {
      sendChannelInformation(options) {
        if (!this.$refs.iframe) {
          return;
        }
        const iframeWindow = this.$refs.iframe.contentWindow;
        const { channel } = this.$store.state.topicsTree;

        ContentNodeResource.getContentByFilter({
          parent: channel.id,
          userKind: this.$store.getters.getUserKind,
          filters: options.filters,
        }).then(nodes => {
          const event = 'sendChannelInformation';
          const message = {
            event,
            nameSpace,
            data: { channel, nodes },
          };
          iframeWindow.postMessage(message, '*');
        });
      },

      sendThumbnail(id) {
        const iframeWindow = this.$refs.iframe.contentWindow;
        const event = 'sendThumbnail';
        ContentNodeResource.fetchModel({ id }).then(node => {
          const thumbnailUrl = getContentNodeThumbnail(node);
          if (!thumbnailUrl) {
            const message = {
              event,
              nameSpace,
              data: { id, thumbnail: null },
            };
            iframeWindow.postMessage(message, '*');
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
            iframeWindow.postMessage(message, '*');
          });
        });
      },

      goToContent(id) {
        this.$router.push({ name: 'TOPICS_CONTENT', params: { id } });
      },
    },
  };

</script>


<style lang="scss" scoped>

  .custom-presentation-iframe {
    width: 100%;
    height: 100vh;
    // Remove 5px for avoiding scrollbar.
    margin-bottom: -5px;
  }

</style>
