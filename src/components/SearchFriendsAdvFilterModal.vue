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
        <b-card
          class="mb-2"
          v-for="(advFilter, index1) in advFilterFriends"
          :key="advFilter.title"
          :title="advFilter.title"
          :sub-title="advFilter.subTitle"
        >
          <b-card-text>
            <b-button
              v-for="(data, index2) in advFilter.dataList"
              :key="data.labelFull"
              @click="advFilterSelected(index1, index2)"
              class="table-attached-header-view-button"
            >
              {{ data.labelShort }}
            </b-button>
          </b-card-text>
        </b-card>
      </b-container>
      <template v-slot:modal-footer>
        <b-button @click="advFilterSelected(undefined, undefined)">
          指定なし
        </b-button>
      </template>
    </b-modal>
  </span>
</template>

<script>
import advFilterFriends from '@/mixins/advFilterFriends.js';

export default {
  mixins: [advFilterFriends],
  name: 'SearchFriendsAdvFilterModal',
  methods: {
    //advFilterモーダル内ボタンクリック処理。親コンポーネントへの引き渡しとモーダルの非表示化。
    advFilterSelected(index1, index2) {
      this.$emit('advFilterSelected', index1, index2);
      this.$root.$emit('bv::hide::modal', 'modal-advFilter', '#btnAdvFilter');
    },
  },
};
</script>

<style scoped></style>
