<template>

  <div class="lightbox-overlay" :style="getStyle()">
    <div class="lightbox">
      <div class="content-lightbox">
        <nav>
          <UiToolbar
            ref="toolbar"
            :showIcon="true"
          >
            <template #icon>
              <KIconButton
                icon="close"
                @click="$emit('close')"
              />
            </template>

            <div>
              {{ content.title }}
            </div>
          </UiToolbar>
        </nav>

        <main>
          <ContentItem :content="content" />
          <slot name="below_content"></slot>
        </main>
      </div>
    </div>
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import UiToolbar from 'kolibri.coreVue.components.UiToolbar';
  import ContentItem from './ContentItem';
  import commonExploreStrings from './commonExploreStrings';

  export default {
    name: 'ContentLightbox',
    components: {
      ContentItem,
      UiToolbar,
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
    background: rgba(0, 0, 0, 0.5);
  }

  .lightbox {
    /* Center in overlay */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .content-lightbox {
    z-index: inherit;
    width: 80%;
    max-height: calc(100vh - 80px);
    margin: 40px auto;
    overflow: hidden;
    background: white;
    border-radius: 4px;

    /deep/ .ui-toolbar {
      .ui-toolbar__nav-icon {
        margin-right: 0.5rem;
      }

      .ui-toolbar__body {
        margin-right: 1rem;
      }
    }

    main {
      padding: 1rem;
    }
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
