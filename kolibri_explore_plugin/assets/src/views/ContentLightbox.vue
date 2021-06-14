<template>

  <div ref="overlay" class="lightbox-overlay" @click="onOverlayClick($event)">
    <div id="lightbox" class="content-lightbox">
      <nav>
        <div class="lightbox-title">
          {{ content.title }}
        </div>
        <div class="lightbox-action">
          <button type="button" class="close" aria-label="Close" @click="$emit('close')">
            <b-icon-x />
          </button>
        </div>
      </nav>

      <main>
        <ContentItem :content="content" />
        <slot name="below_content"></slot>
      </main>
    </div>
  </div>

</template>


<script>

  import ContentItem from './ContentItem';
  import commonExploreStrings from './commonExploreStrings';

  export default {
    name: 'ContentLightbox',
    components: {
      ContentItem,
    },
    mixins: [commonExploreStrings],
    props: {
      content: {
        type: Object,
        required: true,
      },
    },
    methods: {
      onOverlayClick(event) {
        if (event.target === this.$refs.overlay) {
          this.$emit('close');
        }
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .close {
    color: $white;
    &:hover {
      color: $white;
    }
  }

  .lightbox-overlay {
    /* Overlay everything */
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    /* Above the sidenav */
    z-index: 16;

    /* With a semi transparent background */
    background: rgba($black, 0.6);
  }

  .content-lightbox {
    /* Center in overlay */
    position: relative;
    top: 50%;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100vh;
    max-height: 100vh;
    margin: 0 auto;
    background-color: $dark;
    border-radius: $border-radius-lg;
    transform: translate(0, -50%);
  }

  nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: #{$spacer / 2} 0;
    color: $white;

    .lightbox-title {
      flex-grow: 1;
      margin: 0 $spacer;
    }

    .lightbox-action {
      flex-shrink: 0;
      margin: 0 #{$spacer / 2};
    }
  }

  main {
    margin: 0 $spacer $spacer;
    overflow: hidden;
  }

  @media (max-width: map-get($grid-breakpoints, md)) {
    .content-lightbox {
      max-width: 100vw;
      height: 100%;
      margin: 0;
      border-radius: 0;
    }
  }

</style>
