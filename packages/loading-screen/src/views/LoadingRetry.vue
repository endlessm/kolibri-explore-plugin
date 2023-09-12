<template>
  <LoadingBase title="Could not start Endless Key" titleVariant="text-dark">
    <template #header-top>
      <b-icon-exclamation-circle variant="dark" fontScale="4" class="mb-3 w-100" />
    </template>
    <template #body>
      <h4 class="font-weight-normal text-secondary">
        Trying again...
      </h4>
    </template>
  </LoadingBase>
</template>

<script>
  import LoadingBase from './LoadingBase.vue';

  export default {
    name: 'LoadingRetry',
    components: {
      LoadingBase,
    },
  };
</script>
