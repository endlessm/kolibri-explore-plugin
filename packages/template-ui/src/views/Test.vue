<template>
  <!-- Deliberately not localised because it’s only test content -->
  <div class="root">
    <b-container class="bg-white pt-5">
      <h3 class="">
        Progress:
      </h3>

      <b-progress value="0.75" max="1" animated />

      <hr>

      <h3>Text:</h3>
      <h1 class="display-1">
        Display 1
      </h1>
      <h1 class="display-2">
        Display 2
      </h1>
      <h1 class="display-3">
        Display 3
      </h1>
      <h1 class="display-4">
        Display 4
      </h1>
      <h1>H1 Endless</h1>
      <h2>H2 Endless</h2>
      <h3>H3 Endless</h3>
      <h4>H4 Endless</h4>
      <h5>H5 Endless</h5>
      <h6>H6 Endless</h6>
      <p class="lead">
        This is a lead paragraph. It stands out from regular paragraphs.
      </p>
      <p>
        {{ sampleText }}
      </p>

      <hr>

      <h3>Buttons: (secondary is the default)</h3>
      <b-button pill size="sm" variant="primary" class="mb-1 mr-1">
        Primary
      </b-button>
      <b-button pill size="sm" class="mb-1 mr-1">
        Secondary
      </b-button>
      <b-button pill size="sm" variant="outline-dark" class="mb-1 mr-1">
        Outline
      </b-button>
      <b-button pill size="sm" variant="light" class="mb-1 mr-1">
        Light
      </b-button>
      <hr>
      <b-button pill variant="primary" class="mb-1 mr-1">
        Primary
      </b-button>
      <b-button pill class="mb-1 mr-1">
        Secondary
      </b-button>
      <b-button pill variant="outline-dark" class="mb-1 mr-1">
        Outline
      </b-button>
      <b-button pill variant="light" class="mb-1 mr-1">
        Light
      </b-button>
      <hr>
      <b-button pill size="lg" variant="primary" class="mb-1 mr-1">
        Primary
      </b-button>
      <b-button pill size="lg" class="mb-1 mr-1">
        Secondary
      </b-button>
      <b-button pill size="lg" variant="outline-dark" class="mb-1 mr-1">
        Outline
      </b-button>
      <b-button pill size="lg" variant="light" class="mb-1 mr-1">
        Light
      </b-button>
      <hr>
      <h3>Media Buttons:</h3>
      <EkPlayButton kind="video" class="mb-1 mr-1" />
      <EkPlayButton kind="html5" class="mb-1 mr-1" />
      <EkPlayButton kind="exercise" class="mb-1 mr-1" />
      <EkPlayButton kind="document" class="mb-1 mr-1" />
      <EkPlayButton kind="bundle" class="mb-1 mr-1" />
      <EkPlayButton kind="audio" class="mb-1 mr-1" />

      <hr>

      <h3>Badges:</h3>
      <b-badge pill variant="light" class="mr-1">
        one
      </b-badge>
      <b-badge pill variant="light" class="mr-1">
        two
      </b-badge>
      <b-badge pill variant="light" class="mr-1">
        three
      </b-badge>

    </b-container>
    <b-container class="mt-5">
      <h3>Topic Cards:</h3>
      <b-row>
        <b-col
          v-for="node in topicNodes"
          :key="node.id"
          class="mb-2"
          lg="3"
          md="6"
          xs="12"
        >
          <EkCard :node="node" />
        </b-col>
      </b-row>

      <hr>

      <h3>Content Cards:</h3>
      <b-row>
        <b-col
          v-for="node in contentNodes"
          :key="node.id"
          class="mb-2"
          lg="3"
          md="6"
          xs="12"
        >
          <EkCard :node="node" />
        </b-col>
      </b-row>

      <hr>

      <h3>
        Downloadable Cards:
      </h3>
      <b-row>
        <b-col
          v-for="node in downloadContentNodes"
          :key="node.id"
          class="mb-2"
          lg="3"
          md="6"
          xs="12"
        >
          <EkCard
            :node="node"
            @nodeUpdated="onNodeUpdated"
          />
        </b-col>
      </b-row>

      <hr>

      <h3>Cards size comparison:</h3>
      <b-row>
        <b-col
          v-for="node in [...topicNodes.slice(0, 1), ...contentNodes.slice(0, 1)]"
          :key="node.id + 'hi'"
          class="mb-2"
          lg="3"
          md="6"
          xs="12"
        >
          <EkCard :node="node" />
        </b-col>
        <b-col
          v-for="node in [...topicNodes.slice(0, 1), ...contentNodes.slice(0, 1)]"
          :key="node.id + 'low'"
          lg="3"
          md="6"
          xs="12"
        >
          <EkCard :node="node" mediaQuality="low" />
        </b-col>
      </b-row>

      <hr>

    </b-container>
    <b-container class="no-container-padding">
      <b-container>
        <h3>Slidable cards loading:</h3>
      </b-container>
      <EkCardGridPlaceholder />
      <b-container>
        <h3>Slidable cards:</h3>
      </b-container>
      <EkCardGrid :nodes="contentNodes" />
      <b-container>
        <hr>
        <h3>Carousel cards loading:</h3>
      </b-container>
      <EkCarouselPlaceholder />
      <b-container>
        <hr>
        <h3>Carousel cards:</h3>
      </b-container>
      <EkCarousel :nodes="contentNodes" />
    </b-container>
  </div>
