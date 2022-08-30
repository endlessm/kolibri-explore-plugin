<template>
  <WelcomeBase title="Could not start Endless Key" titleVariant="text-dark">
    <template #header-top>
      <b-icon-exclamation-circle variant="dark" fontScale="4" class="mb-3 w-100" />
    </template>
    <template #body>
      <h4 class="font-weight-normal text-secondary">
        Trying again...
      </h4>
    </template>
  </WelcomeBase>
</template>

<script>
  import WelcomeBase from './WelcomeBase.vue';

  export default {
    name: 'LoadingRetry',
    components: {
      WelcomeBase,
    },
  };
</script>
