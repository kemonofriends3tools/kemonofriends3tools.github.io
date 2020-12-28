<template>
  <div id="app" class="app">
    <TheHeadingNav />
    <router-view />
    <TheFooter />
  </div>
</template>

<script>
import TheHeadingNav from '@/components/TheHeadingNav.vue';
import TheFooter from '@/components/TheFooter.vue';

export default {
  name: 'App',
  components: {
    TheHeadingNav,
    TheFooter,
  },
};
</script>

<style></style>
