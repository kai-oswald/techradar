<template>
  <div class="hello">
    <svg id="radar"></svg>
  </div>
</template>

<script>
import { radar_visualization } from "@/radar.js";

export default {
  props: {
    title: String,
    technologies: {
      type: Array,
      required: true,
    },
    quadrants: {
      type: Array,
      required: true,
    },
    rings: {
      type: Array,
      require: true,
    },
  },
  methods: {
    renderRadar() {
      radar_visualization({
        svg_id: "radar",
        width: 1450,
        height: 1000,
        colors: {
          background: "#fff",
          grid: "#bbb",
          inactive: "#ddd",
        },
        title: this.title,
        quadrants: this.quadrants,
        rings: this.rings,
        print_layout: true,
        entries: this.technologies,
      });
    },
  },
  mounted() {
    this.renderRadar();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
