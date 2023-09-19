<template>
  <LoadingBase
    :title="$formatMessage({
      id: 'loadingRetryTitle',
      defaultMessage: 'Could not start Endless Key',
      description: 'Title heading for when Endless Key could not be started due to an error',
    })"
    titleVariant="text-dark"
  >
    <template #header-top>
      <b-icon-exclamation-circle variant="dark" fontScale="4" class="mb-3 w-100" />
    </template>
    <template #body>
      <h4 class="font-weight-normal text-secondary">
        {{ $formatMessage({
          id: 'loadingTryingAgain',
          defaultMessage: 'Trying again…',
          description: 'Page content shown when trying to load Endless Key again after an error',
        }) }}
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
