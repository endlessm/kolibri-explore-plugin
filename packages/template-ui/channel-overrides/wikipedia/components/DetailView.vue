<template>
  <b-container class="main-container" fluid>
    <!-- TODO: move to a new commponent -->
    <b-navbar class="header px-0" type="dark" variant="dark">
      <b-container fluid>
        <b-navbar-nav>
          <b-nav-item :active="showSearchBox" @click="onSearchClicked">
            <b-icon-search />
            Search
          </b-nav-item>
          <WikiBreadcrumb :items="breadcrumb" @click="onBreadCrumbClick" />
        </b-navbar-nav>
      </b-container>
    </b-navbar>

    <b-collapse id="searchbox" v-model="showSearchBox">
      <b-container class="py-4">
        <b-input-group>
          <b-form-input
            v-model="searchQuery"
            placeholder="Search..."
            type="search"
            :disabled="searching"
          />
          <b-input-group-append>
            <b-button variant="primary" :disabled="searching" @click="doSearch">
              <b-icon-search v-if="!searching" />
              <b-spinner v-else small />
            </b-button>
          </b-input-group-append>
        </b-input-group>
        <div id="suggestions" class="text-center">
          <b-button
            v-for="suggest in suggestions"
            :key="suggest.path"
            variant="link"
            @click="onSuggestClick(suggest)"
          >
            {{ suggest.title }}
          </b-button>
        </div>
        <div v-if="searchResults.success" id="results">
          <h2>
            Top {{ searchResults.articles.length }} results for '{{ searchQuery }}'
          </h2>
          <ol class="zim-search-results-list">
            <template v-for="(article, index) in searchResults.articles">
              <li
                :ref="`article${index}`"
                :key="index"
                class="zim-search-result-item"
              >
                <a href="#" @click.prevent="onSuggestClick(article)">
                  {{ article.title }}
                </a>
                <p>{{ article.snippet }}&nbsp;&hellip;</p>
              </li>
            </template>
          </ol>
          <!-- TODO: show load more button and implement pagination for search -->
        </div>
      </b-container>
    </b-collapse>

    <iframe
      ref="iframe"
      class="custom-presentation-iframe"
      scrolling="no"
      frameBorder="0"
      :style="styles"
      :src="rooturl"
      @load="onIframeLoad"
    >
    </iframe>
  </b-container>
</template>

<script>
import _ from 'underscore';

export default {
  name: 'DetailView',
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      height: 0,
      breadcrumb: [],
      showSearchBox: false,
      searchQuery: '',
      searching: false,
      suggestions: [],
      searchResults: { success: false },
    };
  },
  computed: {
    zimfile() {
      const [zimfile] = this.node.files.filter((f) => f.extension === 'zim');
      return zimfile;
    },
    rooturl() {
      if (!this.node || !this.node.files || !this.node.files.length) {
        return '';
      }
      return `/zim/content/${this.zimfile.checksum}.zim`;
    },
    styles() {
      return {
        height: `${this.height}px`,
      };
    },
  },
  watch: {
    searchQuery() {
      if (this.searchQuery.length <= 3) {
        this.suggestions = [];
        return;
      }
      _.debounce(this.doSuggest, 100)();
    },
  },
  methods: {
    addBreadcrumb() {
      let { title } = this.$refs.iframe.contentDocument;
      const { href } = this.$refs.iframe.contentWindow.location;

      if (href === 'about:blank') {
        return;
      }

      const existingIndex = this.breadcrumb.findIndex((b) => b.href === href);
      if (existingIndex >= 0) {
        this.breadcrumb.splice(existingIndex);
      }

      if (this.breadcrumb.length === 0) {
        // We always assume the first breadcrumb is the home page. It has a
        // special title because the page title for the English Wikipedia
        // Zim file's index page is "User:The_other_Kiwix_guy/Landing".
        title = 'Home';
      }

      this.breadcrumb.push({ title, href });
    },
    onIframeLoad() {
      this.addBreadcrumb();

      // Set height to 0 and in the next tick set to the iframe body scrollHeight.
      // This is needed to adjust the content size when clicking on links,
      // because the body could have a "height: 100%" style and in that case the
      // height doesn't shrink.
      this.height = 0;
      window.scrollTo(0, 0);
      this.$nextTick(() => {
        this.height = this.$refs.iframe.contentWindow.document.body.scrollHeight;
      });
    },
    onBreadCrumbClick(link) {
      this.$refs.iframe.contentWindow.location = link.href;
    },
    onSuggestClick(suggest) {
      const path = `/zim/content/${this.zimfile.checksum}.zim/${suggest.path}`;
      this.$refs.iframe.contentWindow.location = path;
      this.showSearchBox = false;
    },
    onSearchClicked() {
      this.showSearchBox = !this.showSearchBox;
    },
    doSearch() {
      this.searching = true;
      this.suggestions = [];
      this.apiSearch(this.searchQuery)
        .then((response) => {
          this.searching = false;

          const { articles, count } = response;
          const start = 0;
          const end = start + articles.length;
          const next = end < count ? end : null;

          this.searchResults = {
            query: this.searchQuery,
            articles,
            count,
            next,
            success: true,
          };
        })
        .catch((error) => {
          this.searching = false;
          this.searchResults = { success: false };
          console.log(error);
        });
    },
    doSuggest() {
      this.apiSearch(this.searchQuery, true, 10)
        .then((r) => {
          this.suggestions = this.filterDuplicateArticles(r.articles, 5);
        });
    },
    filterDuplicateArticles(articles, limit) {
      // The search suggestions API tends to return many articles which
      // redirect to the same place, for example with minor spelling
      // differences. We solve this by fetching a larger number of results
      // than we will display, and removing the duplicate results.
      const articlePaths = new Set();
      return articles.reduce((result, article) => {
        const path = article.redirect || article.path;
        if (!articlePaths.has(path) && result.length < limit) {
          articlePaths.add(path);
          return result.concat(article);
        } else {
          return result;
        }
      }, []);
    },
    apiSearch(query, suggest = false, maxResults = 10, start) {
      const data = {
        query,
        max_results: maxResults,
      };
      if (start) {
        data.start = start;
      }
      if (suggest) {
        data.suggest = suggest;
      }
      const { origin } = window.location;
      const url = new URL(`${origin}/zim/search/${this.zimfile.checksum}.zim`);
      for (const k in data) {
        url.searchParams.append(k, data[k]);
      }
      return fetch(url).then(r => r.json());
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

$main-container-top: $navbar-height;

.custom-presentation-iframe {
  width: 100%;
  height: 100vh;
}

.main-container {
  margin: $main-container-top 0 0 0;
  padding: 0;
}

</style>
