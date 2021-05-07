<template>

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
      <ContentItem :contentNode="content" />
      <slot name="below_content"></slot>
    </main>
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
    computed: {
      ...mapState('topicsTree', ['content']),
    },
  };

</script>


<style lang="scss" scoped>

  /* Borrowed from ContentModal in kolibri */

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
