<template>
  <div class="configuration">
    <h2 class="text-xl font-semibold">Quadrants</h2>
    <ItemList v-model="quadrants" />
    <hr style="max-width: 80%" class="my-4 mx-auto" />
    <h2 class="text-xl font-semibold">Rings</h2>
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
    },
  },
};
</script>
