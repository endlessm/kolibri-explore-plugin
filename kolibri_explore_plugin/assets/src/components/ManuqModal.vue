<template>

  <b-modal
    id="manuq-modal"
    size="xl"
    centered
    title="Hola Mundo"
    :hideFooter="true"
    headerCloseVariant="light"
  >
    <!-- <template v-if="loading">
      <p>loading...</p>
    </template>
    <template v-else>
      <ul v-for="info in collectionsInfo" :key="info.grade">
        <li>{{ info.grade }}</li>
        <li>{{ info.metadata.title }}</li>
        <li>{{ info.metadata.subtitle }}</li>
        <li v-for="collection in info.collections" :key="info.grade + collection.name">
          {{ collection.name }}
          <ul>
            <li>{{ collection.metadata.title }}</li>
            <li>{{ collection.metadata.subtitle }}</li>
            <li>{{ collection.metadata.description }}</li>
            <li>{{ collection.available ? "YEP" : "NOPE" }}</li>
          </ul>
        </li>
      </ul>
    </template> -->

    <p>Status: {{ statusLabel }}</p>
    <b-button-group class="mx-auto w-100">
      <b-button @click="onStartDownload('primary', 'small')">
        Start
      </b-button>
      <b-button @click="onResumeDownload">
        Resume
      </b-button>
      <b-button @click="onContinueDownload">
        Continue
      </b-button>
      <b-button @click="onGetDownloadStatus">
        Get status
      </b-button>
      <b-button @click="onCancelDownload">
        Cancel
      </b-button>
    </b-button-group>

    <p></p>

    <b-progress
      v-if="status !== null"
      :max="1"
    >
      <b-progress-bar
        :value="status.progress"
        animated
      >
        {{ (status.progress * 100).toFixed() }}%
      </b-progress-bar>
    </b-progress>
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
        status: null,
        collectionsInfo: null,
      };
    },
    computed: {
      statusLabel() {
        if (this.loading) {
          return 'Loading';
        } else if (this.status === null) {
          return 'Idle';
        } else {
          return `${this.status.stage} (${this.status.completed} of ${this.status.total})`;
        }
      },
    },
    watch: {},
    mounted() {
      // FIXME also try resume here?
      return this.onGetCollectionsInfo();
    },
    beforeDestroy() {},
    methods: {
      onGetCollectionsInfo() {
        this.loading = true;
        return client({
          url: urls['kolibri:kolibri_explore_plugin:get_collections_info'](),
        }).then(({ data }) => {
          this.loading = false;
          console.log(data);
          if (data.collectionsInfo) {
            this.collectionsInfo = data.collectionsInfo;
          }
        });
      },
      onStartDownload(grade, name) {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:start_download'](),
          method: 'POST',
          data: { grade, name },
        }).then(({ data }) => {
          console.log(data);
          if (data.status) {
            this.status = data.status;
          }
        });
      },
      onResumeDownload() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:resume_download'](),
          method: 'POST',
        }).then(({ data }) => {
          console.log(data);
          if (data.status) {
            this.status = data.status;
          }
        });
      },
      onContinueDownload() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:continue_download'](),
          method: 'POST',
        }).then(({ data }) => {
          console.log(data);
          if (data.status) {
            this.status = data.status;
          }
        });
      },
      onGetDownloadStatus() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:get_download_status'](),
        }).then(({ data }) => {
          console.log(data);
          if (data.status) {
            this.status = data.status;
          }
        });
      },
      onCancelDownload() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:cancel_download'](),
          method: 'POST',
        }).then(({ data }) => {
          console.log(data);
          if (data.status) {
            this.status = data.status;
          }
        });
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

</style>
