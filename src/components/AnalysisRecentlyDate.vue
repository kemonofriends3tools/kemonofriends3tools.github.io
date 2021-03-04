<template>
  <b-container>
    <b-card class="mb-2" title="直近の入手機会が最も古いフレンズ">
      <b-alert show variant="info" class="small">
        日付ベースで考えてると、現在最も入手が難しいフレンズとも言えます。<br />
        実用としてはこれが上位のフレンズは（特段の理由が無い限り）近く復刻されるのでは？と予想されます。
      </b-alert>
      <vue-good-table
        compactMode
        :rows="RecentlyDateRows"
        :columns="tableColumns"
        :row-style-class="rowStyleClassFn"
        :sort-options="{
          enabled: true,
          initialSortBy: { field: '実装日', type: 'desc' },
        }"
        styleClass="vgt-table bordered condensed"
        :pagination-options="{
          enabled: true,
          perPage: 10,
          position: 'both',
          nextLabel: '次',
          prevLabel: '前',
          rowsPerPageLabel: 'ページあたりの表示件数',
          ofLabel: '/',
          allLabel: '全て',
        }"
      >
        <template v-slot:table-column="props">
          {{ props.column.label }}
          <!-- resizable table用のハンドル。それとここの親であるthにposition:relativeを入れる必要があるが、.vgt-table thにて既にそう定義されているようなので特に何もしない。 -->
          <div class="resizableTableHandle" @mousedown="resizableTableEventHandler($event)">
            &nbsp;
          </div>
        </template>
        <div slot="emptystate">
          <b-alert show variant="warning">
            何らかの理由によりデータが見つかりません。
          </b-alert>
        </div>
      </vue-good-table>
    </b-card>
  </b-container>
</template>

<script>
export default {
  name: 'AnalysisRecentlyDate',
  props: {
    RecentlyDateRows: Object,
  },
};
</script>

<style scoped></style>
