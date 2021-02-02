<template>

  <router-link
    :to="link"
    class="card-main-wrapper"
    :style="cardStyle"
    :class="$computedClass({ ':focus': $coreOutline })"
  >

    <div class="overlay">
    </div>

    <ProgressIcon
      v-if="progress > 0"
      class="progress-icon"
      :progress="progress"
    />

    <div v-if="thumbnail" class="thumbnail" :style="thumbStyle"></div>

    <div class="card-content">
      <h3
        class="title"
        dir="auto"
        :style="{ borderBottom: `1px solid ${$themeTokens.fineLine}` }"
      >
        {{ title }}
      </h3>
      <TextTruncator
        :text="tagline"
        :maxHeight="taglineHeight"
        :showTooltip="false"
      />

    </div>

  </router-link>

</template>


<script>

  import { validateLinkObject } from 'kolibri.utils.validators';
  import responsiveWindowMixin from 'kolibri.coreVue.mixins.responsiveWindowMixin';
  import TextTruncator from 'kolibri.coreVue.components.TextTruncator';
  import ProgressIcon from 'kolibri.coreVue.components.ProgressIcon';

  export default {
    name: 'ChannelCard',
    components: {
      TextTruncator,
      ProgressIcon,
    },
    mixins: [responsiveWindowMixin],
    props: {
      title: {
        type: String,
        required: true,
      },
      backgroundImage: {
        type: String,
        required: true,
      },
      thumbnail: {
        type: String,
        default: '',
      },
      tagline: {
        type: String,
        required: false,
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
    },
    computed: {
      overallHeight() {
        return 300;
      },
      cardStyle() {
        return {
          backgroundImage: this.backgroundImage,
          color: 'white',
          marginBottom: `${this.windowGutter}px`,
          minHeight: `${this.overallHeight}px`,
        };
      },
      thumbStyle() {
        return {
          backgroundImage: `url(${this.thumbnail})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right',
          width: '210px',
          height: '92px',
          margin: '10px',
        };
      },
      taglineHeight() {
        return 165;
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '~kolibri-design-system/lib/styles/definitions';
  @import './ContentCard/card';

  $margin: 16px;

  .card-main-wrapper {
    @extend %dropshadow-1dp;

    position: relative;
    display: inline-block;
    width: 400px;
    padding-bottom: $margin;
    text-decoration: none;
    vertical-align: top;
    background-size: cover;
    transition: box-shadow $core-time ease;
    transition: transform $core-time ease;
    &:hover {
      @extend %dropshadow-8dp;

      transform: scale(1.01);
    }
    &:focus {
      outline-width: 4px;
      outline-offset: 6px;
    }
  }

  .title {
    padding: 0 48px $margin $margin;
    border-bottom: 2px solid #cecece;
  }

  .progress-icon {
    position: absolute;
    top: 12px;
    right: $margin;
  }

  /deep/.card-thumbnail-wrapper {
    max-width: 100%;
  }

  $position: relative;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to top, black, transparent 50%);
  }

  .overlay:hover {
    background-image: linear-gradient(to top, black, transparent 80%);
  }

  .card-content {
    position: absolute;
    bottom: 10px;
    left: 10px;
  }

  h3.title {
    padding-left: 0;
  }

  .thumbnail {
    position: absolute;
    top: 0;
    right: 0;
  }

</style>
