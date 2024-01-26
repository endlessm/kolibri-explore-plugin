<template>

  <WelcomeBase :title="$tr('packReadyTitle')">
    <template #body>
      <div class="pack-background"></div>
      <b-button
        pill
        class="mb-4 mt-4"
        :disabled="isDownloadRequired && isOffline"
        variant="primary"
        @click="downloadContent"
      >
        {{ $tr('downloadContentButton') }}
      </b-button>
      <p>
        <b-link
          :to="{ name: PageNames.WELCOME_PACK_SELECTION }"
        >
          {{ $tr('downloadContentBackButton') }}
        </b-link>
      </p>
    </template>
  </WelcomeBase>

</template>


<script>

  import { PageNames } from '../../constants';
  import isOfflineMixin from '../../mixins/isOfflineMixin';
  import { getCollectionInfo } from '../../modules/coreExplore/utils';
  import WelcomeBase from './WelcomeBase';

  export default {
    name: 'PackReadyPage',
    components: {
      WelcomeBase,
    },
    mixins: [isOfflineMixin],
    data() {
      return {
        PageNames,
        isDownloadRequired: true,
      };
    },
    mounted() {
      return getCollectionInfo(this.$route.params.name, this.$route.params.sequence).then(
        collectionsInfo => {
          this.isDownloadRequired = collectionsInfo.isDownloadRequired;
        }
      );
    },
    methods: {
      downloadContent() {
        const name = this.$route.params.name;
        const sequence = this.$route.params.sequence;
        this.$router.push({ name: PageNames.DOWNLOAD, params: { name, sequence } });
      },
    },
    $trs: {
      packReadyTitle: {
        message: 'Awesome! Your Starter Pack is ready',
        context:
          'Title heading for when the user has chosen a starter content pack and is about to download it',
      },
      downloadContentButton: {
        message: 'Download My Starter Pack',
        context: 'Button label for downloading a content pack',
      },
      downloadContentBackButton: {
        message: 'Not sure? Let’s go back to all the options.',
        context: 'Button label for going back and choosing a different starter content pack',
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../../styles';

  .pack-background {
    height: 170px;
    background-image: url('assets/pack.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    @include media-breakpoint-down(sm) {
      height: 120px;
    }
  }

</style>
