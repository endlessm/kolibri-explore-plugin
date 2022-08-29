<template>
  <div class="d-flex flex-column flex-grow-1">
    <div
      id="main"
      class="align-items-center d-flex flex-column flex-grow-1 justify-content-center"
    >
      <b-icon-exclamation-circle variant="dark" fontScale="4" class="mb-3" />
      <div>
        <h1 class="text-danger">
          Could not start Endless Key
        </h1>
        <h4 class="font-weight-normal mt-3 text-muted">
          Please, try restarting Endless Key by closing this window and
          double clicking the launcher again.
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingError',
};
</script>
