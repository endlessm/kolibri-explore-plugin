<template>

  <div>
    <template v-if="sessionReady">
      <KContentRenderer
        class="content-renderer"
        :kind="contentNode.kind"
        :lang="contentNode.lang"
        :files="contentNode.files"
        :options="contentNode.options"
        :available="contentNode.available"
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
    </template>
    <KCircularLoader v-else />

  </div>

</template>


<script>

  import { mapState, mapGetters, mapActions } from 'vuex';
  import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';
  import { updateContentNodeProgress } from '../modules/coreExplore/utils';
  import commonExploreStrings from './commonExploreStrings';

  export default {
    name: 'ContentItem',
    components: {},
    mixins: [commonExploreStrings],
    props: {
      contentNode: {
        type: Object,
        required: true,
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
      progress() {
        if (this.isUserLoggedIn) {
          // if there no attempts for this exercise, there is no progress
          if (this.contentNode.kind === ContentNodeKinds.EXERCISE && this.masteryAttempts === 0) {
            return null;
          }
          return this.summaryProgress;
        }
        return this.sessionProgress;
      },
    },
    created() {
      return this.initSessionAction({
        channelId: this.contentNode.channel_id,
        contentId: this.contentNode.content_id,
        contentKind: this.contentNode.kind,
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
            this.contentNode.channel_id,
            this.contentNode.id,
            updatedProgressPercent
          )
        );
        this.$emit('updateProgress', progressPercent);
      },
      addProgress(progressPercent, forceSave = false) {
        this.addProgressAction({ progressPercent, forceSave }).then(updatedProgressPercent =>
          updateContentNodeProgress(
            this.contentNode.channel_id,
            this.contentNode.id,
            updatedProgressPercent
          )
        );
        this.$emit('addProgress', progressPercent);
      },
      updateContentState(contentState, forceSave = true) {
        this.updateContentNodeState({ contentState, forceSave });
      },
    },
  };

</script>
