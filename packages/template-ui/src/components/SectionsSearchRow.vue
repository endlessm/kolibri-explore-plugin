<template>
  <b-container class="py-4 d-flex align-items-center">
    <MainSections />
    <b-button-toolbar class="ml-auto align-self-end" key-nav aria-label="Search">
      <b-button-group
        class="mx-1 my-1"
      >
      <b-button pill variant="light"
        to="/search"
      >
        <b-icon-search />
        Search
      </b-button>
      </b-button-group>
    </b-button-toolbar>
  </b-container>
</template>
