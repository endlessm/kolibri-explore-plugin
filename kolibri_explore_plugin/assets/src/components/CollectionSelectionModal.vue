<template>

  <div>
    <b-modal
      id="collection-selection-modal"
      size="xl"
      centered
      :visible="visible"
      :noCloseOnBackdrop="true"
      :noCloseOnEsc="true"
      :hideFooter="true"
      :hideHeaderClose="true"
    >
      <b-container>
        <h1 class="text-primary">
          Choose your collection
        </h1>
        <h6 class="text-muted">
          The small collection will give you just a taste of each channel and is
          recommended if you have limited free space on your computer.
        </h6>

        <b-card-group deck class="py-5">
          <WelcomeCard
            v-for="collection in collections"
            :key="collection.title"
            :title="`${grade} ${collection.subtitle}`"
            :text="`${collection.channels} Channels`"
            :secondaryText="collection.text"
            :disabled="!collection.available"
            @click="$emit('downloadCollection', grade, collection)"
          >
            <b-button
              class="mt-3"
              variant="primary"
              :disabled="!collection.available"
            >
              Download <strong>{{ collection.size }} GB</strong>
            </b-button>
          </WelcomeCard>
        </b-card-group>
        <div class="pb-3 pt-3">
          <b-button
            class="m-1"
            variant="link"
            @click="$emit('goBack')"
          >
            Back
          </b-button>
        </div>

      </b-container>
    </b-modal>
  </div>

</template>


<script>

  export default {
    name: 'CollectionSelectionModal',
    emits: ['downloadCollection', 'goBack'],
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      collections: {
        type: Array,
        default: () => {
          return [
            {
              title: '3 GB',
              subtitle: 'Small',
              channels: 10,
              text: 'Short Description to be defined',
            },
          ];
        },
      },
      grade: {
        type: String,
        default: 'intermediate',
      },
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
