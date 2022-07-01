<template>

  <div>
    <b-modal
      id="grade-selection-modal"
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
          Select grade range
        </h1>
        <h6 class="text-muted">
          The Endless Key download for ChromeOS contains a sample of the
          content available on the full Endless Key. The content is available
          in three selections:
        </h6>

        <b-card-group deck class="py-5">
          <b-card
            v-for="grade in grades"
            :key="grade.key"
            :title="grade.key"
            :borderVariant="selection === grade.key ? 'primary' : 'default'"
            titleTag="h6"
            subTitleTag="h4"
            class="welcome-card"
          >
            <!-- eslint-disable vue/no-v-html -->
            <p class="text-muted" v-html="grade.text"></p>
            <img :src="grade.image" width="100%">

            <b-link
              href="#"
              class="stretched-link"
              @click="setSelection(grade.key)"
            />
            <span
              v-if="selection === grade.key"
              class="icon-wrapper text-primary"
            >
              <CheckCircleIcon />
            </span>
          </b-card>
        </b-card-group>
        <div class="pb-3 pt-5">
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
  import CheckCircleIcon from 'vue-material-design-icons/CheckCircle.vue';
  import primaryImage from '../assets/collections/primary-icons.png';
  import intermediateImage from '../assets/collections/intermediate-icons.png';
  import secondaryImage from '../assets/collections/secondary-icons.png';

  export default {
    name: 'GradeSelectionModal',
    components: { CheckCircleIcon },
    emits: ['gradeSelected'],
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        selection: null, // 'primary', 'intermediate', 'secondary'
        grades: [
          {
            key: 'primary',
            text: 'for students ages 6-9<br/>(in grades K-3)',
            image: primaryImage,
          },
          {
            key: 'intermediate',
            text: 'for students ages 10-13<br/>(in grades 4-7)',
            image: intermediateImage,
          },
          {
            key: 'secondary',
            text: ' for students ages 14+<br/>(in grades 8+)',
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

  .welcome-card .card-title {
    text-transform: capitalize;
  }

</style>
