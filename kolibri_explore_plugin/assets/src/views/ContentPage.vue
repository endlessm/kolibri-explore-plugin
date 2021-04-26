<template>

  <div class="main-wrapper" :style="getStyle()">
    <div class="page-wrapper">

      <KPageContainer>
        <KIconButton
          icon="back"
          size="large"
          appearance="raised-button"
          @click="goBack()"
        />

        <PageHeader
          :title="content.title"
          dir="auto"
          :contentType="content.kind"
        />
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

        <div>

          <DownloadButton
            v-if="canDownload"
            :files="downloadableFiles"
            class="download-button"
          />

          <KButton
            v-if="canShare"
            :text="$tr('shareFile')"
            class="share-button"
            @click="launchIntent()"
          />

        </div>

        <slot name="below_content">
        </slot>

      </KPageContainer>

    </div>
  </div>

</template>


<script>

  import { mapState, mapGetters, mapActions } from 'vuex';
  import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';
  import DownloadButton from 'kolibri.coreVue.components.DownloadButton';
  import { isEmbeddedWebView } from 'kolibri.utils.browserInfo';
  import { shareFile } from 'kolibri.utils.appCapabilities';
  import { updateContentNodeProgress } from '../modules/coreExplore/utils';
  import PageHeader from './PageHeader';
  import commonExploreStrings from './commonExploreStrings';

  export default {
    name: 'ContentPage',
    metaInfo() {
      return {
        title: this.$tr('documentTitle', {
          contentTitle: this.content.title,
          channelTitle: this.channel.title,
        }),
      };
    },
    components: {
      PageHeader,
      DownloadButton,
    },
    mixins: [commonExploreStrings],
    data() {
      return {
        wasIncomplete: false,
        sessionReady: false,
      };
    },
    computed: {
      ...mapGetters(['isUserLoggedIn', 'facilityConfig', 'currentUserId']),
      ...mapState('topicsTree', ['content', 'channel', 'appMetadata']),
      ...mapState('topicsTree', {
        contentId: state => state.content.content_id,
        contentNodeId: state => state.content.id,
        channelId: state => state.content.channel_id,
      }),
      ...mapState({
        masteryAttempts: state => state.core.logging.mastery.totalattempts,
        summaryProgress: state => state.core.logging.summary.progress,
        summaryTimeSpent: state => state.core.logging.summary.time_spent,
        sessionProgress: state => state.core.logging.session.progress,
        extraFields: state => state.core.logging.summary.extra_fields,
        fullName: state => state.core.session.full_name,
      }),
      canDownload() {
        if (this.facilityConfig.show_download_button_in_learn && this.content) {
          return (
            this.downloadableFiles.length &&
            this.content.kind !== ContentNodeKinds.EXERCISE &&
            !isEmbeddedWebView
          );
        }
        return false;
      },
      canShare() {
        const supported_types = ['mp4', 'mp3', 'pdf', 'epub'];
        return shareFile && supported_types.includes(this.primaryFile.extension);
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
      downloadableFiles() {
        return this.content.files.filter(file => !file.preset.endsWith('thumbnail'));
      },
      primaryFile() {
        return this.content.files.filter(file => !file.preset.supplementary)[0];
      },
      primaryFilename() {
        return `${this.primaryFile.checksum}.${this.primaryFile.extension}`;
      },
    },
    created() {
      return this.initSessionAction({
        channelId: this.channelId,
        contentId: this.contentId,
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
          updateContentNodeProgress(this.channelId, this.contentNodeId, updatedProgressPercent)
        );
        this.$emit('updateProgress', progressPercent);
      },
      addProgress(progressPercent, forceSave = false) {
        this.addProgressAction({ progressPercent, forceSave }).then(updatedProgressPercent =>
          updateContentNodeProgress(this.channelId, this.contentNodeId, updatedProgressPercent)
        );
        this.$emit('addProgress', progressPercent);
      },
      updateContentState(contentState, forceSave = true) {
        this.updateContentNodeState({ contentState, forceSave });
      },
      launchIntent() {
        return shareFile({
          filename: this.primaryFilename,
          message: this.$tr('shareMessage', {
            title: this.content.title,
            topic: this.content.breadcrumbs.slice(-1)[0].title,
            copyrightHolder: this.content.license_owner,
          }),
        });
      },
      getStyle() {
        return {
          backgroundImage: this.appMetadata.contentBackgroundImage,
          backgroundColor: this.appMetadata.contentBackgroundColor,
        };
      },
      goBack() {
        if (window.history.length > 1) {
          this.$router.go(-1);
        }
      },
    },
    $trs: {
      shareMessage: '"{title}" (in "{topic}"), from {copyrightHolder}',
      documentTitle: '{ contentTitle } - { channelTitle }',
      shareFile: 'Share',
    },
  };

</script>


<style lang="scss" scoped>

  .content-renderer {
    // Needs to be one less than the ScrollingHeader's z-index of 4
    z-index: 3;
  }

  .download-button,
  .share-button {
    display: inline-block;
    margin: 16px 16px 0 0;
  }

  .main-wrapper {
    height: 100vh;
    background-size: cover;
  }

  .page-wrapper {
    max-width: 1000px;
    padding: 32px;
    margin-right: auto;
    margin-left: auto;
  }

</style>
