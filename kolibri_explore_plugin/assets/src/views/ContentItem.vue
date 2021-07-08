<template>

  <div :class="contentItemClass">
    <template v-if="sessionReady">
      <KContentRenderer
        v-if="!content.assessment"
        class="content-renderer"
        :kind="content.kind"
        :lang="content.lang"
        :files="content.files"
        :options="content.options"
        :available="content.available"
        :extraFields="extraFields"
        :progress="summaryProgress"
        :userId="currentUserId"
        :userFullName="fullName"
        :timeSpent="summaryTimeSpent"
        @startTracking="startTracking"
        @stopTracking="stopTracking"
        @updateProgress="updateProgress"
        @addProgress="addProgress"
        @updateContentState="updateContentState"
      />

      <AssessmentWrapper
        v-else
        :id="content.id"
        class="content-renderer"
        :kind="content.kind"
        :files="content.files"
        :lang="content.lang"
        :randomize="content.randomize"
        :masteryModel="content.masteryModel"
        :assessmentIds="content.assessmentIds"
        :channelId="channelId"
        :available="content.available"
        :extraFields="extraFields"
        :progress="summaryProgress"
        :userId="currentUserId"
        :userFullName="fullName"
        :timeSpent="summaryTimeSpent"
        @startTracking="startTracking"
        @stopTracking="stopTracking"
        @updateProgress="updateExerciseProgress"
        @updateContentState="updateContentState"
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
  import { updateContentNodeProgress } from '../modules/coreExplore/utils';
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
      dark: {
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
      ...mapGetters(['isUserLoggedIn', 'currentUserId']),
      ...mapState({
        masteryAttempts: state => state.core.logging.mastery.totalattempts,
        summaryProgress: state => state.core.logging.summary.progress,
        summaryTimeSpent: state => state.core.logging.summary.time_spent,
        sessionProgress: state => state.core.logging.session.progress,
        extraFields: state => state.core.logging.summary.extra_fields,
        fullName: state => state.core.session.full_name,
      }),
      contentItemClass() {
        const classNames = ['content-item'];
        if (this.dark) {
          classNames.push('content-item--dark');
        }
        return classNames;
      },
      progress() {
        if (this.isUserLoggedIn) {
          // if there no attempts for this exercise, there is no progress
          if (this.content.kind === ContentNodeKinds.EXERCISE && this.masteryAttempts === 0) {
            return null;
          }
          return this.summaryProgress;
        }
        return this.sessionProgress;
      },
    },
    created() {
      return this.initSessionAction({
        channelId: this.content.channel_id,
        contentId: this.content.content_id,
        contentKind: this.content.kind,
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
        updateProgressAction: 'updateProgress',
        addProgressAction: 'addProgress',
        startTracking: 'startTrackingProgress',
        stopTracking: 'stopTrackingProgress',
        updateContentNodeState: 'updateContentState',
      }),
      setWasIncomplete() {
        this.wasIncomplete = this.progress < 1;
      },
      updateProgress(progressPercent, forceSave = false) {
        this.updateProgressAction({ progressPercent, forceSave }).then(updatedProgressPercent =>
          updateContentNodeProgress(
            this.content.channel_id,
            this.content.id,
            updatedProgressPercent
          )
        );
        this.$emit('updateProgress', progressPercent);
      },
      addProgress(progressPercent, forceSave = false) {
        this.addProgressAction({ progressPercent, forceSave }).then(updatedProgressPercent =>
          updateContentNodeProgress(
            this.content.channel_id,
            this.content.id,
            updatedProgressPercent
          )
        );
        this.$emit('addProgress', progressPercent);
      },
      updateExerciseProgress(progressPercent) {
        this.$emit('updateProgress', progressPercent);
      },
      updateContentState(contentState, forceSave = true) {
        this.updateContentNodeState({ contentState, forceSave });
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

  .content-item--dark::v-deep .content-renderer .fullscreen-header {
    color: $gray-300;
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
  }

</style>
