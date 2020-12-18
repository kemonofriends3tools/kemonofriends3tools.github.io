<template>
  <div id="app" class="app">
    <div class="text-center" style="background:#ff8080">
      注意：このサイトは現在正式リリースへ向けて最終的な調整作業を行っています(目標は今年(2020)中です)。表示されているデータはまだ正しくない恐れがあります。ご了承下さい。
    </div>
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
