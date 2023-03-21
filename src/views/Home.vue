<template>
  <div>
    <div>
      <h1 class="mt-2 title-h1">『けものフレンズ３ツール』へようこそ</h1>
      <blockquote class="title-quote">
        隊長さーんっ！&#8203;こっちですよーっ&#8203;！！！
      </blockquote>
      <p class="title-sub">
        『けものフレンズ３ツール』はアプリ版『けものフレンズ３』隊長さんのためのサイトです。<br />
        ここでは攻略情報は直接扱っていません。<br />
        そのかわりに他の攻略サイトでは探しづらい情報や、痒いところに手が届くツールの提供を目指しています。
      </p>
    </div>
    <b-card-group deck class="mx-1 mb-4 justify-content-center">
      <b-card header-tag="header" footer-tag="footer" class="b-cards-contents">
        <template v-slot:header>
          <i class="fas fa-paw" style="font-size:4rem; display: block; text-align:center;"></i>
        </template>
        <b-card-title>フレンズ検索</b-card-title>
        <b-card-text>
          <p>
            『くらくら』を与えられるフレンズは？<br />
            『みずべ』で有利なフレンズは？
          </p>
          <p>ここでは少し変わった条件でフレンズを検索することが出来ます。</p>
        </b-card-text>
        <template v-slot:footer class="text-right">
          <div class="text-right">
            <b-button to="/friends">フレンズ検索</b-button>
          </div>
        </template>
      </b-card>
      <b-card header-tag="header" footer-tag="footer" class="b-cards-contents">
        <template v-slot:header>
          <i class="fas fa-camera" style="font-size:4rem; display: block; text-align:center;"></i>
        </template>
        <b-card-title>フォト検索</b-card-title>
        <b-card-text>
          <p>
            『すやすや』耐性を与えるフォトは？<br />
            あのイラストレータが描いたフォトは？
          </p>
          <p>ここでは少し変わった条件でフォトを検索することが出来ます。</p>
        </b-card-text>
        <template v-slot:footer>
          <div class="text-right">
            <b-button to="/photo">フォト検索</b-button>
          </div>
        </template>
      </b-card>
      <b-card header-tag="header" footer-tag="footer" class="b-cards-contents">
        <template v-slot:header>
          <i
            class="fas fa-calendar-alt"
            style="font-size:4rem; display: block; text-align:center;"
          ></i>
        </template>
        <b-card-title>イベント・しょうたい検索</b-card-title>
        <b-card-text>
          <p>
            このフレンズ、最後に引けたのはいつ？<br />
            共闘っていつ開催された？大掃除は？
          </p>
          <p>ここではイベントやしょうたいの履歴を調べることが出来ます。</p>
        </b-card-text>
        <template v-slot:footer>
          <div class="text-right">
            <b-button to="/events">イベント・しょうたい検索</b-button>
          </div>
        </template>
      </b-card>
      <b-card header-tag="header" footer-tag="footer" class="b-cards-contents">
        <template v-slot:header>
          <i
            class="fas fa-calculator"
            style="font-size:4rem; display: block; text-align:center;"
          ></i>
        </template>
        <b-card-title>各種計算</b-card-title>
        <b-card-text>
          <p>
            イベント目標達成にスタドリ何本必要？<br />
            ピクニック、欠片の回収完了はいつ？
          </p>
          <p>ここでは隊長さんのお仕事に役立つ各種計算が行なえます。</p>
        </b-card-text>
        <template v-slot:footer>
          <div class="text-right">
            <b-button to="/calc">各種計算</b-button>
          </div>
        </template>
      </b-card>
      <b-card footer-tag="footer" class="b-cards-contents">
        <template v-slot:header>
          <i class="fas fa-database" style="font-size:4rem; display: block; text-align:center;"></i>
        </template>
        <b-card-title>統計</b-card-title>
        <b-card-text>
          <p>
            今フレンズって合計何人？最も多くの絵を書いたイラストレーターは？次に来そうなイベントは？
          </p>
          <p>ここでは様々な統計を見ることが出来ます。</p>
        </b-card-text>
        <template v-slot:footer>
          <div class="text-right">
            <b-button to="/statistics">統計</b-button>
          </div>
        </template>
      </b-card>
    </b-card-group>
    <HomeTopInfo />
    <h2 class="text-center">情報提供やお手伝いに興味がある方へ</h2>
    <div class="d-flex flex-column align-items-center mx-2">
      <b-button
        variant="outline-secondary"
        class="mb-2"
        onClick="window.open('https://docs.google.com/spreadsheets/d/1RpSL7SRXZFzqJDK5AG-63aevHAI4Aew8IuU2S-rZ2EM/edit?usp=sharing','_blank','noopener')"
      >
        <i class="fas fa-table fa-lg"></i>『けものフレンズ3ツール データシート』を開く
      </b-button>
      <div style="max-width:60rem;">
        <p class="mb-1">
          ありがとうございます。このサイトの情報は上のgoogleスプレッドシートで管理・作業しています。<br />
          もしサイトにない情報をお持ちであったり、入力ミス等を発見された場合は編集していただけると幸いです。<br />
          詳細はスプレッドシートを参照して下さい。それ以上の不明点がありましたら下のdiscordのほうでご相談下さい。
        </p>
      </div>
    </div>
    <h2 class="text-center">discordのご案内</h2>
    <div class="d-flex flex-column align-items-center mx-2">
      <b-button
        variant="outline-secondary"
        class="mb-2"
        onClick="window.open('https://discord.gg/yru5YvBmCx','_blank','noopener')"
      >
        <img
          src="@/assets/svg/discord.svg"
          alt="discord logo"
          style="width:8rem;vertical-align: middle;"
        />『けものフレンズ３ツール』discordサーバーを開く
      </b-button>
      <div style="max-width:60rem;">
        <p class="mb-1">
          このサイトの管理・運営・連絡・雑談用にdiscordのサーバーを用意しています。<br />
          誤字やバグ報告、問い合わせ等何かありましたらこちらからご連絡下さい。<br />
          尚、入室の際に挨拶等は特段必要ありません。ROM(読み専)でも全く問題ありません。
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import HomeTopInfo from '@/components/HomeTopInfo.vue';
export default {
  name: 'Home',
  components: {
    HomeTopInfo,
  },
};
</script>
<style lang="scss" scoped>
@import '../assets/scss/paletton';