</template>

<script>
import {
  testChannel,
  downloadContentSuccessId,
  downloadContentFailureId,
} from "../mockKolibriApi";

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export default {
  name: 'Test',
  data() {
    return {
      sampleText: lorem,
      topicNodes: [
        {
          id: 't0',
          kind: 'topic',
          title: 'A topic',
          description: 'This is a topic.',
          isBundle: false,
        },
        // Topic node with long title:
        {
          id: 't1',
          kind: 'topic',
          title: lorem,
          description: '',
          isBundle: false,
        },
        // Topic node with long description:
        {
          id: 't2',
          kind: 'topic',
          title: 'A topic',
          description: lorem,
          isBundle: false,
        },
        // Topic node with long title and description:
        {
          id: 't3',
          kind: 'topic',
          title: lorem,
          description: lorem,
          isBundle: false,
        },
      ],
      contentNodes: [
        {
          id: 'c0',
          kind: 'video',
          title: 'A video',
          author: 'Endless',
          available: true,
        },
        {
          id: 'c1',
          kind: 'html5',
          title: 'An html5 app',
          author: 'Endless',
          available: true,
        },
        {
          id: 'c2',
          kind: 'exercise',
          title: 'An exercise',
          author: 'Endless',
          available: true,
        },
        {
          id: 'c3',
          kind: 'document',
          title: 'A document',
          author: 'Endless',
          available: true,
        },
        {
          id: 'c4',
          kind: 'topic',
          title: 'A bundle',
          description: 'Wont appear',
          author: 'Endless',
          isBundle: true,
          available: true,
        },
        {
          id: 'c5',
          kind: 'audio',
          title: 'An audio',
          author: 'Endless',
          available: true,
        },
        // Content node with long title:
        {
          id: 'c11',
          kind: 'html5',
          title: lorem,
          author: 'Endless',
          available: true,
        },
        // Content node with channel:
        {
          id: 'c12',
          kind: 'exercise',
          title: 'Card with channel',
          author: 'Endless',
          channel: testChannel,
          available: true,
        },
        // Content node with long title and many tags (worst case):
        {
          id: 'c13',
          kind: 'document',
          title: lorem,
          author: 'Endless',
          structuredTags: {'subject': ['one', 'two', 'three', 'four', 'five', 'six']},
          available: true,
        },
      ],
      downloadContentNodes: [
        // Downloadable content, success:
        {
          id: downloadContentSuccessId,
          channel_id: '123',
          kind: 'video',
          title: 'Successful Download',
          description: lorem,
          author: 'Endless',
          available: false,
        },
        // Downloadable content, failure:
        {
          id: downloadContentFailureId,
          channel_id: '123',
          kind: 'document',
          title: 'Download failure',
          description: lorem,
          author: 'Endless',
          available: false,
        },
      ],
    };
  },
  methods: {
    onNodeUpdated(nodeId) {
      this.downloadContentNodes.find(n => n.id === nodeId).available = true;
    },
  },
};
</script>
