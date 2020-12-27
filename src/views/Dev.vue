<template>
  <b-container fluid class="text-center">
    <h1>開発用sandbox</h1>
    <h2 class="my-4">カラー(variant)サンプル</h2>
    <b-row>
      <b-col>
        <b-button variant="primary">Primary</b-button>
        <b-button variant="secondary">Secondary</b-button>
        <b-button variant="success">Success</b-button>
        <b-button variant="info">Info</b-button>
        <b-button variant="warning">Warning</b-button>
        <b-button variant="danger">Danger</b-button>
        <b-button variant="light">Light</b-button>
        <b-button variant="dark">Dark</b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button variant="outline-primary">Primary</b-button>
        <b-button variant="outline-secondary">Secondary</b-button>
        <b-button variant="outline-success">Success</b-button>
        <b-button variant="outline-info">Info</b-button>
        <b-button variant="outline-warning">Warning</b-button>
        <b-button variant="outline-danger">Danger</b-button>
        <b-button variant="outline-light">Light</b-button>
        <b-button variant="outline-dark">Dark</b-button>
      </b-col>
    </b-row>
    <h2 class="my-4">friendsの特殊条件初期案</h2>
    <b-container>
      <b-alert show variant="warning">
        開発用：以下は「指定なし」以外全てダミー。
      </b-alert>
      <b-card class="mb-2" title="状態異常/特殊行動">
        <b-form-radio-group>
          <b-form-radio value="all">与える</b-form-radio>
          <b-form-radio value="all">防ぐ</b-form-radio>
        </b-form-radio-group>
        <b-card-text>
          <b-button>くらくら</b-button>
          <b-button>どく</b-button>
          <b-button>すやすや</b-button>
          <b-button>くたくた</b-button>
          <b-button>ひやひや</b-button>
          <b-button>ズキンズキン</b-button>
          <b-button>からげんき</b-button>
          <b-button>はねかえし</b-button>
          <b-button>かばう</b-button>
        </b-card-text>
      </b-card>
      <b-card class="mb-2" title="バフ/デバフ">
        <b-alert show variant="info">
          未完成。メモ参照
        </b-alert>
        <b-card-text>
          <b-button>指定しない</b-button>
          <b-button>自身</b-button>
          <b-button>複数体</b-button>
          <b-button>ファ</b-button>
          <b-button>フレ</b-button>
          <b-button>リラ</b-button>
          <b-button>ラブ</b-button>
          <b-button>アク</b-button>
          <b-button>マイ</b-button>
          <b-button>全体</b-button>
        </b-card-text>
        <b-card-text>
          <b-button>指定しない</b-button>
          <b-button>くらくら</b-button>
          <b-button>どく</b-button>
          <b-button>すやすや</b-button>
          <b-button>くたくた</b-button>
          <b-button>ひやひや</b-button>
          <b-button>ズキンズキン</b-button>
          <b-button>からげんき</b-button>
        </b-card-text>
      </b-card>
      <b-card class="mb-2" title="特定フラッグ所持">
        <b-card-text>
          <b-button>try1</b-button>
          <b-button>try2</b-button>
          <b-button>try3</b-button>
          <b-button>action1</b-button>
          <b-button>action2</b-button>
          <b-button>action3</b-button>
          <b-button>beat3枚以上</b-button>
          <b-button>try3枚以上</b-button>
          <b-button>action3枚以上</b-button>
        </b-card-text>
      </b-card>
      <b-card class="mb-2" title="ミラクル対象">
        <b-card-text>
          <b-button>相手単体</b-button>
          <b-button>相手複数体</b-button>
          <b-button>相手全体</b-button>
          <b-button>自身</b-button>
          <b-button>味方単体</b-button>
          <b-button>味方複数体</b-button>
          <b-button>味方全体</b-button>
          ここオプションで（防御バフ、攻撃バフえらばせてもよいかも）
        </b-card-text>
      </b-card>
      <b-card class="mb-2" title="声優">
        <b-card-text>
          <b-button>新</b-button>
          <b-button>NEXON</b-button>
          <b-button>アニメ１期</b-button>
          <b-button>アニメ２期</b-button>
          <b-button>アニメ１、２期</b-button>
          <b-button>舞台</b-button>
        </b-card-text>
      </b-card>
    </b-container>
    <h2 class="my-4">calcにてアコーディオンで非表示に出来るよう作ろうかと思ったときのサンプル</h2>
    <b-container role="tablist" class="mb-2">
      <b-card no-body>
        <b-card-header header-tag="header" class="p-0" role="tab">
          <b-button block v-b-toggle.accordion-1>Accordion のサンプル</b-button>
        </b-card-header>
        <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <b-card-text>
              I start opened because <code>visible</code> is <code>true</code>
            </b-card-text>
            <b-card-text>aaaaa</b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>
    </b-container>

    <h2 class="my-4">その他</h2>
    <b-container fluid>
      <link href="https://unpkg.com/pattern.css" rel="stylesheet" />
      <h1
        class="pattern-grid-sm text-pattern"
        style="background-color: mediumaquamarine;
        color: white;
        font-size: 600%;"
      >
        その他参考
      </h1>
      <hr class="pattern-diagonal-stripes-sm" style="height:1em;" />
      <div
        class="pattern-cross-dots-md"
        style="background-color: #FEF0BC;
        color: #DDB104;"
      >
        <pre>
        https://bansal.io/pattern-css#triangles
        test
        test
        test
        test
        test
        test
        </pre>
      </div>
    </b-container>
    <b-container fluid id="lined-paper">
      <h1>lined-paper</h1>
      <pre>
      https://leaverou.github.io/css3patterns/#lined-paper
      test
      test
      test
      test
      test
      test
      </pre>
    </b-container>
    <b-container fluid id="cross">
      <h1>cross</h1>
      <pre>
      https://leaverou.github.io/css3patterns/#cross
      test
      test
      test
      test
      test
      test
      </pre>
    </b-container>
  </b-container>
</template>

<script></script>

<style>
#lined-paper {
  background-color: #fff;
  background-image: linear-gradient(
      90deg,
      transparent 79px,
      #abced4 79px,
      #abced4 81px,
      transparent 81px
    ),
    linear-gradient(#eee 0.1em, transparent 0.1em);
  background-size: 100% 1.2em;
}
#cross {
  background: radial-gradient(
      circle,
      transparent 20%,
      slategray 20%,
      slategray 80%,
      transparent 80%,
      transparent
    ),
    radial-gradient(
        circle,
        transparent 20%,
        slategray 20%,
        slategray 80%,
        transparent 80%,
        transparent
      )
      50px 50px,
    linear-gradient(#a8b1bb 8px, transparent 8px) 0 -4px,
    linear-gradient(90deg, #a8b1bb 8px, transparent 8px) -4px 0;
  background-color: slategray;
  background-size: 100px 100px, 100px 100px, 50px 50px, 50px 50px;
}
</style>
