<template>
  <span>
    <b-button v-b-modal.modal-advFilter ref="btnAdvFilter" class="align-baseline text-nowrap">
      <slot>特殊条件選択</slot>
    </b-button>
    <b-modal id="modal-advFilter" title="特殊検索" title-tag="h4" size="xl">
      <b-container fluid>
        <b-alert show variant="warning" class="small">
          指定できるのは以下から１つだけです。
        </b-alert>
        <b-card class="mb-2" title="地形/時間特効" sub-title="特定の地形/時間に特効をもつフレンズ">
          <b-card-text>
            <b-button
              @click="
                advFilterSelected(
                  '地形/時間特効(サバンナ)',
                  ['とくせい(変化前)', 'とくせい(変化後)'],
                  '(地形|ステージ)がサバンナの(場合|とき)'
                )
              "
              class="table-attached-header-view-button"
              >サバンナ</b-button
            >
            <b-button
              @click="
                advFilterSelected(
                  '地形/時間特効(さばく)',
                  ['とくせい(変化前)', 'とくせい(変化後)'],
                  '(地形|ステージ)がさばくの(場合|とき)'
                )
              "
              class="table-attached-header-view-button"
              >さばく</b-button
            >
            <b-button
              @click="
                advFilterSelected(
                  '地形/時間特効(みずべ)',
                  ['とくせい(変化前)', 'とくせい(変化後)'],
                  '(地形|ステージ)がみずべの(場合|とき)'
                )
              "
              class="table-attached-header-view-button"
              >みずべ</b-button
            >
            <b-button
              @click="
                advFilterSelected(
                  '地形/時間特効(寒冷地)',
                  ['とくせい(変化前)', 'とくせい(変化後)'],
                  '(地形|ステージ)が寒冷地の(場合|とき)'
                )
              "
              class="table-attached-header-view-button"
              >寒冷地</b-button
            >
            <b-button
              @click="
                advFilterSelected(
                  '地形/時間特効(どうくつ)',
                  ['とくせい(変化前)', 'とくせい(変化後)'],
                  '(地形|ステージ)がどうくつの(場合|とき)'
                )
              "
              class="table-attached-header-view-button"
              >どうくつ</b-button
            >
            <b-button
              @click="
                advFilterSelected(
                  '地形/時間特効(ジャングル)',
                  ['とくせい(変化前)', 'とくせい(変化後)'],
                  '(地形|ステージ)がジャングルの(場合|とき)'
                )
              "
              class="table-attached-header-view-button"
              >ジャングル</b-button
            >
            <b-button
              @click="
                advFilterSelected(
                  '地形/時間特効(やま)',
                  ['とくせい(変化前)', 'とくせい(変化後)'],
                  '(地形|ステージ)がやまの(場合|とき)'
                )
              "
              class="table-attached-header-view-button"
              >やま</b-button
            >
            <b-button
              @click="
                advFilterSelected(
                  '地形/時間特効(夜)',
                  ['とくせい(変化前)', 'とくせい(変化後)'],
                  'ステージ(|の時間)が夜の(場合|とき)'
                )
              "
              class="table-attached-header-view-button"
              >夜</b-button
            >
          </b-card-text>
        </b-card>
        <b-alert show variant="warning">
          開発用：以下は「指定なし」以外全てダミー。
        </b-alert>
        <b-card class="mb-2" title="地形/時間特効" sub-title="特定の地形に特効をもつフレンズ">
          <b-card-text>
            <b-button>みずべ</b-button>
            <b-button>寒冷地</b-button>
            <b-button>サバンナ</b-button>
            <b-button>さばく</b-button>
            <b-button>夜</b-button>
          </b-card-text>
        </b-card>
        <b-card class="mb-2" title="地形/時間特効" sub-title="特定の地形に特効をもつフレンズ">
          <b-card-text>
            <b-button-group>
              <b-button>みずべ</b-button>
              <b-button>寒冷地</b-button>
              <b-button>サバンナ</b-button>
              <b-button>どうくつ</b-button>
            </b-button-group>
            <b-button>夜</b-button>
          </b-card-text>
        </b-card>
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
        <b-card class="mb-2" title="最大けも級">
          <b-card-text>
            <b-button>5</b-button>
            <b-button>6</b-button>
          </b-card-text>
        </b-card>
        <b-card class="mb-2" title="最大フォトポケ数">
          <b-card-text>
            <b-button>8</b-button>
            <b-button>12</b-button>
          </b-card-text>
        </b-card>
        <b-card class="mb-2" title="最大野生解放数">
          <b-card-text>
            <b-button>4</b-button>
            <b-button>5</b-button>
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
      <template v-slot:modal-footer>
        <b-button @click="advFilterSelected('', '', '')">
          指定なし
        </b-button>
      </template>
    </b-modal>
  </span>
</template>

<script>
export default {
  name: 'SearchPhotoAdvFilterModal',
  methods: {
    //advFilterモーダル内ボタンクリック処理。親コンポーネントへの引き渡しとモーダルの非表示化。
    advFilterSelected(label, columns, regex) {
      this.$emit('advFilterSelected', label, columns, regex);
      this.$root.$emit('bv::hide::modal', 'modal-advFilter', '#btnAdvFilter');
    },
  },
};
</script>

<style scoped></style>
