<template>

  <b-modal
    id="manuq-modal"
    size="xl"
    centered
    title="Hola Mundo"
    :hideFooter="true"
    headerCloseVariant="light"
  >
    <p>Status: {{ statusLabel }}</p>
    <b-button @click="onImportChannelStart">
      Import channel
    </b-button>
    <b-button @click="onImportChannelCheck">
      Check import channel
    </b-button>
    <b-button @click="onImportContentStart">
      Import content
    </b-button>
    <b-button @click="onImportContentCheck">
      Check import content
    </b-button>
  </b-modal>

</template>


<script>

  import client from 'kolibri.client';
  import urls from 'kolibri.urls';

  export default {
    name: 'ManuqModal',
    metaInfo() {},
    components: {},
    data() {
      return {
        statusLabel: 'idle',
      };
    },
    computed: {},
    watch: {},
    mounted() {},
    beforeDestroy() {},
    methods: {
      onImportChannelStart() {
        this.statusLabel = 'starting...';
        client({
          url: urls['kolibri:kolibri_explore_plugin:start_importchannel'](),
          method: 'POST',
          data: { foo: 'bar' },
        }).then(({ data }) => {
          console.log(data);
          if (data.message) {
            this.statusLabel = data.message;
          }
        });
      },
      onImportChannelCheck() {
        this.statusLabel = 'checking...';
        client({
          url: urls['kolibri:kolibri_explore_plugin:get_importchannel_status'](),
        }).then(({ data }) => {
          console.log(data);
          if (data.message) {
            this.statusLabel = data.message;
          }
        });
      },
      onImportContentStart() {
        this.statusLabel = 'starting...';
        client({
          url: urls['kolibri:kolibri_explore_plugin:start_importcontent'](),
          method: 'POST',
          data: { foo: 'bar' },
        }).then(({ data }) => {
          console.log(data);
          if (data.message) {
            this.statusLabel = data.message;
          }
        });
      },
      onImportContentCheck() {
        this.statusLabel = 'checking...';
        client({
          url: urls['kolibri:kolibri_explore_plugin:get_importcontent_status'](),
        }).then(({ data }) => {
          console.log(data);
          if (data.message) {
            this.statusLabel = data.message;
          }
        });
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

</style>
