<template>

  <router-link
    :to="link"
    class="card"
    :class="[
      { 'mobile-card': isMobile },
      $computedClass({ ':focus': $coreOutline })
    ]"
    :style="{ backgroundColor: $themeTokens.surface }"
  >
    <CardThumbnail
      class="thumbnail"
      v-bind="{ thumbnail, progress, kind, isMobile, showContentIcon }"
    />
    <div class="text" :style="{ color: $themeTokens.text }">
      <h3 class="title" dir="auto">
        <TextTruncator
          :text="title"
          :maxHeight="maxTitleHeight"
        />
      </h3>
      <p
        v-if="subtitle"
        dir="auto"
        class="subtitle"
        :class="{ 'no-footer': !hasFooter }"
      >
        {{ subtitle }}
      </p>
      <div class="footer">
      </div>
    </div>
  </router-link>

</template>


<script>

  import { validateLinkObject, validateContentNodeKind } from 'kolibri.utils.validators';
  import TextTruncator from 'kolibri.coreVue.components.TextTruncator';
  import CardThumbnail from './CardThumbnail';

  export default {
    name: 'ContentCard',
    components: {
      CardThumbnail,
      TextTruncator,
    },
    props: {
      title: {
        type: String,
        required: true,
      },
      subtitle: {
        type: String,
        required: false,
      },
      thumbnail: {
        type: String,
        required: false,
      },
      kind: {
        type: String,
        required: true,
        validator: validateContentNodeKind,
      },
      showContentIcon: {
        type: Boolean,
        default: true,
      },
      progress: {
        type: Number,
        required: false,
        default: 0.0,
        validator(value) {
          return value >= 0.0 && value <= 1.0;
        },
      },
      link: {
        type: Object,
        required: true,
        validator: validateLinkObject,
      },
      isMobile: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      maxTitleHeight() {
        if (this.hasFooter && this.subtitle) {
          return 20;
        } else if (this.hasFooter || this.subtitle) {
          return 40;
        }
        return 60;
      },
      hasFooter() {
        return false;
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '~kolibri-design-system/lib/styles/definitions';
  @import './card';

  $margin: 16px;

  .card {
    @extend %dropshadow-1dp;

    display: inline-block;
    width: $thumb-width-desktop;
    text-decoration: none;
    vertical-align: top;
    border-radius: 2px;
    transition: box-shadow $core-time ease;
    &:hover {
      @extend %dropshadow-8dp;
    }
    &:focus {
      outline-width: 4px;
      outline-offset: 6px;
    }
  }

  .text {
    position: relative;
    height: 92px;
    padding: $margin;
  }

  .title,
  .subtitle {
    margin: 0;
  }

  .subtitle {
    position: absolute;
    top: 38px;
    right: $margin;
    left: $margin;
    overflow: hidden;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .footer {
    position: absolute;
    right: $margin;
    bottom: $margin;
    left: $margin;
    font-size: 12px;
  }

  .subtitle.no-footer {
    top: unset;
    bottom: $margin;
  }

  .mobile-card.card {
    width: 100%;
    height: $thumb-height-mobile;
  }

  .mobile-card {
    .thumbnail {
      position: absolute;
    }
    .text {
      height: 84px;
      margin-left: $thumb-width-mobile;
    }
    .subtitle {
      top: 36px;
    }
  }

</style>
