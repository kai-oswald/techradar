<template>
  <div class="home">
    <Radar title="Tech radar" :technologies="technologies" />
  </div>
</template>

<script>
// @ is an alias to /src
import Radar from '@/components/Radar.vue'
import technologies from '@/data/technologies.json';

export default {
  name: 'Home',
  components: {
    Radar
  },
  data() {
    return {
      technologies,

    }
  }
}
</script>
