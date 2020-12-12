<template>
  <footer>
    <hr class="charlie" />
    <p>
      このサイトの情報のうち「けものフレンズ」全般に関するものは 「
      <a href="https://kemono-friends.jp/">けものフレンズプロジェクト</a>
      」 に、「けものフレンズ３」に関するものは 「
      <a href="https://kemono-friends.sega.jp/">SEGA</a>
      」にそれぞれ帰属しています。<br />
      それら以外のものは
      <a href="https://discord.gg/yru5YvBmCx">© 2020 けものフレンズ3ツール</a> です。
    </p>
  </footer>
</template>

<script>
export default {
  name: 'TheFooter',
};
</script>

<style lang="scss" scoped>
footer {
  margin-top: auto;
  font-size: 0.75rem;
  text-align: center;
  background: #f7bc51;
  background: -webkit-linear-gradient(to bottom, white, #f7bc51);
  background: linear-gradient(to bottom, transparent, #f7bc51 2.5rem);
}
</style>
