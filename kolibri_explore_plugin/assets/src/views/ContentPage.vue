<template>

  <KPageContainer>

    <PageHeader
      :title="content.title"
      :progress="progress"
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

    <!-- eslint-disable-next-line vue/no-v-html -->
    <p dir="auto" v-html="description"></p>


    <section class="metadata">
      <!-- TODO: RTL - Do not interpolate strings -->
      <p v-if="content.author">
        {{ $tr('author', { author: content.author }) }}
      </p>
      <p v-if="licenseShortName">
        {{ $tr('license', { license: licenseShortName }) }}

        <template v-if="licenseDescription">
          <KIconButton
            :icon="licenceDescriptionIsVisible ? 'chevronUp' : 'chevronDown'"
            :ariaLabel="$tr('toggleLicenseDescription')"
            size="small"
            type="secondary"
            @click="licenceDescriptionIsVisible = !licenceDescriptionIsVisible"
          />
          <div v-if="licenceDescriptionIsVisible" dir="auto" class="license-details">
            <p class="license-details-name">
              {{ licenseLongName }}
            </p>
            <p>{{ licenseDescription }}</p>
          </div>
        </template>
      </p>

      <p v-if="content.license_owner">
        {{ $tr('copyrightHolder', { copyrightHolder: content.license_owner }) }}
      </p>
    </section>

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

</template>


<script>

  import { mapState, mapGetters, mapActions } from 'vuex';
  import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';
  import DownloadButton from 'kolibri.coreVue.components.DownloadButton';
  import { isEmbeddedWebView } from 'kolibri.utils.browserInfo';
  import { shareFile } from 'kolibri.utils.appCapabilities';
  import markdownIt from 'markdown-it';
  import {
    licenseShortName,
    licenseLongName,
    licenseDescriptionForConsumer,
  } from 'kolibri.utils.licenseTranslations';
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
        licenceDescriptionIsVisible: false,
        sessionReady: false,
      };
    },
    computed: {
      ...mapGetters(['isUserLoggedIn', 'facilityConfig', 'currentUserId']),
      ...mapState('topicsTree', ['content', 'channel']),
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
        let supported_types = ['mp4', 'mp3', 'pdf', 'epub'];
        return shareFile && supported_types.includes(this.primaryFile.extension);
      },
      description() {
        if (this.content && this.content.description) {
          const md = new markdownIt({ breaks: true });
          return md.render(this.content.description);
        }
        return '';
      },
      progress() {
        if (this.isUserLoggedIn) {
          // if there no attempts for this exercise, there is no progress
          if (this.content.kind === ContentNodeKinds.EXERCISE && this.masteryAttempts === 0) {
            return undefined;
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
      licenseShortName() {
        return licenseShortName(this.content.license_name);
      },
      licenseLongName() {
        return licenseLongName(this.content.license_name);
      },
      licenseDescription() {
        return licenseDescriptionForConsumer(
          this.content.license_name,
          this.content.license_description
        );
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
        }).catch(() => {});
      },
    },
    $trs: {
      author: 'Author: {author}',
      license: 'License: {license}',
      toggleLicenseDescription: 'Toggle license description',
      copyrightHolder: 'Copyright holder: {copyrightHolder}',
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

  .metadata {
    font-size: smaller;
  }

  .download-button,
  .share-button {
    display: inline-block;
    margin: 16px 16px 0 0;
  }

  .license-details {
    margin-bottom: 24px;
    margin-left: 16px;
  }

  .license-details-name {
    font-weight: bold;
  }

</style>
