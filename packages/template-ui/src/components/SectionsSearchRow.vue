<template>
  <b-container class="align-items-center d-flex py-4">
    <MainSections />
    <b-button-toolbar class="align-self-end ml-auto" keyNav aria-label="Search">
      <b-button-group
        class="mx-1 my-1"
      >
        <b-button
          pill
          variant="outline-dark"
          to="/search"
        >
          <b-icon-search />
          Search
        </b-button>
      </b-button-group>
    </b-button-toolbar>
  </b-container>
</template>
