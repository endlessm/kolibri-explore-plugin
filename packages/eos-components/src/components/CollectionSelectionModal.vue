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
          Now, select the amount of content you would like to download. The
          small collection will give you just a taste of each channel and is
          recommended if you have limited free space on your computer.
        </h6>

        <b-card-group deck class="py-5">
          <b-card
            v-for="collection in collections"
            :key="collection.title"
            :title="`${grade} ${collection.subtitle}`"
            :class="{ disabled: !collection.available }"
            titleTag="h6"
            subTitleTag="h4"
            class="welcome-card"
          >
            <p class="text-muted">
              {{ collection.channels }} Channels
              <br>
              {{ collection.text }}
            </p>

            <b-button
              class="mt-3"
              variant="primary"
              :disabled="!collection.available"
              @click="$emit('downloadCollection', collection)"
            >
              Download <strong>{{ collection.size }}Gb</strong>
            </b-button>
          </b-card>
        </b-card-group>
        <div class="pb-3 pt-5">
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
              title: '3Gb',
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

  .welcome-card {
    background-color: white;
  }

</style>
