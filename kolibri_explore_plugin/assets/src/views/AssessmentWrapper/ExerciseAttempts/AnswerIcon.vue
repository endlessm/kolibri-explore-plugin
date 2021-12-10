<template>

  <div>
    <div ref="icon" class="icon">
      <span
        v-if="answer === 'right'"
        v-b-tooltip:hover.right
        class="text-success"
        :title="tooltipText"
      >
        <b-icon-check-circle-fill />
      </span>
      <span
        v-else-if="answer === 'wrong'"
        v-b-tooltip:hover.right
        :title="tooltipText"
      >
        <b-icon-x />
      </span>
      <span
        v-else-if="answer === 'hint'"
        v-b-tooltip:hover.right
        :title="tooltipText"
      >
        <b-icon-info-circle-fill />
      </span>
      <span
        v-else-if="answer === 'rectified'"
        v-b-tooltip:hover.right
        :title="tooltipText"
      >
        <b-icon-record-fill />
      </span>
    </div>
  </div>

</template>


<script>

  export default {
    name: 'AnswerIcon',
    props: {
      answer: {
        type: String,
        required: true,
        validator(val) {
          return ['right', 'wrong', 'hint', 'rectified'].includes(val);
        },
      },
    },
    computed: {
      tooltipText() {
        switch (this.answer) {
          case 'right':
            return this.$tr('correct');
          case 'wrong':
            return this.$tr('incorrect');
          case 'hint':
            return this.$tr('hintUsed');
          case 'rectified':
            return this.$tr('incorrectFirstTry');
          default:
            return '';
        }
      },
    },
    $trs: {
      correct: {
        message: 'Correct',
        context: 'Indicates if the learner answered the question correctly.',
      },
      incorrect: {
        message: 'Incorrect',
        context: 'Indicates if the learner answered the question incorrectly.',
      },
      hintUsed: {
        message: 'Hint used',
        context:
          "Some exercises can offer hints. These can be suggestions to help learners solve a problem.\n\nIf the learner uses a hint, the text 'Hint used' appears in the exercise.",
      },
      incorrectFirstTry: {
        message: 'Incorrect first try',
        context:
          'Indicates if the learner answered a question incorrectly on the first attempt at answering it.\n',
      },
    },
  };

</script>


<style lang="scss" scoped>

  // Copied from: '~kolibri-design-system/lib/styles/definitions'
  $core-time: 0.25s;

  .icon {
    color: white;
  }

  svg {
    transition: transform $core-time ease-in;
  }

</style>
