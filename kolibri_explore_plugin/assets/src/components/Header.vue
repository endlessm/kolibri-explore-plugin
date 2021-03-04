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
          <b-nav-item href="#">
            <b-icon-search />
            Search
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>

</template>


<script>

  import placeholder from '../assets/placeholder.png';

  export default {
    name: 'Header',
    data() {
      return {
        icon: placeholder,
      };
    },
  };

</script>


<style lang="scss" scoped>

  .navbar-brand img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    object-position: center;
  }

</style>
