<template>
  <b-container class="my-4">
    <b-row>

      <!-- Section buttons -->
      <b-col>
        <MainSections>
          <b-button
            class="font-weight-bold my-1 text-nowrap"
            size="sm"
            variant="link"
            to="/search"
          >
            <MagnifyIcon :size="iconSize" class="mr-1" />
            {{ $tr('searchKeywordsButton') }}
          </b-button>
        </MainSections>
      </b-col>

      <!-- Download button -->
      <b-col v-if="showDownloadButton" md="auto">
        <b-button
          pill
          class="font-weight-bold text-nowrap"
          variant="outline-dark"
          @click="downloadChannel()"
        >
          <CloudDownloadOutlineIcon :size="iconSize" class="mr-1" />
          {{ $tr('downloadFullChannelButton') }}
        </b-button>
      </b-col>

    </b-row>
  </b-container>
</template>

<script>
import CloudDownloadOutlineIcon from 'vue-material-design-icons/CloudDownloadOutline.vue';
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue';
import { constants } from 'ek-components';
import { mapState } from 'vuex';

export default {
  name: 'SectionsSearchRow',
  components: { CloudDownloadOutlineIcon, MagnifyIcon },
  computed: {
    ...mapState(['channel']),
    iconSize() {
      return constants.KeywordIconSize;
    },
    showDownloadButton() {
      // FIXME: re-enable later
      return this.channel.available && false;
    },
  },
  methods: {
    downloadChannel() {
      window.kolibri.downloadChannel();
    },
  },
  $trs: {
    searchKeywordsButton: {
      message: 'Search Keywords',
      context: 'Label for a button to search by keyword',
    },
    downloadFullChannelButton: {
      message: 'Download full channel',
      context: 'Label for a button to download a full channel',
    },
  },
};
</script>
