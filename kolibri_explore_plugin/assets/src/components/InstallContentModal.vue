<template>

  <div>
    <transition name="fade">
      <b-button
        v-if="!isModalVisible && downloading"
        variant="primary"
        class="install-content rounded-circle"
        @click="showModal"
      >
        <div :style="buttonStyles" class="button-progress rounded-circle"></div>
        <DownloadIcon />
      </b-button>
    </transition>

    <b-modal
      id="install-content-modal"
      v-model="isModalVisible"
      headerCloseVariant="light"
      :hideFooter="downloading"
      @hide="onHide"
    >
      <template #modal-title>
        Welcome to Endless Learning
      </template>
      <h2 v-if="downloading">
        Downloading&hellip;
      </h2>
      <h2 v-else>
        Download Endless Learning Collection
      </h2>
      <p v-if="downloading">
        You can close this window during the download and continue to
        explore the existing content.
      </p>

      <div v-if="downloading" class="d-block text-center">
        <b-progress
          :value="progress"
          :max="100"
          showProgress
          animated
          class="my-2"
        />
        <b-button v-b-toggle.details variant="link">
          More details
        </b-button>
        <b-collapse id="details" class="mt-2">
          <div v-for="job in filteredJobs" :key="job.id">
            <b-row>
              <b-col>{{ job.channel_name }}</b-col>
              <b-col cols="9">
                <div v-if="job.status === 'COMPLETED'">
                  Completed
                </div>
                <b-progress
                  v-else
                  :value="job.percentage"
                  :max="1"
                  variant="success"
                  showProgress
                  animated
                />
              </b-col>
            </b-row>
          </div>
        </b-collapse>
      </div>
      <template #modal-footer>
        <b-button
          class="mt-3"
          block
          @click="downloadContent"
        >
          Download
        </b-button>
      </template>
    </b-modal>
  </div>

</template>


<script>

  import axios from 'axios';
  import urls from 'kolibri.urls';
  import { mapState } from 'vuex';

  import DownloadIcon from 'vue-material-design-icons/ProgressDownload.vue';
  import { ChannelResource } from 'kolibri.resources';
  import { showChannels } from '../modules/topicsRoot/handlers';

  export default {
    name: 'InstallContentModal',
    components: { DownloadIcon },
    data() {
      return {
        pollingId: null,
        jobs: null,
        isModalVisible: false,
        channelsDownloaded: 0,
        downloading: false,
      };
    },
    computed: {
      ...mapState(['visibleInstallContentModal']),
      filteredJobs() {
        if (!this.jobs) {
          return [];
        }
        return this.jobs.filter(j => j.percentage <= 1);
      },
      progress() {
        const jobs = this.filteredJobs.map(j => j.percentage);
        const sum = jobs.reduce((a, b) => a + b, 0);
        return (100 * sum) / this.filteredJobs.length;
      },
      buttonStyles() {
        const stop = this.progress;
        const color2 = 'rgba(255, 255, 255, 0.2)';
        const color1 = 'rgba(255, 255, 255, 0)';
        return {
          background:
            'linear-gradient(90deg,' +
            `${color1} 0%, ${color1} ${stop}%,` +
            `${color2} ${stop}%, ${color2} 100%)`,
        };
      },
    },
    watch: {
      visibleInstallContentModal() {
        this.isModalVisible = this.visibleInstallContentModal;
      },
    },
    beforeDestroy() {
      clearTimeout(this.pollingId);
    },
    mounted() {
      this.pollJobs();
      ChannelResource.useContentCacheKey = false;
    },
    methods: {
      downloadContent() {
        this.downloading = true;
        const url = urls['kolibri:kolibri_explore_plugin:endless_learning_collection']();
        this.jobs = [];
        axios
          .post(url)
          .then(() => {
            this.pollJobs();
          })
          .catch(() => {
            this.downloading = false;
          });
      },
      pollJobs() {
        clearTimeout(this.pollingId);

        const url = urls['kolibri:kolibri_explore_plugin:endless_learning_collection']();
        axios.get(url).then(({ data }) => {
          this.jobs = data;
          const completedJobs = this.jobs.filter(j => j.status === 'COMPLETED');
          const completed = completedJobs.length;

          if (completed > 0 && completed === this.jobs.length) {
            // Download is completed
            this.$store.commit('SET_SHOW_INSTALL_CONTENT', false);
            ChannelResource.clearCache();
            showChannels(this.$store);
            this.downloading = false;
          } else {
            if (completed !== this.channelsDownloaded) {
              this.channelsDownloaded = completed;
              ChannelResource.clearCache();
              showChannels(this.$store);
            }

            this.downloading = this.jobs.some(j => j.status !== 'COMPLETED');
            if (this.downloading) {
              this.pollingId = setTimeout(() => this.pollJobs(), 1500);
            }
          }
        });
      },
      onHide() {
        this.$store.commit('SET_SHOW_INSTALL_CONTENT', false);
      },
      showModal() {
        this.$store.commit('SET_SHOW_INSTALL_CONTENT', true);
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .install-content {
    position: fixed;
    bottom: $spacer;
    left: $spacer;
    z-index: $zindex-fixed;
    // Remove 2px border from the actual size to match the slidable cards row:
    width: $circled-button-size + 4px;
    height: $circled-button-size + 4px;
    padding: 0;
  }

  .button-progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

</style>