.title-quote {
  max-width: 36rem;
  font-size: 1.8rem;
  font-style: italic;
  font-weight: 700;
  font-family: 'M PLUS Rounded 1c', sans-serif;
  word-break: keep-all;
  word-wrap: break-word;
  text-align: center;
  margin: 1rem auto;
  border-radius: 1rem;
  position: relative;
  padding: 15px 0 15px 0;
  box-sizing: border-box;
  background: $color-primary-almost-white;
  border: 3px solid $color-primary-3;
  &:before {
    display: inline-block;
    position: absolute;
    top: -8px;
    left: 9px;
    width: 40px;
    height: 30px;
    text-align: center;
    content: '\f10d';
    color: #fff;
    font-size: 18px;
    line-height: 30px;
    background: $color-primary-0;
    font-weight: 900;
    font-family: 'Font Awesome 5 Free';
  }
  &:after {
    position: absolute;
    content: '';
    top: -8px;
    left: 49px;
    border: none;
    border-bottom: solid 8px $color-primary-4;
    border-right: solid 9px transparent;
  }
}
h1.title-h1 {
  font-size: min(5vw, 2.5rem);
}
p.title-sub {
  margin: 0.5rem 0.5rem 1rem 0.5rem;
  text-align: center;
  font-size: 1rem;
  font-weight: 400;
}

.b-cards-contents {
  min-width: 20rem;
  max-width: 20rem;
  margin: 1rem auto;
}
</style>
