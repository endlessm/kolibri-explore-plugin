export default {
  SET_PAGE_NAME(state, name) {
    state.pageName = name;
  },
  SET_SEARCH_TERM(state, term) {
    state.searchTerm = term;
  },
  SET_CONTENT_ID(state, id) {
    state.contentId = id;
  },
  SET_SHOW_INSTALL_CONTENT(state, value) {
    state.visibleInstallContentModal = value;
  },
};
