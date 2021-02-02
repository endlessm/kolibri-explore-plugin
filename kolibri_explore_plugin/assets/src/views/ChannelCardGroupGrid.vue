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

    computed: {
      cardColumnSpan() {
        if (this.windowBreakpoint <= 1) return 4;
        if (this.windowBreakpoint === 2) return 8;
        if (this.windowBreakpoint <= 4) return 6;
        if (this.windowBreakpoint <= 6) return 4;
        return 3;
      },
    },

    methods: {
      getTagLine(content) {
        return content.tagline || content.description;
      },
    },
  };

</script>
