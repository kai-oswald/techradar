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
      default: () => [
        { name: "Languages" },
        { name: "Infrastructure" },
        { name: "Datastores" },
        { name: "Data Management" },
      ],
    },
    rings: {
      type: Array,
      default: () => [
        { name: "ADOPT", color: "#93c47d" },
        { name: "TRIAL", color: "#93d2c2" },
        { name: "ASSESS", color: "#fbdb84" },
        { name: "HOLD", color: "#efafa9" },
      ],
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
        quadrants: [
          { name: "Languages" },
          { name: "Infrastructure" },
          { name: "Datastores" },
          { name: "Data Management" },
        ],
        rings: [
          { name: "ADOPT", color: "#93c47d" },
          { name: "TRIAL", color: "#93d2c2" },
          { name: "ASSESS", color: "#fbdb84" },
          { name: "HOLD", color: "#efafa9" },
        ],
        print_layout: true,
        entries: this.technologies,
      });
    },
  },
  mounted() {
    this.renderRadar();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
