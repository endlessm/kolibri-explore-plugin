export default {
  methods: {
    onNodeUpdated(nodeId, nodes) {
      return window.kolibri.getContentById(nodeId, true).then((newNode) => {
        const index = nodes.findIndex(
          node => node.id === newNode.id
        )
        if (index === -1) {
          return;
        }
        this.$set(nodes, index, newNode);
      });
    },
  },
};
