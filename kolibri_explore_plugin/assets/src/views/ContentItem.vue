<template>

  <div class="content-item" :class="{ 'content-item--dark': isDark }">
    <template v-if="sessionReady">
      <KContentRenderer
        v-if="!assessment"
        class="content-renderer"
        :class="{ 'without-fullscreen-bar': withoutFullscreenBar }"
        v-bind="contentProps"
        v-on="contentHandlers"
      />

      <AssessmentWrapper
        v-else
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

  import { mapState, mapGetters } from 'vuex';
  import { assessmentMetaDataState } from 'kolibri.coreVue.vuex.mappers';
  import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';
  import { setContentNodeProgress } from '../composables/useContentNodeProgress';
  import useProgressTracking from '../composables/useProgressTracking';
  import { GameAppIDs } from '../customApps';
  import AssessmentWrapper from './AssessmentWrapper';

  export default {
    name: 'ContentItem',
    components: {
      AssessmentWrapper,
    },
    setup() {
      const {
        progress,
        time_spent,
        extra_fields,
        pastattempts,
        complete,
        totalattempts,
        initContentSession,
        updateContentSession,
        startTrackingProgress,
        stopTrackingProgress,
      } = useProgressTracking();
      return {
        progress,
        time_spent,
        extra_fields,
        pastattempts,
        complete,
        totalattempts,
        initContentSession,
        updateContentSession,
        startTracking: startTrackingProgress,
        stopTracking: stopTrackingProgress,
      };
    },
    props: {
      contentNode: {
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
        fullName: state => state.core.session.full_name,
      }),
      withoutFullscreenBar() {
        return GameAppIDs.includes(this.contentNode.channel_id);
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
          updateInteraction: this.updateInteraction,
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
          extraFields: this.extra_fields,
          progress: this.progress,
          userId: this.currentUserId,
          userFullName: this.fullName,
          timeSpent: this.time_spent,
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
          extraFields: this.extra_fields,
          progress: this.progress,
          userId: this.currentUserId,
          userFullName: this.fullName,
          timeSpent: this.time_spent,
          pastattempts: this.pastattempts,
          mastered: this.complete,
          totalattempts: this.totalattempts,
        };
      },
      assessment() {
        if (this.contentNode.kind !== ContentNodeKinds.EXERCISE) {
          return null;
        } else {
          return assessmentMetaDataState(this.contentNode);
        }
      },
    },
    created() {
      return this.initContentSession({
        node: this.contentNode,
      }).then(() => {
        this.sessionReady = true;
        this.setWasIncomplete();
        // Set progress into the content node progress store in case it was not already loaded
        this.cacheProgress();
      });
    },
    methods: {
      setWasIncomplete() {
        this.wasIncomplete = this.progress < 1;
      },
      /*
       * Update the progress of the content node in the shared progress store
       * in the useContentNodeProgress composable. Do this to have a single
       * source of truth for referencing progress of content nodes.
       */
      cacheProgress() {
        setContentNodeProgress({ content_id: this.contentNode.id, progress: this.progress });
      },
      updateInteraction({ progress, interaction }) {
        this.updateContentSession({
          interaction,
          progress,
        }).then(this.cacheProgress);
      },
      updateProgress(progress) {
        this.updateContentSession({ progress }).then(this.cacheProgress);
      },
      addProgress(progressDelta) {
        this.updateContentSession({ progressDelta }).then(this.cacheProgress);
      },
      updateContentState(contentState) {
        this.updateContentSession({ contentState });
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .content-renderer {
    // Needs to be one less than the ScrollingHeader's z-index of 4
    z-index: 3;
  }

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
