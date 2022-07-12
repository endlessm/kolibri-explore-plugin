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
  import primaryImage from '../assets/collections/primary-icons.png';
  import intermediateImage from '../assets/collections/intermediate-icons.png';
  import secondaryImage from '../assets/collections/secondary-icons.png';

  export default {
    name: 'GradeSelectionModal',
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

  let osname = 'ChromeOS';
  if (navigator.appVersion.indexOf("Win") != -1) {
    osname = 'Windows';
  } else if (navigator.appVersion.indexOf("Mac") != -1) {
    osname = 'MacOS';
  } else if (navigator.appVersion.indexOf("CrOS") != -1) {
    osname = 'ChromeOS';
  } else if (navigator.appVersion.indexOf("Linux") != -1 ) {
    osname = 'Linux';
  };

  let h6 = document.getElementsByTagName('h6')[0];
  if (h6) {
    h6.innerHTML = `The Endless Key download for ${osname} contains a sample of `
                  +"the content available on the full Endless Key. The content "
                  +"is available in three selections:";
  };
</script>


<style lang="scss" scoped>

  @import '../styles';

  ::v-deep .modal-content {
    color: black;
    text-align: center;
    background-color: white;
  }

</style>
