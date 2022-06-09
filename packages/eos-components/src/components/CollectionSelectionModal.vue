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
          Download Choice
        </h1>
        <h6 class="text-muted">
          Choose a collection size to download
        </h6>

        <b-card-group deck class="py-5">
          <b-card
            v-for="collection in collections"
            :key="collection.title"
            :title="collection.title"
            :subTitle="collection.subtitle"
            titleTag="h6"
            subTitleTag="h4"
            borderVariant="primary"
          >
            <p class="text-muted">
              {{ collection.channels }} Channels
              <br>
              {{ collection.text }}
            </p>

            <b-button
              class="mt-3"
              pill
              variant="primary"
              @click="$emit('downloadCollection', collection)"
            >
              <DownloadIcon />
              Download
            </b-button>
          </b-card>
        </b-card-group>

      </b-container>
    </b-modal>
  </div>

</template>


<script>

  import DownloadIcon from 'vue-material-design-icons/DownloadOutline.vue';

  export default {
    name: 'CollectionSelectionModal',
    components: {
      DownloadIcon,
    },
    emits: ['downloadCollection'],
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        collections: [
          {
            title: '3Gb',
            subtitle: 'Small',
            channels: 10,
            text: 'Short Description to be defined',
          },
          {
            title: '6Gb',
            subtitle: 'Medium',
            channels: 10,
            text: 'Short Description to be defined',
          },
          {
            title: '12Gb',
            subtitle: 'Large',
            channels: 10,
            text: 'Short Description to be defined',
          },
        ],
      };
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

  .card {
    border: 1px solid;
    border-radius: $border-radius-lg;
  }

  ::v-deep .card-subtitle {
    font-weight: bold;
    color: black !important;
  }

</style>
