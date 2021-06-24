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
    <b-button pill variant="audio" class="mb-1 mr-1">
      Audio
    </b-button>
    <b-button pill variant="document" class="mb-1 mr-1">
      Document
    </b-button>
    <b-button pill variant="exercise" class="mb-1 mr-1">
      Exercise
    </b-button>
    <b-button pill variant="html5" class="mb-1 mr-1">
      HTML5
    </b-button>
    <b-button pill variant="video" class="mb-1 mr-1">
      Video
    </b-button>

    <hr>

    <h3>Badges:</h3>
    <span class="badge badge-light badge-pill">Light</span>

    <hr>

  </b-container>
</template>

<script>
export default {
  name: 'Test',
  data() {
    return {
      sampleText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
