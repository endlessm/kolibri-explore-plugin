<template>

  <b-modal
    id="install-content-modal"
    size="xl"
    centered
    :visible="true"
    :noCloseOnBackdrop="true"
    :noCloseOnEsc="true"
    :hideFooter="true"
    :hideHeaderClose="true"
  >
    <b-container>
      <h1 class="text-primary">
        Downloading&hellip;
      </h1>
      <h5 class="text-muted">
        Please wait while
        the collection is downloading.
      </h5>

      <hr>

      <b-row class="my-5">
        <b-col cols="5">
          <h6 class="text-muted">
            {{ statusLabel }}
          </h6>
        </b-col>
        <b-col>
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
        </b-col>
      </b-row>

      <hr>

    </b-container>
  </b-modal>

</template>


<script>

  import client from 'kolibri.client';
  import urls from 'kolibri.urls';

  const UPDATE_DELAY = 1500;

  export default {
    name: 'InstallContentModal',
    components: {},
    emits: ['completed'],
    props: {},
    data() {
      return {
        status: null,
        updateIntervalId: null,
      };
    },
    computed: {
      statusLabel() {
        if (this.status === null || this.status.stage === 'NOT_STARTED') {
          return 'Loading…';
        } else if (this.status.stage === 'COMPLETED') {
          return 'Download completed';
        } else if (this.status.stage === 'IMPORTING_CHANNELS') {
          return `Fetching information (${this.status.current_task_number} of ${this.status.total_tasks_number})…`;
        } else if (this.status.stage === 'IMPORTING_CONTENT') {
          let label = 'Downloading content';
          if (this.status.extra_metadata.channel_name) {
            label += ` for channel ${this.status.extra_metadata.channel_name}`;
          }
          const remaining = this.status.total_tasks_number - this.status.current_task_number;
          if (remaining > 0) {
            label += ` (${remaining} more channels left)`;
          }
          label += '…';
          return label;
        } else {
          // This shouldn't be reached anyways.
          return 'Loading…';
        }
      },
    },
    mounted() {
      return this.getDownloadStatus().then(status => {
        this.status = status;
        if (this.checkCompleted()) {
          return;
        }
        if (this.status.stage !== 'NOT_STARTED') {
          this.updateIntervalId = setInterval(this.updateLoop, UPDATE_DELAY);
        }
      });
    },
    beforeDestroy() {
      this.clearUpdateInterval();
    },
    methods: {
      checkCompleted() {
        if (this.status && this.status.stage === 'COMPLETED') {
          this.$emit('completed');
          return true;
        }
        return false;
      },
      updateLoop() {
        return this.updateDownload().then(status => {
          this.status = status;
          if (this.checkCompleted()) {
            this.clearUpdateInterval();
          }
        });
      },
      clearUpdateInterval() {
        if (this.updateIntervalId !== null) {
          clearInterval(this.updateIntervalId);
          this.updateIntervalId = null;
        }
      },
      getDownloadStatus() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:get_download_status'](),
        }).then(({ data }) => {
          return data.status;
        });
      },
      updateDownload() {
        return client({
          url: urls['kolibri:kolibri_explore_plugin:update_download'](),
          method: 'POST',
        }).then(({ data }) => {
          return data.status;
        });
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  ::v-deep .modal-content {
    color: black;
    text-align: center;
    background-color: white;
  }

</style>
