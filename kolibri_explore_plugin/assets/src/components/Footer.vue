<template>

  <div class="footer mt-auto text-center text-lg-start text-light">
    <hr>
    <b-container fluid>
      <p>
        Endless OS Foundation LLC is a program of Endless Network Inc., a
        501(c)(4) social-welfare non-profit.
        <br>
        © 2021 Endless OS Foundation LLC. All Rights Reserved.
        <a
          href="https://www.endlessos.org/privacy-policy"
          target="_blank"
          tabindex="-1"
          data-restore-tabindex="0"
        >
          Privacy Policy.
        </a>
        &nbsp;
        <a
          href="https://www.endlessos.org/redistribution-policy"
          target="_blank"
          tabindex="-1"
          data-restore-tabindex="0"
        >
          Redistribution Policy.
        </a>
      </p>
    </b-container>
  </div>

</template>


<script>

  export default {
    name: 'Footer',
  };

</script>


<style lang="scss" scoped>

  .footer {
    padding: 20px;
    margin-top: 40px;
    font-size: small;
  }

</style>
