<template>
  <b-container class="bg-white root">
    <hr>

    <h3>Breadcrumb:</h3>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#">Home</a>
        </li>
        <li class="breadcrumb-item">
          <a href="#">Library</a>
        </li>
        <li class="active breadcrumb-item" aria-current="page">
          Data
        </li>
      </ol>
    </nav>

    <hr>

    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#">Home</a>
        </li>
        <li class="active breadcrumb-item" aria-current="page">
          ...
        </li>
        <li class="breadcrumb-item">
          <a href="#">Library</a>
        </li>
      </ol>
    </nav>

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

    <h3>Buttons:</h3>
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
      Normal
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
      Normal
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
      Normal
    </b-button>
    <hr>
    <h3>Media Buttons:</h3>
    <PlayButton kind="video" class="mb-1 mr-1" />
    <PlayButton kind="html5" class="mb-1 mr-1" />
    <PlayButton kind="exercise" class="mb-1 mr-1" />
    <PlayButton kind="document" class="mb-1 mr-1" />
    <PlayButton kind="bundle" class="mb-1 mr-1" />
    <PlayButton kind="audio" class="mb-1 mr-1" />

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

    <hr>

    <h3>Topic Cards:</h3>
    <b-row>
      <b-col
        v-for="node in topicNodes"
        :key="node.id"
        lg="3"
        md="6"
        xs="12"
      >
        <Card :node="node" mediaQuality="regular" />
      </b-col>
    </b-row>

    <hr>

    <h3>Content Cards:</h3>
    <b-row>
      <b-col
        v-for="node in contentNodes"
        :key="node.id"
        lg="3"
        md="6"
        xs="12"
      >
        <Card :node="node" mediaQuality="regular" />
      </b-col>
    </b-row>

    <hr>

    <h3>Cards size comparison:</h3>
    <b-row>
      <b-col
        v-for="node in [...topicNodes.slice(0, 1), ...contentNodes.slice(0, 1)]"
        :key="node.id + 'hi'"
        lg="3"
        md="6"
        xs="12"
      >
        <Card :node="node" mediaQuality="regular" />
      </b-col>
      <b-col
        v-for="node in [...topicNodes.slice(0, 1), ...contentNodes.slice(0, 1)]"
        :key="node.id + 'low'"
        lg="3"
        md="6"
        xs="12"
      >
        <Card :node="node" mediaQuality="low" />
      </b-col>
    </b-row>

    <hr>

  </b-container>
</template>

<script>

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
          useDefaultThumbnail: true,
        },
        // Topic node with long title:
        {
          id: 't1',
          kind: 'topic',
          title: lorem,
          description: '',
          useDefaultThumbnail: true,
        },
        // Topic node with long description:
        {
          id: 't2',
          kind: 'topic',
          title: 'A topic',
          description: lorem,
          useDefaultThumbnail: true,
        },
        // Topic node with long title and description:
        {
          id: 't3',
          kind: 'topic',
          title: lorem,
          description: lorem,
          useDefaultThumbnail: true,
        },
      ],
      contentNodes: [
        {
          id: 'c0',
          kind: 'video',
          title: 'A video',
          author: 'Endless',
          useDefaultThumbnail: true,
          structuredTags: {},
        },
        {
          id: 'c1',
          kind: 'html5',
          title: 'An app',
          author: 'Endless',
          useDefaultThumbnail: true,
          structuredTags: {},
        },
        {
          id: 'c2',
          kind: 'exercise',
          title: 'An exercise',
          author: 'Endless',
          useDefaultThumbnail: true,
          structuredTags: {},
        },
        {
          id: 'c3',
          kind: 'document',
          title: 'A document',
          author: 'Endless',
          useDefaultThumbnail: true,
          structuredTags: {},
        },
        // FIXME: add bundle card here.
        {
          id: 'c4',
          kind: 'audio',
          title: 'An audio',
          author: 'Endless',
          useDefaultThumbnail: true,
          structuredTags: {},
        },
        // Content node with some tags:
        {
          id: 'c10',
          kind: 'video',
          title: 'A video with duration and other tags',
          author: 'Endless',
          useDefaultThumbnail: true,
          structuredTags: {'duration': ['160'], 'subject': ['games'], 'type': ['test'], 'level': ['beginner']},
        },
        // Content node with long title:
        {
          id: 'c11',
          kind: 'html5',
          title: lorem,
          author: 'Endless',
          useDefaultThumbnail: true,
          structuredTags: {},
        },
        // Content node with channel:
        {
          id: 'c12',
          kind: 'exercise',
          title: 'Card with channel',
          author: 'Endless',
          useDefaultThumbnail: true,
          structuredTags: {},
          channel: {'title': 'My channel'},
        },
        // Content node with long title and many tags (worst case):
        {
          id: 'c13',
          kind: 'document',
          title: lorem,
          author: 'Endless',
          useDefaultThumbnail: true,
          structuredTags: {'subject': ['one', 'two', 'three', 'four', 'five', 'six']},
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.root {
  margin-top: $navbar-height;
}

</style>
