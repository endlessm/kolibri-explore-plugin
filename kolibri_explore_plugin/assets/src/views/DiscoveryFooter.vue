<template>

  <div>
    <AboutModal id="about-modal" />
    <Footer class="flex-shrink-0 mt-auto">
      <template #left>
        <h3 class="text-muted">
          <strong>The Endless Key Discovery</strong> — content to help you do
          your homework and discover curiosity you didn't even know you had,
          even without internet.
        </h3>
      </template>
      <template #right>
        <p class="text-muted">
          The Endless Key initiative is brought to you by the Endless OS
          Foundation in partnership with Common Sense and Learning
          Equality
        </p>
        <b-button
          v-b-modal.about-modal
          pill
          variant="outline-secondary"
        >
          Learn more <b-icon-chevron-right />
        </b-button>
      </template>
    </Footer>
  </div>

</template>


<script>

  import AboutModal from './AboutModal';

  export default {
    name: 'DiscoveryFooter',
    components: { AboutModal },
  };

</script>
