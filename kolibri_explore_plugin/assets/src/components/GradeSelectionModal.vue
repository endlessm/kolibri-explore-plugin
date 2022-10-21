<template>

  <div>
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

        <b-alert
          v-if="error"
          variant="danger"
          show
          fade
        >
          {{ error }}
        </b-alert>

        <b-card-group deck class="py-5">
          <WelcomeCard
            v-for="grade in grades"
            :key="grade.key"
            :title="grade.key"
            :text="grade.text"
            :secondaryText="grade.secondaryText"
            :selected="selection === grade.key"
            @click="setSelection(grade.key)"
          >
            <img :src="grade.image" width="100%">
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
  </div>

</template>


<script>

  import primaryImage from '../collections/primary-icons.png';
  import intermediateImage from '../collections/intermediate-icons.png';
  import secondaryImage from '../collections/secondary-icons.png';

  export default {
    name: 'GradeSelectionModal',
    emits: ['gradeSelected'],
    props: {
      error: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        selection: null, // 'primary', 'intermediate', 'secondary'
        grades: [
          {
            key: 'primary',
            text: 'for students ages 6-9',
            secondaryText: '(in grades K-3)',
            image: primaryImage,
          },
          {
            key: 'intermediate',
            text: 'for students ages 10-13',
            secondaryText: '(in grades 4-7)',
            image: intermediateImage,
          },
          {
            key: 'secondary',
            text: ' for students ages 14+',
            secondaryText: '(in grades 8+)',
            image: secondaryImage,
          },
        ],
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
