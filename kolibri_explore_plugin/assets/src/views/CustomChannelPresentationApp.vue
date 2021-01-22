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
  import { ContentNodeResource } from 'kolibri.resources';
  import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';
  import axios from 'axios';

  const nameSpace = 'hashi';

  export default {
    name: 'CustomChannelPresentationApp',
    computed: {
      rooturl() {
        return `${this.content.files[0].storage_url}?SKIP_HASHI=true?date=${+new Date()}`;
      },
      ...mapState('topicsTree', { content: 'content' }),
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
          this.sendChannelInformation();
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
      sendChannelInformation() {
        if (!this.$refs.iframe) {
          return;
        }
        const iframeWindow = this.$refs.iframe.contentWindow;
        const { channel } = this.$store.state.topicsTree;
        const currentNodeId = this.$store.state.topicsTree.content.id;

        ContentNodeResource.fetchCollection({
          getParams: {
            channel_id: channel.id,
            user_kind: this.$store.getters.getUserKind,
          },
        }).then(nodes => {
          const promises = nodes.filter(node => {
            return node.id !== currentNodeId;
          });

          Promise.all(promises).then(node => {
            const event = 'sendChannelInformation';
            const message = {
              event,
              nameSpace,
              data: { channel, nodes: node },
            };
            iframeWindow.postMessage(message, '*');
          });
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
