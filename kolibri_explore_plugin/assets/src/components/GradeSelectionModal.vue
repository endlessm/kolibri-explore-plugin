<template>

  <b-modal
    id="grade-selection-modal"
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
        Select grade range
      </h1>

      <b-card-group deck class="py-5">
        <WelcomeCard
          v-for="info in collectionsInfo"
          :key="info.grade"
          :title="info.grade"
          :text="info.metadata.title"
          :secondaryText="info.metadata.subtitle"
          :selected="selection === info.grade"
          @click="setSelection(info.grade)"
        >
          <img :src="images[info.grade]" width="100%">
        </WelcomeCard>
      </b-card-group>
      <div class="pb-3 pt-3">
        <b-button
          class="m-1"
          :disabled="selection === null"
          variant="primary"
          @click="onNext"
        >
          Next
        </b-button>
      </div>

    </b-container>
  </b-modal>

</template>


<script>

  import primaryImage from '../collections/primary-icons.png';
  import intermediateImage from '../collections/intermediate-icons.png';
  import secondaryImage from '../collections/secondary-icons.png';

  export default {
    name: 'GradeSelectionModal',
    emits: ['gradeSelected'],
    props: {
      collectionsInfo: {
        type: Array,
        default: null,
      },
    },
    data() {
      return {
        selection: null, // 'primary', 'intermediate', 'secondary'
        images: {
          primary: primaryImage,
          intermediate: intermediateImage,
          secondary: secondaryImage,
        },
      };
    },
    methods: {
      setSelection(selection) {
        this.selection = selection;
      },
      onNext() {
        this.$emit('gradeSelected', this.selection);
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

  .card-deck {
    @include media-breakpoint-down(md) {
      .card {
        flex: auto;
        margin-bottom: $card-deck-margin;
      }
    }
  }

</style>
