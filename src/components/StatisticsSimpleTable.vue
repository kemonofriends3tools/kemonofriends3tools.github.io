<template>
  <b-table-simple v-if="tableData.left" small striped hover class="mb-0">
    <b-tbody>
      <b-tr v-for="(left, index) of tableData.left" :key="index">
        <b-td class="vAlignMiddle">
          <template v-if="tableData.leftIsIcon">
            <TypeNameToIcon :type="tableData.left[index]" :imgRemSize="1.5" />
          </template>
          <template v-else>{{ tableData.left[index] }}</template>
        </b-td>
        <b-td v-if="tableData.right || tableData.rightList" class="vAlignMiddle text-right">
          <template v-if="tableData.right">{{ tableData.right[index] }}</template>
          <template v-if="tableData.rightList">
            <ul v-if="tableData.rightList[index].length <= 10" class="small m-0 p-0 list-unstyled">
              <li v-for="(i, listIndex) of tableData.rightList[index]" :key="i">
                {{ i }}
                <b-link
                  v-if="tableData.rightListUrls && 0 < tableData.rightListUrls[index].length"
                  :href="tableData.rightListUrls[index][listIndex]"
                  target="_blank"
                  rel="noopener"
                >
                  <i class="fas fa-external-link-alt" />
                </b-link>
              </li>
            </ul>
            <p v-else class="small mb-0">
              多数({{ tableData.rightList[index].length }}件)につき省略
            </p>
          </template>
        </b-td>
        <b-td v-if="tableData.rightPercentage" class="vAlignMiddle text-right small pl-0 pr-0">
          ({{ tableData.rightPercentage[index] }}%)
        </b-td>
        <b-td v-if="tableData.rightUrls" class="vAlignMiddle pr-0">
          <b-link :href="tableData.rightUrls[index]" target="_blank" rel="noopener">
            <i class="fas fa-external-link-alt" />
          </b-link>
        </b-td>
      </b-tr>
    </b-tbody>
  </b-table-simple>
</template>

<script>
import TypeNameToIcon from '@/components/TypeNameToIcon.vue';
export default {
  name: 'StatisticsSimpleTable',
  components: {
    TypeNameToIcon,
  },
  props: {
    tableData: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    //propsのチェック
    let leftLength = 0; //左要素数
    //左要素数取得。左要素が不正であった場合はtemplate最初のv-ifを通らないのでそれ以上細かく調べる必要はない。
    if (this.tableData.left && Array.isArray(this.tableData.left)) {
      //左要素数取得
      leftLength = this.tableData.left.length;

      ['right', 'rightList', 'rightListUrls', 'rightPercentage', 'rightUrls'].forEach(i => {
        //要素チェック
        //存在、配列、要素数を調べて駄目ならundefinedにする
        if (
          !this.tableData[i] ||
          !Array.isArray(this.tableData[i]) ||
          this.tableData[i].length < leftLength
        ) {
          this.tableData[i] = undefined;
        }
      });
      //右と右リストの要素数一致は問わない（右無し、右リスト有は許容）
      //右リストと右リストURLの要素数が一致するか確認する
      if (this.tableData.rightList && this.tableData.rightListUrls) {
        //事前にそれぞれ左要素数以上あることは確認しているが、厳密にチェックする
        if (this.tableData.rightList.length == this.tableData.rightListUrls.length) {
          this.tableData.rightList.forEach((i, index) => {
            if (i.length != this.tableData.rightListUrls[index].length) {
              //要素数が一致しない場合は右リストURL要素を空にする
              //（右リストURLの他の要素は表示できるよう、この要素のみ空配列とする）
              this.tableData.rightListUrls[index] = [];
            }
          });
        } else {
          //要素数不一致の場合は右リストURLを抹消する
          this.tableData.rightListUrls = undefined;
        }
      }
    }
  },
};
</script>

<style scoped>
.imgStyle {
  height: 1.8em;
}
.vAlignMiddle {
  vertical-align: middle;
}
</style>
