<template>
  <div class="card-buttons">
    <EkPlayButton
      v-if="!showDownloadFeature"
      :kind="kind"
      :enabled="isEnabled"
      class="play-button"
      @click="$emit('playButtonClicked')"
    />
    <b-button
      v-if="showDownloadFeature"
      pill
      size="sm"
      :variant="`${kind}-primary`"
      :class="downloadButtonClasses"
      @click="$emit('downloadButtonClicked')"
    >
      <span v-if="downloadText" class="download-button-text">
        {{ downloadText }}
      </span>
      <DownloadIcon
        v-if="isDownloadReady"
        :title="$tr('downloadLabel')"
      />
      <DownloadingIcon
        v-else-if="isDownloading"
        class="downloading"
        :title="$tr('downloadingLabel')"
      />
      <DownloadCompletedIcon
        v-else-if="isDownloadCompleted"
        class="completed"
        :title="$tr('downloadCompletedLabel')"
      />
      <span
        v-else-if="isDownloadFailed"
      >
        <DownloadWarningIcon
          class="failed"
          :title="$tr('downloadRestartLabel')"
        />
        <DownloadRestartIcon
          :title="$tr('downloadRestartLabel')"
        />
      </span>
    </b-button>
  </div>
</template>

<script>
import DownloadIcon from 'vue-material-design-icons/CloudDownloadOutline.vue';
import DownloadingIcon from 'vue-material-design-icons/Autorenew.vue';
import DownloadCompletedIcon from 'vue-material-design-icons/CheckCircle.vue';
import DownloadWarningIcon from 'vue-material-design-icons/AlertOutline.vue';
import DownloadRestartIcon from 'vue-material-design-icons/Reload.vue';
import { DownloadState } from '../constants';

export default {
  name: 'EkCardButtons',
  emits: ['downloadButtonClicked', 'playButtonClicked'],
  components: {
    DownloadIcon,
    DownloadingIcon,
    DownloadCompletedIcon,
    DownloadWarningIcon,
    DownloadRestartIcon,
  },
  props: {
    node: {
      type: Object,
      required: true,
    },
    kind: {
      type: String,
      required: true,
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
    downloadState: {
      type: String,
      default: null,
    },
  },
  computed: {
    isDownloadReady() {
      return this.downloadState === DownloadState.READY;
    },
    isDownloading() {
      return this.downloadState === DownloadState.DOWNLOADING
    },
    isDownloadCompleted() {
      return this.downloadState === DownloadState.COMPLETED
    },
    isDownloadFailed() {
      return this.downloadState === DownloadState.FAILED
    },
    showDownloadFeature() {
      return (
        // The node must be a resource, not a topic:
        this.kind !== 'topic'
        // Either the node is unavailable or the download state is completed:
        && (!this.node.available || this.downloadState === DownloadState.COMPLETED)
        // The download state has been set:
        && this.downloadState !== DownloadState.NOT_CHECKED
      );
    },
    downloadButtonClasses() {
      const result = ['download-button', 'float-right'];
      if (this.downloadState === DownloadState.READY) {
        result.push('download-button--ready');
      } else if (this.downloadState === DownloadState.DOWNLOADING) {
        result.push('download-button--downloading');
      } else if (this.downloadState === DownloadState.COMPLETED) {
        result.push('download-button--completed');
      }
      return result;
    },
    downloadText() {
      if (this.downloadState === DownloadState.READY) {
        return this.$tr('downloadLabel');
      } else if (this.downloadState === DownloadState.DOWNLOADING) {
        return this.$tr('downloadingLabel');
      } else {
        return null;
      }
    },
  },
  $trs: {
    downloadLabel: 'Download',
    downloadingLabel: 'Downloading…',
    downloadCompletedLabel: 'Download completed',
    downloadRestartLabel: 'Restart download',
  },
};
</script>

<style lang="scss" scoped>
@import '../styles.scss';

.card-buttons {
  &::after {
    content: '';
    display: block;
    clear: both;
  }
}

.download-button {
  background-color: transparent;
}

.download-button-text {
  vertical-align: middle;
  margin-right: $btn-padding-y-sm;
}

@keyframes spinner-animation {
  to { transform: rotate(360deg); }
}

.downloading {
  color: $blue;
  display: inline-block;
  animation: 2s linear infinite spinner-animation;
}

.completed {
  color: $teal;
}

.failed {
  color: $yellow;
}

</style>
