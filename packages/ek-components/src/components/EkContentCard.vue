<template>
  <b-card
    noBody
    class="my-2 rounded-lg"
    :class="{
      'shadow-sm': !isHovered && isEnabled,
      'shadow': isHovered && isEnabled,
      'disabled': isDisabled,
    }"
    :disabled="isDisabled"
  >
    <EkContentLink
      :enabled="isEnabled"
      :url="url"
      @isHovered="(hovered) => isHovered = hovered"
    >
      <b-card-body>
        <div
          class="card-img"
          :class="{ 'low-quality': isLowQuality, 'is-thumbnail-wide': isThumbnailWide }"
          :style="cardStyle"
        >
          <span class="sr-only">{{ node.title }}</span>
        </div>
        <div class="body-wrapper">
          <EkCardBody :node="node" :subtitle="subtitle" />
          <EkCardButtons
            :node="node"
            :kind="kind"
            :isEnabled="isEnabled"
            :downloadState="downloadState"
            @downloadButtonClicked="onDownloadButtonClick"
            @playButtonClicked="onPlayButtonClick"
          />
        </div>
      </b-card-body>
    </EkContentLink>
  </b-card>
</template>

<script>
import { DownloadState, MediaQuality } from '../constants';
import { getCardSubtitle } from '../utils';
import cardMixin from './mixins/cardMixin.js';

const DOWNLOAD_CHECK_DELAY = 300;

export default {
  name: 'EkContentCard',
  emits: ['nodeUpdated'],
  mixins: [cardMixin],
  props: {
    node: {
      type: Object,
      required: true,
    },
    isBundle: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      default: '',
    },
    mediaQuality: {
      type: String,
      default: MediaQuality.REGULAR,
    },
  },
  data() {
    return {
      isHovered: false,
      downloadState: null,
      downloadCheckIntervalId: null,
    };
  },
  computed: {
    subtitle() {
      const { node } = this;
      if (this.$store && this.$store.state.isEndlessApp) {
        return getCardSubtitle(node, '');
      }
      return node.description;
    },
    isLowQuality() {
      return this.mediaQuality === MediaQuality.LOW;
    },
    cardStyle() {
      return {
        backgroundImage: `url("${this.thumbnail}")`,
      };
    },
    kind() {
      if (this.isBundle && this.node.kind === 'topic') {
        return 'bundle';
      }
      return this.node.kind;
    },
    isEnabled() {
      return this.node.available || this.downloadState === DownloadState.COMPLETED;
    },
    isDisabled() {
      return !this.isEnabled;
    },
  },
  mounted() {
    if (!this.node.available) {
      return this.$download.check(this.node.channel_id, this.node.id)
        .then(this.updateDownloadState)
        .then(this.startPollingDownload);
    }
  },
  beforeDestroy() {
    this.clearDownloadCheckInterval();
  },
  methods: {
    updateDownloadState(state) {
      this.downloadState = state;
      return state;
    },
    startPollingDownload(state) {
      if (state === DownloadState.DOWNLOADING) {
        this.setDownloadCheckInterval();
      }
    },
    checkDownload() {
      return this.$download.check(this.node.channel_id, this.node.id)
        .then(this.updateDownloadState)
        .then((state) => {
          if (state !== DownloadState.DOWNLOADING) {
            this.clearDownloadCheckInterval();
          }
          if (state === DownloadState.COMPLETED) {
            this.$emit('nodeUpdated', this.node.id);
          }
        });
    },
    setDownloadCheckInterval() {
      if (this.downloadCheckIntervalId !== null) {
        return;
      }
      this.downloadCheckIntervalId = setInterval(this.checkDownload, DOWNLOAD_CHECK_DELAY);
    },
    clearDownloadCheckInterval() {
      if (this.downloadCheckIntervalId !== null) {
        clearInterval(this.downloadCheckIntervalId);
        this.downloadCheckIntervalId = null;
      }
    },
    onPlayButtonClick() {
      if (this.kind === 'bundle') {
        this.$router.push(this.url);
      } else {
        window.kolibri.navigateTo(this.node.id);
      }
    },
    onDownloadButtonClick() {
      if (this.downloadState === DownloadState.READY) {
        this.$download.start(this.node.channel_id, this.node.id)
          .then(this.updateDownloadState)
          .then(this.startPollingDownload);
      }
      else if (this.downloadState === DownloadState.FAILED) {
        this.$download.retry(this.node.channel_id, this.node.id)
          .then(this.updateDownloadState)
          .then(this.startPollingDownload);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles.scss';

.card {
  transition: all ease .4s;
  &:hover:not(.disabled) {
    color: $primary;
  }
  &.disabled {
    background: transparent;
    outline: solid 1px $gray-400;
    outline-offset: -1px;

    & > span {
      cursor: default;
    }
  }
}

// Move padding from card body to the single card text:
.card-body {
  padding: 0;
}

.body-wrapper {
  padding: $card-spacer-x;
}

.low-quality-img {
  padding: $card-spacer-x;
}

.card-img {
  border-radius: $border-radius-lg $border-radius-lg 0 0;
  background-size: cover;
  background-position: center;
  padding-top: percentage($card-image-ar);
  &.low-quality {
    background-size: auto calc(100% - #{$card-spacer-x});
    background-position: $card-spacer-x $card-spacer-x;
    background-repeat: no-repeat;
    &.is-thumbnail-wide {
      background-size: calc(100% - 2 * #{$card-spacer-x}) auto;
    };
  };
}

</style>
