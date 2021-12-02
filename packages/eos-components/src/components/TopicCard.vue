<template>
  <b-card
    noBody
    class="my-2 rounded-lg"
    :class="{
      'shadow-sm': !isHovered,
      'shadow': isHovered,
    }"
  >
    <ContentLink :url="url" @isHovered="(hovered) => isHovered = hovered">
      <b-card-body class="bg-primary">
        <div
          class="card-img"
          :class="{ 'low-quality': isLowQuality, 'is-thumbnail-wide': isThumbnailWide }"
          :style="cardStyle"
        >
          <span class="sr-only">{{ node.title }}</span>
        </div>
        <div class="body-wrapper">
          <div class="card-content">
            <b-card-title titleTag="h5" class="mb-1">
              <VClamp
                autoresize
                :maxLines="titleMaxLines"
              >
                {{ node.title }}
              </VClamp>
            </b-card-title>
            <b-card-text>
              <VClamp
                autoresize
                :maxLines="descriptionMaxLines"
              >
                {{ node.description }}
              </VClamp>
            </b-card-text>
          </div>
          <b-card-text class="my-1">
            <div v-if="showChannelIcon" class="align-items-center d-flex">
              <ChannelLogo class="mr-2" :channel="node.channel" size="sm" />
              <span class="channel-title subtitle text-truncate">{{ node.channel.title }}</span>
            </div>
            <div v-else>
              <ImageFilterNoneIcon />
              <!-- FIXME: Show the number of resources in the Topic when it's
                  possible. This is commented right now because it's always
                  '0 resources'.

                  Right now this information is not in the node and the only
                  way to get this information is doing a new query to the
                  backend, that could be a performance issue.

              <span class="ml-2 subtitle">
                {{ subtitle }}
              </span>
              -->
            </div>
          </b-card-text>
        </div>
      </b-card-body>
    </ContentLink>
  </b-card>
</template>

<script>
import VClamp from 'vue-clamp';
import ImageFilterNoneIcon from 'vue-material-design-icons/ImageFilterNone.vue';
import { MediaQuality } from '../constants';
import cardMixin from './mixins/cardMixin.js';

export default {
  name: 'TopicCard',
  components: {
    ImageFilterNoneIcon,
    VClamp,
  },
  mixins: [cardMixin],
  props: {
    node: {
      type: Object,
      required: true,
    },
    /** FIXME: bring back the subtitle property when we've useful information
        to show
    subtitle: {
      type: String,
      default: '',
    },
    **/
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
      descriptionMaxLines: 3,
    };
  },
  computed: {
    isLowQuality() {
      return this.mediaQuality === MediaQuality.LOW;
    },
    cardStyle() {
      return {
        backgroundImage: `url("${this.thumbnail}")`,
      };
    },
    titleMaxLines() {
      if (!this.node.description) {
        return 5;
      }
      return 2;
    },
    showChannelIcon() {
      return this.node.channel;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles.scss';

.card {
  @include transition($btn-transition);
}

.card-body {
  border-radius: $border-radius-lg;
  justify-content: space-between;
}

.card-title, .card-text {
  color: $white;
}

.card-text {
  flex-grow: 3;
}

// Move padding from card body to the single card text:
.card-body {
  padding: 0;
}

// This is solely to match the content card height:
$missing-height: 2px;

.body-wrapper {
  padding: $card-spacer-x;
}
.card-content {
  height: calc(#{card-body-height(2)} - #{$missing-height});
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

.subtitle {
  font-family: $btn-font-family;
  font-size: $btn-font-size;
  font-weight: $btn-font-weight;
}

</style>
