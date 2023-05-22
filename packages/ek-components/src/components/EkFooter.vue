<template>
  <div class="footer">
    <b-container>
      <slot>
        <b-row>
          <b-col cols="6">
            <slot name="left"></slot>
          </b-col>
          <b-col cols="2" />
          <b-col>
            <slot name="right"></slot>
          </b-col>
        </b-row>
      </slot>
    </b-container>
  </div>
</template>

<script>
  export default {
    name: 'EkFooter',
  };
</script>

<style lang="scss" scoped>

  @import '../styles';

  .footer {
    padding: 5rem 0;
    box-shadow: inset $box-shadow-sm;
    background-color: $gray-400;
  }
</style>
