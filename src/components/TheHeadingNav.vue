<template>
  <header>
    <b-navbar toggleable="lg" type="light" variant="info">
      <b-navbar-brand to="/" class="d-block d-sm-none m-0">
        <span class="fa-stack fa-1x nav-logo">
          <i class="fas fa-clipboard fa-stack-2x"></i>
          <i class="fas fa-paw fa-stack-1x fa-inverse" style="margin-top:5px;"></i>
        </span>
        <span class="brand-text">けもフレ３ツール</span>
      </b-navbar-brand>
      <b-navbar-brand to="/" class="d-none d-sm-block">
        <span class="fa-stack fa-1x nav-logo">
          <i class="fas fa-clipboard fa-stack-2x"></i>
          <i class="fas fa-paw fa-stack-1x fa-inverse" style="margin-top:5px;"></i>
        </span>
        <span class="brand-text">けものフレンズ３ツール</span>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item to="/friends">フレンズ検索</b-nav-item>
          <b-nav-item to="/photo">フォト検索</b-nav-item>
          <b-nav-item to="/events">イベント・しょうたい検索</b-nav-item>
          <b-nav-item to="/calc">各種計算</b-nav-item>
          <b-nav-item to="/statistics">統計</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<script>
export default {
  name: 'TheHeadingNav',
};
</script>

<style scoped></style>
