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
