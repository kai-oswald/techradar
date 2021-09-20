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
import { quadrants, rings } from "@/data/defaults";
import ItemList from "@/components/ItemList.vue";

export default {
  components: {
    ItemList
  },
  data() {
    return {
      quadrants: [...quadrants ],
      rings: [...rings ],
    }
  }
  
}
</script>
