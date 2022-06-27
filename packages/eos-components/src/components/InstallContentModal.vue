<template>

  <div v-if="collection">
    <transition name="fade">
      <b-button
        v-if="!visible && downloading"
        variant="primary"
        class="install-content rounded-circle"
        @click="$emit('showModal')"
      >
        <div :style="buttonStyles" class="button-progress rounded-circle"></div>
        <ProgressDownloadIcon />
      </b-button>
    </transition>

    <b-modal
      id="install-content-modal"
      size="xl"
      centered
      :visible="visible"
      :hideFooter="true"
      @hide="$emit('hide')"
    >
      <b-container>
        <h1 class="text-primary">
          Downloading&hellip;
        </h1>
        <h5 class="text-muted">
          You can close this window during meanwhile
          to explore the content as it finishes downloading.
        </h5>

        <hr>

        <b-row class="my-5">
          <b-col cols="5">
            <h6 class="text-muted">
              {{ collection.subtitle }} Collection {{ collection.title }}
            </h6>
          </b-col>
          <b-col>
            <b-progress
              :value="progress"
              :max="100"
              showProgress
              animated
            />
          </b-col>
        </b-row>

        <b-button
          class="mb-2 mt-5"
          variant="primary"
          @click="$emit('hide')"
        >
          Explore
        </b-button>

      </b-container>
    </b-modal>
  </div>

</template>


<script>

  import axios from 'axios';
  import ProgressDownloadIcon from 'vue-material-design-icons/ProgressDownload.vue';

  import { ApiURL } from '../constants';

  export default {
    name: 'InstallContentModal',
    components: {
      ProgressDownloadIcon,
    },
    emits: ['hide', 'showModal', 'newContent'],
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      collection: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        pollingId: null,
        jobs: null,
        channelsDownloaded: 0,
        downloading: false,
      };
    },
    computed: {
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
      collection() {
        if (this.collection) {
          this.downloadContent();
        }
      },
    },
    beforeDestroy() {
      clearTimeout(this.pollingId);
    },
    methods: {
      downloadContent() {
        this.downloading = true;
        this.jobs = [];
        axios
          .post(ApiURL, { collection: this.collection.subtitle.toLowerCase()})
          .then(() => {
            this.pollJobs();
          })
          .catch(() => {
            this.downloading = false;
          });
      },
      pollJobs() {
        clearTimeout(this.pollingId);

        axios.get(ApiURL).then(({ data }) => {
          this.jobs = data.jobs;
          const completedJobs = this.jobs.filter(j => j.status === 'COMPLETED');
          const completed = completedJobs.length;

          if (completed > 0 && completed === this.jobs.length) {
            // Download is completed
            this.$emit('newContent');
            this.$emit('hide');
            this.downloading = false;
          } else {
            this.downloading = true;
            if (completed !== this.channelsDownloaded) {
              this.channelsDownloaded = completed;
              this.$emit('newContent');
            }

            this.downloading = this.jobs.some(j => j.status !== 'COMPLETED');
            if (this.downloading) {
              this.pollingId = setTimeout(() => this.pollJobs(), 1500);
            }
          }
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

  .card {
    border: 1px solid;
    border-radius: $border-radius-lg;
  }

  ::v-deep .card-subtitle {
    font-weight: bold;
    color: black !important;
  }

  .install-content {
    position: fixed;
    top: $spacer + $navbar-height;
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
