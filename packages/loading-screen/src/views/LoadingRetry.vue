<template>
  <div class="d-flex flex-column flex-grow-1">
    <div
      id="main"
      class="align-items-center d-flex flex-column flex-grow-1 justify-content-center"
    >
      <b-icon-exclamation-circle variant="dark" fontScale="4" class="mb-3" />
      <div>
        <h1 class="text-dark">
          Could not start Endless Key
        </h1>
        <h4 class="font-weight-normal mt-3 text-secondary">
          Trying again...
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingRetry',
};
</script>
