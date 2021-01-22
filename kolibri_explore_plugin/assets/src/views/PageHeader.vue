<template>

  <KGrid>
    <KGridItem
      :layout4="{ span: 3 }"
      :layout8="{ span: 7 }"
      :layout12="{ span: 11 }"
    >
      <h1>
        <KLabeledIcon :icon="contentType" :label="title" />
      </h1>
    </KGridItem>
  </KGrid>

</template>


<script>

  export default {
    name: 'PageHeader',
    props: {
      title: {
        type: String,
      },
      contentType: {
        type: String,
      },
    },
  };

</script>


<style lang="scss" scoped>

  .progress-icon {
    position: relative;
    top: 20px;
  }

</style>
