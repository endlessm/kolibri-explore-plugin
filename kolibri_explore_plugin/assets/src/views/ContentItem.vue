<template>

  <div>
    <template v-if="sessionReady">
      <KContentRenderer
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
      content: {
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
      updateContentState(contentState, forceSave = true) {
        this.updateContentNodeState({ contentState, forceSave });
      },
    },
  };

</script>
