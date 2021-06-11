<template>
  <b-container class="my-3">
    <b-row>
      <b-col cols="7">
        <slot>
          <h1>There are no results containing all your filter options.</h1>
          <p class="lead">
            You can try different filter options, clear your filters or explore
            the topics below.
          </p>
        </slot>
      </b-col>
    </b-row>
  </b-container>
</template>

<style lang="scss" scoped>
  @import '@/styles.scss';

  h1 {
    color: $success;
    font-weight: bold;
  }
</style>
