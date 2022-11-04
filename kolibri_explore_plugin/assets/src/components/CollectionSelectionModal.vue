<template>

  <div>
    <b-modal
      id="collection-selection-modal"
      size="xl"
      centered
      :visible="true"
      :noCloseOnBackdrop="true"
      :noCloseOnEsc="true"
      :hideFooter="true"
      :hideHeaderClose="true"
    >
      <b-container>
        <h1 class="text-primary">
          {{ $tr('header') }}
        </h1>
        <h6 class="text-muted">
          {{ $tr('description') }}
        </h6>

        <b-card-group deck class="py-5">
          <WelcomeCard
            v-for="collection in gradeInfo.collections"
            :key="collection.metadata.title"
            :title="`${collection.grade} ${collection.metadata.subtitle}`"
            :text="`${collection.channelsCount} Channels`"
            :secondaryText="collection.metadata.description"
            :disabled="!collection.available"
            @click="$emit('nameSelected', collection.name)"
          >
            <b-button
              class="mt-3"
              variant="primary"
              :disabled="!collection.available"
            >
              {{ $tr('downloadAction') }}
              <strong>{{ collection.metadata.required_gigabytes }} GB</strong>
            </b-button>
          </WelcomeCard>
        </b-card-group>
        <div class="pb-3 pt-3">
          <b-button
            class="m-1"
            variant="link"
            @click="$emit('goBack')"
          >
            {{ coreString('backAction') }}
          </b-button>
        </div>

      </b-container>
    </b-modal>
  </div>

</template>


<script>

  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';

  export default {
    name: 'CollectionSelectionModal',
    emits: ['nameSelected', 'goBack'],
    mixins: [commonCoreStrings],
    props: {
      gradeInfo: {
        type: Object,
        default: null,
      },
    },
    $trs: {
      header: 'Choose your collection',
      description:
        'The small collection will give you just a taste of each channel and is' +
        ' recommended if you have limited free space on your computer.',
      downloadAction: 'Download',
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  ::v-deep .modal-content {
    color: black;
    text-align: center;
    background-color: white;
  }

  ::v-deep .card {
    background-color: white !important;
  }

</style>
