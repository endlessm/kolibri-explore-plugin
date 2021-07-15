<template>

  <b-modal
    :id="id"
    headerCloseVariant="light"
    size="xl"
    centered
  >
    <b-container class="bg-white text-dark">
      <b-row class="pt-3">
        <b-col md="3" sm="12">
          <b-list-group v-b-scrollspy:sections-column>
            <b-list-group-item
              v-for="item in menuItems"
              :id="item.id"
              :key="item.id"
              :active="item.id === activeItemId"
              :href="item.href"
              @click="setActiveItem"
            >
              {{ item.label }}
            </b-list-group-item>
          </b-list-group>
        </b-col>
        <b-col id="sections-column" class="sections-column" md="9" sm="12">
          <div>
            <h3 id="about-section" class="text-primary">
              About
            </h3>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <hr>
            <h4>Release information</h4>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <hr>
          </div>
          <div>
            <h3 id="support-section" class="text-primary">
              Support
            </h3>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <hr>
          </div>
          <div>
            <h3 id="credits-section" class="text-primary">
              Credits
            </h3>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
            <p>Placeholder text.</p>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>

</template>


<script>

  export default {
    name: 'AboutModal',
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        activeItemId: null,
        menuItems: [
          {
            id: 'about-link',
            label: 'About',
            href: '#about-section',
          },
          {
            id: 'support-link',
            label: 'Support',
            href: '#support-section',
          },
          {
            id: 'credits-link',
            label: 'Credits',
            href: '#credits-section',
          },
        ],
      };
    },
    mounted() {
      this.activeItemId = this.menuItems[0].id;
    },
    methods: {
      setActiveItem(event) {
        this.activeItemId = event.target.id;
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .sections-column {
    position: relative;
    height: 75vh;
    overflow-y: scroll;
  }

  .list-group-item {
    border-right-width: 0;
    border-left-width: 0;
  }

  ::v-deep .modal-body {
    padding-top: 0;
  }

  ::v-deep .modal-footer {
    display: none;
  }

</style>
