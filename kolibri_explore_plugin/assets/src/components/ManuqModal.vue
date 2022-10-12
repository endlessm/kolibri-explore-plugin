<template>

  <b-modal
    id="manuq-modal"
    size="xl"
    centered
    title="Hola Mundo"
    :hideFooter="true"
    headerCloseVariant="light"
  >
    <template v-if="loading">
      <p>loading...</p>
    </template>
    <template v-else>
      <p>INFO!</p>
    </template>

    <p>Status: {{ statusLabel }}</p>
    <b-button @click="onStartDownload">
      Start
    </b-button>
    <b-button @click="onContinueDownload">
      Continue
    </b-button>
    <b-button @click="onGetDownloadStatus">
      Get status
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
        loading: true,
        statusLabel: 'idle',
        collectionsInfo: null,
      };
    },
    computed: {},
    watch: {},
    mounted() {
      return this.onGetCollectionsInfo();
    },
    beforeDestroy() {},
    methods: {
      onGetCollectionsInfo() {
        this.loading = true;
        this.statusLabel = 'getting collections info...';
        return client({
          url: urls['kolibri:kolibri_explore_plugin:get_collections_info'](),
        }).then(({ data }) => {
          this.loading = false;
          this.statusLabel = 'got collections info';
          console.log(data);
          if (data.collectionsInfo) {
            this.collectionsInfo = data.collectionsInfo;
          }
        });
      },
      onStartDownload() {
        this.statusLabel = 'starting download...';
        return client({
          url: urls['kolibri:kolibri_explore_plugin:start_download'](),
          method: 'POST',
          data: { grade: 'foo', name: 'bar' },
        }).then(({ data }) => {
          console.log(data);
          if (data.status) {
            this.statusLabel = data.status;
          }
        });
      },
      onContinueDownload() {
        this.statusLabel = 'continuing download...';
        return client({
          url: urls['kolibri:kolibri_explore_plugin:continue_download'](),
          method: 'POST',
        }).then(({ data }) => {
          console.log(data);
          if (data.status) {
            this.statusLabel = data.status;
          }
        });
      },
      onGetDownloadStatus() {
        this.statusLabel = 'getting status...';
        return client({
          url: urls['kolibri:kolibri_explore_plugin:get_download_status'](),
        }).then(({ data }) => {
          console.log(data);
          if (data.status) {
            this.statusLabel = data.status;
          }
        });
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

</style>
