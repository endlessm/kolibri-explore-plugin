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
          You may close this window and explore content while
          the collection is downloading.
        </h5>

        <hr>

        <b-row class="my-5">
          <b-col cols="5">
            <h6 class="text-muted">
              {{ collection.metadata.subtitle }} Collection {{ collection.metadata.title }}
            </h6>
          </b-col>
          <b-col>
            <b-progress
              :max="100"
            >
              <b-progress-bar
                :value="progress"
                animated
              >
                {{ progress.toFixed(0) }}%
              </b-progress-bar>
            </b-progress>
          </b-col>
        </b-row>

        <hr>

        <b-button
          class="mb-2 mt-3"
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

  import client from 'kolibri.client';
  import urls from 'kolibri.urls';
  import ProgressDownloadIcon from 'vue-material-design-icons/ProgressDownload.vue';

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
      grade: {
        type: String,
        default: 'primary',
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
      progress() {
        const jobs = this.jobs.map(j => {
          if (j.percentage > 1 || !j.channel_name) {
            return 0;
          }
          if (j.status === 'FAILED') {
            return 1;
          }
          return j.percentage;
        });
        const sum = jobs.reduce((a, b) => a + b, 0);
        return (100 * sum) / this.jobs.length;
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
      visible() {
        if (this.visible && !this.downloading) {
          this.downloadContent();
        }
      },
    },
    beforeDestroy() {
      clearTimeout(this.pollingId);
    },
    methods: {
      downloadContent() {
        if (this.downloading) {
          return;
        }

        this.downloading = true;
        this.jobs = [];
        const collection = this.collection.metadata.subtitle.toLowerCase();
        const grade = this.grade.toLowerCase();
        client({
          url: urls['kolibri:kolibri_explore_plugin:endless_key_collections'](),
          method: 'POST',
          data: { grade, collection },
        })
          .then(() => {
            this.pollJobs();
          })
          .catch(error => {
            this.$emit('hide', error);
            this.downloading = false;
          });
      },
      pollJobs() {
        clearTimeout(this.pollingId);

        client({
          url: urls['kolibri:kolibri_explore_plugin:endless_key_collections'](),
        })
          .then(({ data }) => {
            this.jobs = data.jobs;
            const completedJobs = this.jobs.filter(j => j.status === 'COMPLETED');
            const queuedJobs = this.jobs.filter(j => j.status === 'QUEUED');
            const runningJobs = this.jobs.filter(j => j.status === 'RUNNING');
            const failedJobs = this.jobs.filter(j => j.status === 'FAILED');

            const completed = completedJobs.length + failedJobs.length;

            console.log('Downloading: ');
            console.log(`  Total Jobs: ${this.jobs.length}`);
            console.log(`      Queued: ${queuedJobs.length}`);
            console.log(`     Running: ${runningJobs.length}`);
            console.log(`      Failed: ${failedJobs.length}`);
            console.log(`   Completed: ${completedJobs.length}`);
            console.log(`    Progress: ${this.progress}`);
            for (var i = 0; i < this.jobs.length; i++) {
              const job = this.jobs[i];
              console.log(`       JOB: ${job.channel_name}|${job.status} ${job.percentage}`);
            }

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

              this.downloading = this.jobs.some(
                j => j.status !== 'COMPLETED' && j.status !== 'FAILED'
              );
              if (this.downloading) {
                this.pollingId = setTimeout(() => this.pollJobs(), 1500);
              } else {
                this.$emit('newContent');
                this.$emit('hide');
                this.downloading = false;
              }
            }
          })
          .catch(() => {
            if (this.downloading) {
              this.pollingId = setTimeout(() => this.pollJobs(), 1500);
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
