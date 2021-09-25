<template>
  <NavBar />
  <div class="container mx-auto">
    <router-view />
  </div>
</template>

<script>
import { store } from "@/store.js";
import NavBar from "@/components/NavBar";

export default {
  components: {
    NavBar,
  },
  provide: {
    store,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
