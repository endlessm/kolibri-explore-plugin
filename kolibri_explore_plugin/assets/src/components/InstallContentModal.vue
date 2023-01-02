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
        {{ titleLabel }}
      </h1>
      <h5 class="text-muted">
        {{ subtitleLabel }}
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
  import { mapState } from 'vuex';

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
      ...mapState({
        pageVisible: state => state.core.pageVisible,
      }),
      titleLabel() {
        if (this.status !== null) {
          if (this.status.stage === 'IMPORTING_CONTENT') {
            return this.$tr('titleDownloading');
          } else if (this.status.stage === 'APPLYING_EXTERNAL_TAGS') {
            return this.$tr('titleDownloading');
          } else if (this.status.stage === 'COMPLETED') {
            return this.$tr('titleCompleted');
          }
        }
        return this.$tr('titlePreparing');
      },
      subtitleLabel() {
        if (this.status !== null) {
          if (this.status.stage === 'IMPORTING_CONTENT') {
            return this.$tr('subtitleDownloading');
          } else if (this.status.stage === 'APPLYING_EXTERNAL_TAGS') {
            return this.$tr('subtitleDownloading');
          } else if (this.status.stage === 'COMPLETED') {
            return this.$tr('subtitleCompleted');
          }
        }
        return this.$tr('subtitlePreparing');
      },
      statusLabel() {
        if (this.status !== null) {
          if (this.status.stage === 'IMPORTING_CHANNELS') {
            return this.$tr('statusPreparing', {
              current: this.status.current_task_number,
              total: this.status.total_tasks_number,
            });
          } else if (this.status.stage === 'APPLYING_EXTERNAL_TAGS') {
            return this.$tr('statusFinishing', {
              current: this.status.current_task_number,
              total: this.status.total_tasks_number,
            });
          } else if (this.status.stage === 'IMPORTING_CONTENT') {
            const channel = this.status.extra_metadata.channel_name;
            const count = this.status.total_tasks_number - this.status.current_task_number;
            if (channel) {
              if (count > 0) {
                return this.$tr('statusDownloadingChannel', { channel, count });
              } else {
                return this.$tr('statusDownloadingLastChannel', { channel });
              }
            } else {
              if (count > 0) {
                return this.$tr('statusDownloading', { count });
              } else {
                return this.$tr('statusDownloadingLast');
              }
            }
          }
        }
        return '';
      },
    },
    watch: {
      pageVisible() {
        if (!this.pageVisible && this.updateIntervalId !== null) {
          console.debug('Download: Update poll paused.');
          clearInterval(this.updateIntervalId);
          this.updateIntervalId = null;
        } else if (this.pageVisible && this.updateIntervalId === null) {
          console.debug('Download: Update poll resumed.');
          return this.setUpdateInterval();
        }
      },
    },
    mounted() {
      return this.setUpdateInterval();
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
      setUpdateInterval() {
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
    $trs: {
      titleDownloading: 'Downloading…',
      subtitleDownloading: 'Please wait a moment while the collection is downloading.',
      titleCompleted: 'Download completed.',
      subtitleCompleted: 'You can now navigate the content.',
      titlePreparing: 'Preparing to download',
      subtitlePreparing: 'Please wait a moment while the content is being prepared to download.',
      statusPreparing: 'Preparing download ({current} of {total})…',
      statusFinishing: 'Finishing download ({current} of {total})…',
      statusDownloadingChannel:
        'Downloading content for channel {channel} ({count} more channels left)…',
      statusDownloadingLastChannel: 'Downloading content for channel {channel}…',
      statusDownloading: 'Downloading content ({count} more channels left)…',
      statusDownloadingLast: 'Downloading content…',
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
