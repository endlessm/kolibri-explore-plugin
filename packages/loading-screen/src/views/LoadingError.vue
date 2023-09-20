<template>
  <LoadingBase
    :title="$formatMessage({
      id: 'loadingErrorTitle',
      defaultMessage: 'Could not start Endless Key',
      description: 'Title heading for when Endless Key could not load due to an error',
    })"
    titleVariant="text-danger"
  >
    <template #header-top>
      <b-icon-exclamation-circle variant="dark" fontScale="4" class="mb-3 w-100" />
    </template>
    <template #body>
      <h4 class="font-weight-normal text-muted">
        {{ $formatMessage({
          id: 'loadingErrorGuidance',
          defaultMessage:
            'Please try restarting Endless Key by closing this window and double ' +
            'clicking the launcher again.',
          description: 'Guidance for what to do if loading Endless Key failed',
        }) }}
      </h4>
    </template>
  </LoadingBase>
</template>

<script>
  import LoadingBase from './LoadingBase.vue';

  export default {
    name: 'LoadingError',
    components: {
      LoadingBase,
    },
  };
</script>
