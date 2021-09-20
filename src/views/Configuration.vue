<template>
  <div class="configuration">
    <h1>This is the configuration page</h1>

    <h2>Quadrants</h2>
    <ItemList v-model="quadrants" />

    <h2>Rings</h2>
    <ItemList v-model="rings" />
  </div>
</template>

<script>
import ItemList from "@/components/ItemList.vue";

export default {
  components: {
    ItemList,
  },
  inject: ["store"],
  data() {
    return {
      quadrants: [...this.store.state.quadrants],
      rings: [...this.store.state.rings],
    };
  },
  watch: {
    quadrants(val) {
      this.store.setQuadrants(val);
    },
    rings(val) {
      this.store.setRings(val);
    }
  }
};
</script>
