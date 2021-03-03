<template>

  <div id="header">
    <b-navbar type="dark">
      <b-navbar-brand href="/learn">
        <img :src="icon" alt="Endless Key">
      </b-navbar-brand>

      <b-collapse id="nav-collapse" isNav>
        <b-navbar-nav>
          <b-nav-item href="/learn">
            <b-icon-house-door-fill />
            Home
          </b-nav-item>
          <b-nav-item href="#">
            Learn
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>

      <b-navbar-nav class="ml-auto">
        <div class="searchbar">
          <label class="visuallyhidden" for="searchfield">Search</label>
          <input
            id="searchfield"
            ref="searchInput"
            v-model.trim="searchQuery"
            type="search"
            class="search-input"
            dir="auto"
            placeholder="Search"
            @focus="searchFocus = true"
            @blur="searchFocus = false"
          >
        </div>
      </b-navbar-nav>
    </b-navbar>
  </div>

</template>


<script>

  import placeholder from '../assets/placeholder.png';

  export default {
    name: 'Header',
    data() {
      return {
        searchQuery: '',
        searchFocus: false,
        icon: placeholder,
      };
    },
    watch: {
      searchQuery() {
        this.$emit('searchClick', this.searchQuery);
      },
    },
  };

</script>


<style lang="scss" scoped>

  .searchbar {
    .search-input {
      background-color: transparent;
      border: 0;
      border-bottom: 1px solid white;
      opacity: 0.5;
      transition: all 1s ease;

      &:focus {
        opacity: 1;
      }
    }

    button {
      transition: all 1s ease;
    }
  }

  .navbar-brand img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    object-position: center;
  }

</style>
