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
    <p v-if="errorLabel !== null" class="text-danger">
      Error: {{ errorLabel }}
    </p>
    <b-button-group class="mx-auto w-100">
      <b-button @click="startOrResumeDownload">
        Start/Resume
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
        errorLabel: null,
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
      this.loading = true;
      return Promise.all([this.onGetCollectionsInfo(), this.tryStartResume()]).then(() => {
        this.loading = false;
      });
    },
    beforeDestroy() {},
    methods: {
      onGetCollectionsInfo() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:get_collections_info'](),
        }).then(({ data }) => {
          console.log(data);
          if (data.collectionsInfo) {
            this.collectionsInfo = data.collectionsInfo;
          }
        });
      },
      tryStartResume() {
        return this.onGetDownloadStatus().then(() => {
          if (this.status.stage === 'NOT_STARTED') {
            return this.startOrResumeDownload();
          }
        });
      },
      startOrResumeDownload() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:get_should_resume'](),
        }).then(({ data }) => {
          console.log(data);
          if (data.shouldResume) {
            return this.onResumeDownload();
          } else {
            return this.onStartDownload('primary', 'small');
          }
        });
      },
      onStartDownload(grade, name) {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:start_download'](),
          method: 'POST',
          data: { grade, name },
        })
          .then(({ data }) => {
            console.log(data);
            this.errorLabel = null;
            if (data.status) {
              this.status = data.status;
            }
          })
          .catch(({ response }) => {
            if (response.data.detail) {
              this.errorLabel = response.data.detail;
            }
          });
      },
      onResumeDownload() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:resume_download'](),
          method: 'POST',
        })
          .then(({ data }) => {
            console.log(data);
            this.errorLabel = null;
            if (data.status) {
              this.status = data.status;
            }
          })
          .catch(({ response }) => {
            if (response.data.detail) {
              this.errorLabel = response.data.detail;
            }
          });
      },
      onContinueDownload() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:continue_download'](),
          method: 'POST',
        })
          .then(({ data }) => {
            console.log(data);
            this.errorLabel = null;
            if (data.status) {
              this.status = data.status;
            }
          })
          .catch(({ response }) => {
            if (response.data.detail) {
              this.errorLabel = response.data.detail;
            }
          });
      },
      onGetDownloadStatus() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:get_download_status'](),
        })
          .then(({ data }) => {
            console.log(data);
            this.errorLabel = null;
            if (data.status) {
              this.status = data.status;
            }
          })
          .catch(({ response }) => {
            if (response.data.detail) {
              this.errorLabel = response.data.detail;
            }
          });
      },
      onCancelDownload() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:cancel_download'](),
          method: 'DELETE',
        })
          .then(({ data }) => {
            console.log(data);
            this.errorLabel = null;
            if (data.status) {
              this.status = data.status;
            }
          })
          .catch(({ response }) => {
            if (response.data.detail) {
              this.errorLabel = response.data.detail;
            }
          });
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

</style>
