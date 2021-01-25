<template>

  <KGrid>
    <KGridItem
      v-for="content in contents"
      :key="content.id"
      :layout="{ span: cardColumnSpan }"
    >
      <ChannelCard
        :title="content.title"
        :backgroundImage="content.cardBackgroundImage"
        :thumbnail="content.thumbnail"
        :kind="content.kind"
        :tagline="getTagLine(content)"
        :progress="content.progress || 0"
        :link="genContentLink(content.id, content.kind)"
        :height="cardHeight"
        :width="cardWidth"
        :contentId="content.content_id"
      />
    </KGridItem>
  </KGrid>

</template>


<script>

  import { validateLinkObject } from 'kolibri.utils.validators';
  import responsiveWindowMixin from 'kolibri.coreVue.mixins.responsiveWindowMixin';
  import ChannelCard from './ChannelCard';

  export default {
    name: 'ChannelCardGroupGrid',
    components: {
      ChannelCard,
    },
    mixins: [responsiveWindowMixin],
    props: {
      contents: {
        type: Array,
        required: true,
      },
      size: {
        type: String,
        required: false,
        default: 'medium',
        validator(value) {
          return ['small', 'medium', 'large'].indexOf(value) !== -1;
        },
      },
      genContentLink: {
        type: Function,
        validator(value) {
          return validateLinkObject(value(1, 'exercise'));
        },
        /* eslint-disable no-empty-function */
        default: () => {},
        required: false,
      },
    },
    data: () => ({
      modalIsOpen: false,
      sharedContentId: null,
      uniqueId: null,
      isMounted: false,
      sizes: {
        small: { width: 150, height: 100 },
        medium: { width: 400, height: 250 },
        large: { width: 500, height: 300 },
      },
    }),
    computed: {
      cardColumnSpan() {
        if (this.windowBreakpoint <= 1) return 4;
        if (this.windowBreakpoint === 2) return 8;
        if (this.windowBreakpoint <= 4) return 6;
        if (this.windowBreakpoint <= 6) return 4;
        return 3;
      },
      cardHeight() {
        return this.sizes[this.size].height;
      },
      cardWidth() {
        return this.sizes[this.size].width;
      },
    },

    methods: {
      getTagLine(content) {
        return content.tagline || content.description;
      },
    },
  };

</script>
