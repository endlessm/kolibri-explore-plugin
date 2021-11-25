<template>

  <div class="content-item" :class="{ 'content-item--dark': isDark }">
    <template v-if="sessionReady">
      <KContentRenderer
        v-if="!content.assessment"
        class="content-renderer"
        :class="{ 'without-fullscreen-bar': withoutFullscreenBar }"
        v-bind="contentProps"
        v-on="contentHandlers"
      />

      <AssessmentWrapper
        v-else
        :id="content.id"
        class="content-renderer"
        :class="{ 'without-fullscreen-bar': withoutFullscreenBar }"
        v-bind="exerciseProps"
        v-on="contentHandlers"
      />
    </template>
    <div v-else class="text-center">
      <b-spinner />
    </div>

  </div>

</template>


<script>

  import { mapState, mapGetters, mapActions } from 'vuex';
  import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';
  import { assessmentMetaDataState } from 'kolibri.coreVue.vuex.mappers';
  import { updateContentNodeProgress } from '../modules/coreExplore/utils';
  import { GameAppIDs } from '../customApps';
  import AssessmentWrapper from './AssessmentWrapper';
  import commonExploreStrings from './commonExploreStrings';

  export default {
    name: 'ContentItem',
    components: {
      AssessmentWrapper,
    },
    mixins: [commonExploreStrings],
    props: {
      content: {
        type: Object,
        required: true,
      },
      isDark: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        wasIncomplete: false,
        sessionReady: false,
      };
    },
    computed: {
      ...mapGetters(['currentUserId']),
      ...mapState({
        progress: state => state.core.logging.progress,
        timeSpent: state => state.core.logging.time_spent,
        extraFields: state => state.core.logging.extra_fields,
        fullName: state => state.core.session.full_name,
      }),
      withoutFullscreenBar() {
        return GameAppIDs.includes(this.content.channel_id);
      },
      contentNode() {
        return this.content;
      },
      contentIsExercise() {
        return this.contentNode.kind === ContentNodeKinds.EXERCISE;
      },
      contentHandlers() {
        return {
          startTracking: this.startTracking,
          stopTracking: this.stopTracking,
          updateProgress: this.updateProgress,
          addProgress: this.addProgress,
          updateContentState: this.updateContentState,
        };
      },
      contentProps() {
        if (this.contentIsExercise) {
          return {};
        }
        return {
          kind: this.contentNode.kind,
          lang: this.contentNode.lang,
          files: this.contentNode.files,
          options: this.contentNode.options,
          available: this.contentNode.available,
          extraFields: this.extraFields,
          progress: this.progress,
          userId: this.currentUserId,
          userFullName: this.fullName,
          timeSpent: this.timeSpent,
        };
      },
      exerciseProps() {
        if (!this.contentIsExercise) {
          return {};
        }
        const assessment = assessmentMetaDataState(this.contentNode);
        return {
          kind: this.contentNode.kind,
          files: this.contentNode.files,
          lang: this.contentNode.lang,
          randomize: this.contentNode.randomize,
          masteryModel: assessment.masteryModel,
          assessmentIds: assessment.assessmentIds,
          available: this.contentNode.available,
          extraFields: this.extraFields,
          progress: this.progress,
          userId: this.currentUserId,
          userFullName: this.fullName,
          timeSpent: this.timeSpent,
        };
      },
    },
    created() {
      return this.initSessionAction({
        nodeId: this.content.id,
      }).then(() => {
        this.sessionReady = true;
        this.setWasIncomplete();
      });
    },

    beforeDestroy() {
      this.stopTracking();
    },
    methods: {
      ...mapActions({
        initSessionAction: 'initContentSession',
        updateContentSession: 'updateContentSession',
        startTracking: 'startTrackingProgress',
        stopTracking: 'stopTrackingProgress',
      }),
      setWasIncomplete() {
        this.wasIncomplete = this.progress < 1;
      },
      updateProgress(progress) {
        this.updateContentSession({ progress }).then(() =>
          updateContentNodeProgress(this.content.id, this.progress)
        );
        this.$emit('updateProgress', this.progress);
      },
      addProgress(progressDelta) {
        this.updateContentSession({ progressDelta }).then(() =>
          updateContentNodeProgress(this.content.id, this.progress)
        );
        this.$emit('addProgress', this.progress);
      },
      updateContentState(contentState) {
        this.updateContentSession({ contentState });
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  // Fix icon offset in the Kolibri plugins:
  .content-renderer::v-deep .button img,
  .content-renderer::v-deep .button svg {
    vertical-align: baseline;
  }

  .content-renderer.without-fullscreen-bar::v-deep .fullscreen-header {
    display: none;
  }

  // Tweak fullscreen icons to look nicer here
  .content-renderer::v-deep .fullscreen-header {
    .fullscreen-button svg,
    .button .fs-icon {
      top: 5px;
      width: 20px;
      height: 20px;
    }
  }

  .content-item--dark::v-deep .content-renderer .fullscreen-header {
    color: $gray-300 !important;
    background-color: $lightbox-toolbar !important;

    .button {
      color: $gray-300 !important;

      &.zim-search-button {
        background-color: $lightbox-toolbar-primary !important;
      }

      &:hover {
        background-color: lighten($lightbox-toolbar, 10%) !important;
      }

      svg {
        fill: $gray-300 !important;
      }
    }

    .ui-icon-button {
      color: $gray-300;
      background: none;

      &:hover {
        background-color: lighten($lightbox-toolbar, 10%) !important;
      }

      svg {
        fill: $gray-300;
      }
    }
  }

</style>
