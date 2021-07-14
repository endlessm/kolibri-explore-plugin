<template>
  <b-container class="my-4">
    <b-row>
      <b-col sm="12" md="8" lg="10">
        <MainSections />
      </b-col>
      <b-col>
        <b-button-toolbar keyNav aria-label="Search">
          <b-button-group
            class="ml-md-auto mx-1 my-1"
          >
            <SearchButton to="/search" />
          </b-button-group>
        </b-button-toolbar>
      </b-col>
    </b-row>
  </b-container>
</template>

<style lang="scss" scoped>
  .search-button {
    white-space: nowrap;
  }
</style>
