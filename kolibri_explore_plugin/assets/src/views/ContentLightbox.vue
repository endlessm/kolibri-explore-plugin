<template>

  <div class="lightbox-overlay" :style="getStyle()">
    <div class="content-lightbox" :style="getStyle()">
      <nav>
        <div class="lightbox-title">
          {{ content.title }}
        </div>
        <div class="lightbox-action">
          <KIconButton
            icon="close"
            :color="appMetadata.contentForegroundColor"
            @click="$emit('close')"
          />
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

  import { mapState } from 'vuex';
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
    computed: {
      ...mapState('topicsTree', ['appMetadata']),
    },
    methods: {
      getStyle() {
        return {
          backgroundImage: this.appMetadata.contentBackgroundImage,
          backgroundColor: this.appMetadata.contentBackgroundColor,
          color: this.appMetadata.contentForegroundColor,
        };
      },
    },
  };

</script>


<style lang="scss" scoped>

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
    background: rgba(0, 0, 0, 0.6);
  }

  .content-lightbox {
    /* Center in overlay */
    position: relative;
    top: 50%;
    display: flex;
    flex-direction: column;
    width: 85%;
    max-height: calc(100vh - 2rem);
    margin: 0 auto;
    border-radius: 8px;
    transform: translate(0, -50%);
  }

  nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0.5rem 0;

    .lightbox-title {
      flex-grow: 1;
      padding: 0 0.25rem;
      margin: 0 1rem;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .lightbox-action {
      flex-shrink: 0;
      margin: 0 0.5rem;
    }
  }

  main {
    margin: 0 1rem 1rem;
    overflow: hidden;
  }

  @media (max-width: 960px) {
    .content-lightbox {
      width: 90%;
    }
  }

  @media (max-width: 600px) {
    .content-lightbox {
      width: 100%;
      height: 100vh;
      max-height: 100vh;
      margin: 0;
      border-radius: 0;
    }
  }

</style>
