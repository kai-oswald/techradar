<template>
  <nav id="nav" class="p-4">
    <div class="container mx-auto">
      <router-link to="/" class="px-2">Home</router-link>
      <router-link to="/config" class="px-2">Configuration</router-link>
    </div>
  </nav>
</template>

<style lang="scss">
#nav {
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>