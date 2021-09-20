<template>
  <div class="home">
    <Radar title="Tech radar" :technologies="technologies" :rings="rings" :quadrants="quadrants"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Radar from "@/components/Radar.vue"
import technologies from "@/data/technologies.json";

export default {
  components: {
    Radar
  },
  inject: ["store"],
  data() {
    return {
      technologies,
      quadrants: [...this.store.state.quadrants],
      rings: [...this.store.state.rings],
    }
  }
}
</script>
