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
            >
              サバンナ
            </b-button>
            <b-button
              @click="
                advFilterSelected(
                  '地形/時間特効(さばく)',
                  ['とくせい(変化前)', 'とくせい(変化後)'],
                  '(地形|ステージ)がさばくの(場合|とき)'
                )
              "
              class="table-attached-header-view-button"
            >
              さばく
            </b-button>
            <b-button
              @click="
                advFilterSelected(
                  '地形/時間特効(みずべ)',
                  ['とくせい(変化前)', 'とくせい(変化後)'],
                  '(地形|ステージ)がみずべの(場合|とき)'
                )
              "
              class="table-attached-header-view-button"
            >
              みずべ
            </b-button>
            <b-button
              @click="
                advFilterSelected(
                  '地形/時間特効(寒冷地)',
                  ['とくせい(変化前)', 'とくせい(変化後)'],
                  '(地形|ステージ)が寒冷地の(場合|とき)'
                )
              "
              class="table-attached-header-view-button"
            >
              寒冷地
            </b-button>
            <b-button
              @click="
                advFilterSelected(
                  '地形/時間特効(どうくつ)',
                  ['とくせい(変化前)', 'とくせい(変化後)'],
                  '(地形|ステージ)がどうくつの(場合|とき)'
                )
              "
              class="table-attached-header-view-button"
            >
              どうくつ
            </b-button>
            <b-button
              @click="
                advFilterSelected(
                  '地形/時間特効(ジャングル)',
                  ['とくせい(変化前)', 'とくせい(変化後)'],
                  '(地形|ステージ)がジャングルの(場合|とき)'
                )
              "
              class="table-attached-header-view-button"
            >
              ジャングル
            </b-button>
            <b-button
              @click="
                advFilterSelected(
                  '地形/時間特効(やま)',
                  ['とくせい(変化前)', 'とくせい(変化後)'],
                  '(地形|ステージ)がやまの(場合|とき)'
                )
              "
              class="table-attached-header-view-button"
            >
              やま
            </b-button>
            <b-button
              @click="
                advFilterSelected(
                  '地形/時間特効(夜)',
                  ['とくせい(変化前)', 'とくせい(変化後)'],
                  'ステージ(|の時間)が夜の(場合|とき)'
                )
              "
              class="table-attached-header-view-button"
            >
              夜
            </b-button>
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
