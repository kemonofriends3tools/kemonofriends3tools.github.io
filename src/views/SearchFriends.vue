<template>
  <b-container fluid class="mt-2">
    <h1>フレンズ検索</h1>
    <b-alert show variant="warning" class="d-block d-sm-none mb-0 small">
      画面幅が狭いので、操作性の観点から一部絞り込み機能を省略しています(全文検索で代用は可能です)。<br />
      スマホの場合、横画面にすればすべての機能が利用できるようになります。
    </b-alert>

    <b-container fluid>
      <div class="text-right">
        <b-button v-b-toggle.collapse1.collapse2.collapse3 variant="info">
          <b-icon
            class="align-text-bottom mx-1"
            icon="question-circle-fill"
            variant="light"
          />使い方
        </b-button>
      </div>
      <div>
        <div class="table-attached-header">
          <b-container fluid>
            <b-row class="align-items-baseline">
              <b-col cols="12">
                <b-collapse id="collapse1">
                  <b-alert show variant="info" class="small mb-1">
                    １：特殊条件による絞り込みをしたい場合はここで指定してデータを絞り込みます。尚、ここで条件を選択するとデータ量が減るので後の動作が軽くなります。
                  </b-alert>
                </b-collapse>
              </b-col>
              <b-col class="pl-0 pr-4 font-weight-bold flex-grow-0 text-nowrap">
                <b-icon
                  class="table-attached-header-icon"
                  icon="funnel"
                  variant="dark"
                  font-scale="1.5"
                />
                特殊条件
              </b-col>
              <b-col cols="12" sm="auto" class="pl-4">
                <template v-if="advFilter.label">
                  {{ advFilter.label }}
                </template>
                <template v-else>
                  指定なし
                </template>
              </b-col>
              <b-col class="pl-4 flex-grow-0">
                <SearchFriendsAdvFilterModal @advFilterSelected="setAdvFilter">
                  特殊条件選択
                </SearchFriendsAdvFilterModal>
              </b-col>
            </b-row>
          </b-container>
        </div>
        <div class="table-attached-header">
          <div class="d-none d-sm-block">
            <b-icon class="table-attached-header-icon" icon="eye" variant="dark" font-scale="1.5" />
          </div>
          <b-container fluid>
            <b-row class="d-block d-sm-none">
              <b-col cols="12" class="mt-2 p-0" sytle="margin-left: -24px">
                <b-icon
                  class="table-attached-header-icon"
                  icon="eye"
                  variant="dark"
                  font-scale="1.5"
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12">
                <b-collapse id="collapse2">
                  <b-alert show variant="info" class="small mb-1">
                    ２：下の表の表示列を切り替えます。<br />
                    表示列を切り替えるだけなので、ここを触ってもデータ行数が変化することはありません。ただしここの選択は３の『表内検索』と深く関係しています。<br />
                    ３の『表内検索』はここで表示させたものが検索対象となります。なので”とくいわざ”や”たいきスキル”の中身だけを厳密に検索したい場合は『その他詳細・個別カラム表示』から”とくいわざ詳細”や”たいきスキル詳細”を利用して下さい。
                  </b-alert>
                </b-collapse>
                <b-alert show variant="warning" class="mt-2 mb-0 px-2 small">
                  表示を増やすとそれだけ重くなります。選択をリセットしたい場合はページをリロードして下さい。
                </b-alert>
              </b-col>
            </b-row>
            <b-row
              v-for="[key, value] of new Map([
                ['基本', ['属性', '初期けも級', 'フォトポケ', '野生解放']],
                ['ステータス(Lv)', null],
                ['ステータス(他)', ['回避', 'プラズム', 'フラッグ補正', 'フラッグ']],
                ['技・特性', ['ミラクル', 'とくいわざ', 'たいきスキル', 'とくせい/キセキとくせい']],
                ['その他', ['CV', '実装日', '備考']],
              ])"
              :key="key"
              class="align-items-center search-option-grid m-1 px-1"
            >
              <b-col cols="12" sm="2" xl="1" class="p-0 font-weight-bold">{{ key }}</b-col>
              <b-col class="d-flex flex-wrap">
                <template v-if="key == 'ステータス(Lv)'">
                  <b-select
                    v-model.number="selectedLevel"
                    :options="selectLevelOptions"
                    @change="selectLevelSelected"
                    style="width:5.5rem"
                    required
                  />
                  <div v-for="(i, index) of levelStatusColumns" :key="key + index">
                    <b-button
                      v-show="!i.hidden"
                      variant="secondary"
                      @click="setLevelStatusColumnHidden(i.name, index)"
                      class="table-attached-header-view-button"
                    >
                      {{ i.name }}
                    </b-button>
                    <b-button
                      v-show="i.hidden"
                      variant="outline-secondary"
                      @click="setLevelStatusColumnHidden(i.name, index)"
                      class="table-attached-header-view-button"
                    >
                      {{ i.name }}
                    </b-button>
                  </div>
                </template>
                <template v-else>
                  <div v-for="i of value" :key="key + i">
                    <b-button
                      v-show="!columns[columnsIndex.get(i)].hidden"
                      variant="secondary"
                      @click="
                        $set(
                          columns[columnsIndex.get(i)],
                          'hidden',
                          !columns[columnsIndex.get(i)].hidden
                        )
                      "
                      class="table-attached-header-view-button"
                    >
                      {{ columns[columnsIndex.get(i)].label }}
                    </b-button>
                    <b-button
                      v-show="columns[columnsIndex.get(i)].hidden"
                      variant="outline-secondary"
                      @click="
                        $set(
                          columns[columnsIndex.get(i)],
                          'hidden',
                          !columns[columnsIndex.get(i)].hidden
                        )
                      "
                      class="table-attached-header-view-button"
                    >
                      {{ columns[columnsIndex.get(i)].label }}
                    </b-button>
                  </div>
                </template>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="text-right my-2">
                <b-button v-b-toggle.advancedColumns variant="info" class="debugButton">
                  その他詳細・個別カラム表示
                </b-button>
              </b-col>
            </b-row>
            <b-collapse id="advancedColumns" class="py-1 px-4 border border-info rounded">
              <b-row
                class="align-items-center search-option-grid"
                v-for="(i, index) of [
                  ['Beat補正', 'Try補正', 'Action補正'],
                  ['flag1', 'flag2', 'flag3', 'flag4', 'flag5'],
                  ['ミラクル名', 'MP', 'ミラクル+', 'ミラクルlv5'],
                  ['とくいわざ名', 'とくいわざ詳細', 'たいきスキル名', 'たいきスキル詳細'],
                  ['とくせい名', 'とくせい詳細', 'キセキとくせい名', 'キセキとくせい詳細'],
                ]"
                :key="'advancedColumns- ' + index"
              >
                <b-col class="d-flex flex-wrap px-0">
                  <div v-for="(j, jindex) of i" :key="'advancedColumnContents-' + jindex">
                    <b-button
                      v-show="!columns[columnsIndex.get(j)].hidden"
                      variant="secondary"
                      @click="
                        $set(
                          columns[columnsIndex.get(j)],
                          'hidden',
                          !columns[columnsIndex.get(j)].hidden
                        )
                      "
                      class="table-attached-header-view-button"
                    >
                      {{ columns[columnsIndex.get(j)].label }}
                    </b-button>
                    <b-button
                      v-show="columns[columnsIndex.get(j)].hidden"
                      variant="outline-secondary"
                      @click="
                        $set(
                          columns[columnsIndex.get(j)],
                          'hidden',
                          !columns[columnsIndex.get(j)].hidden
                        )
                      "
                      class="table-attached-header-view-button"
                    >
                      {{ columns[columnsIndex.get(j)].label }}
                    </b-button>
                  </div>
                </b-col>
              </b-row>
            </b-collapse>
          </b-container>
        </div>
        <div class="table-attached-header">
          <div>
            <b-icon
              class="table-attached-header-icon"
              icon="search"
              variant="dark"
              font-scale="1.5"
            />
          </div>
          <div class="table-attached-header-contents w-100">
            <b-row class="w-100">
              <b-col cols="12">
                <b-collapse id="collapse3">
                  <b-alert show variant="info" class="small mb-1">
                    ３：表内検索を行います。
                    <ul class="pl-4 mb-0">
                      <li>
                        これは<span class="font-weight-bold"
                          >現在表内に表示されている各項目を対象に</span
                        >、入力された文字列でデータ行の絞り込みを行います。<br />
                        注意してほしいのは検索対象は<span class="font-weight-bold"
                          >現在表に表示されている項目だけ</span
                        >という点です。例えばたいきスキルに”くらくら”を持つフレンズが居たとしても、２で”たいきスキル”や”たいきスキル詳細”列を表示させていないとHITしません。つまり２の表示／非表示で検索対象列を指定することが出来ます。
                      </li>
                      <li>
                        半角または全角スペースで区切るとAND条件で複数キーワードによる検索することが出来ます。<br />
                        検索は各データ行中の各項目単位で判定されます。つまりキーワード１が"とくいわざ"に<span
                          class="font-weight-bold"
                          >のみ</span
                        >、キーワード２が"たいきスキル"に<span class="font-weight-bold">のみ</span
                        >存在する場合、この行には両方のキーワード満たす項目が１つも存在しなかったと判定され、そのデータ行は非表示となります。<br />
                        "とくせい/キセキとくせい"のように1項目に複数の項目がまとまっている場合は"とくせい"と"キセキとくせい"を同時に検索することが出来ます。
                      </li>
                    </ul>
                  </b-alert>
                </b-collapse>
              </b-col>
            </b-row>
            <b-row class="w-100">
              <b-col cols="12" class="pr-0">
                <b-form-input
                  class="vgt-input input-externalQuery my-1"
                  v-model="globalSearchTerm"
                  placeholder="表内検索"
                  type="search"
                  debounce="500"
                />
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
      <vue-good-table
        compactMode
        :rows="filterdFriends"
        :columns="columns"
        :row-style-class="rowStyleClassFn"
        :search-options="{
          enabled: false,
          skipDiacritics: true,
          searchFn: globalSearch,
          externalQuery: globalSearchTerm,
        }"
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
        <template v-slot:column-filter="{ column, updateFilters }">
          <template v-if="column.label == '属性'">
            <TypeSelectModalFriends
              @typeFriendsSelected="
                value => {
                  typeFilter = value;
                  updateFilters(column, value);
                }
              "
            >
              <TypeNameToIcon :type="typeFilter" :imgRemSize="1.8" />
            </TypeSelectModalFriends>
          </template>
        </template>
        <template v-slot:table-row="props">
          <!-- カラム表示に関することなので基本的にprops.column.label (not field)と比較することとする。 -->
          <template v-if="props.column.label == '属性'">
            <TypeNameToIcon :type="props.row.属性" :imgRemSize="1.8" />
          </template>
          <template v-else-if="props.column.label == '回避'">
            <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
              {{ props.row[props.column.field + 'Formatted'] }}
            </text-highlight>
          </template>
          <template v-else-if="props.column.label == 'フラッグ補正'">
            <p
              v-for="i of ['Beat補正', 'Try補正', 'Action補正']"
              :class="getFlagCorrectionColumnClass('m-0 text-right', i)"
              :key="'flagCorrection' + i"
            >
              {{ i.substring(0, 1).toUpperCase() + i.substring(1) }} :
              <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
                {{ props.row[i + 'Formatted'] }}
              </text-highlight>
            </p>
          </template>
          <template v-else-if="props.column.label == 'フラッグ'">
            <div v-for="i of ['1', '2', '3', '4', '5']" :key="'flag' + i">
              <p :class="getFlagCorrectionColumnClass('m-0', props.row['flag' + i])">
                <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
                  {{ props.row['flag' + i] }}
                </text-highlight>
              </p>
            </div>
          </template>
          <template v-else-if="props.column.label == 'ミラクル'">
            <p class="font-weight-bold m-0">
              <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
                {{ props.row.ミラクル名 }}
              </text-highlight>
            </p>
            <p class="m-0 pl-2">
              MP:
              <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
                {{ props.row.MP }}
              </text-highlight>
              <span
                :class="getFlagCorrectionColumnClass('pr-3', props.row['ミラクル+'])"
                style="padding-left:0.5rem;"
              >
                <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
                  {{ props.row['ミラクル+'] }}
                </text-highlight>
              </span>
              Lv.5
            </p>
            <p class="preText m-0 pl-2">
              <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
                {{ props.row.ミラクルlv5 }}
              </text-highlight>
            </p>
          </template>
          <template v-else-if="props.column.label == 'とくいわざ'">
            <p class="font-weight-bold m-0">
              <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
                {{ props.row.とくいわざ名 }}
              </text-highlight>
            </p>
            <p class="preText m-0 pl-2">
              <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
                {{ props.row.とくいわざ詳細 }}
              </text-highlight>
            </p>
          </template>
          <template v-else-if="props.column.label == 'たいきスキル'">
            <p class="font-weight-bold m-0">
              <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
                {{ props.row.たいきスキル名 }}
              </text-highlight>
            </p>
            <p class="preText m-0 pl-2">
              <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
                {{ props.row.たいきスキル詳細 }}
              </text-highlight>
            </p>
          </template>
          <template v-else-if="props.column.label == 'とくせい/キセキとくせい'">
            <p class="font-weight-bold m-0">
              <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
                {{ props.row.とくせい名 }}
              </text-highlight>
            </p>
            <p class="preText m-0 pl-2">
              <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
                {{ props.row.とくせい詳細 }}
              </text-highlight>
            </p>
            <hr class="multiLine_hr" />
            <p class="font-weight-bold m-0">
              <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
                {{ props.row.キセキとくせい名 }}
              </text-highlight>
            </p>
            <p class="preText m-0 pl-2">
              <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
                {{ props.row.キセキとくせい詳細 }}
              </text-highlight>
            </p>
          </template>
          <template
            v-else-if="['Beat補正', 'Try補正', 'Action補正'].some(i => i == props.column.label)"
          >
            <!-- ここも背景色を変えるが、値に入っているのは数値のみなのでgetFlagCorrectionColumnClassにはfield名を渡す。頭文字判定なので問題ない。 -->
            <p :class="getFlagCorrectionColumnClass('m-0 text-right', props.column.field)">
              <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
                {{ props.row[props.column.field + 'Formatted'] }}
              </text-highlight>
            </p>
          </template>
          <template
            v-else-if="
              ['フラッグ1', 'フラッグ2', 'フラッグ3', 'フラッグ4', 'フラッグ5', 'ミラクル+'].some(
                i => i == props.column.label
              )
            "
          >
            <!-- フラッグ1-5のfield名は"flag"なので表示にはprops.column.fieldを利用する。ミラクル+は同一だが処理は共通なのでここに置く。 -->
            <p :class="getFlagCorrectionColumnClass('m-0', props.row[props.column.field])">
              <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
                {{ props.row[props.column.field] }}
              </text-highlight>
            </p>
          </template>
          <template
            v-else-if="
              [
                'ミラクル (Lv.5)',
                'とくいわざ詳細',
                'たいきスキル詳細',
                'とくせい詳細',
                'キセキとくせい詳細',
              ].some(i => i == props.column.label)
            "
          >
            <!-- これらは複数行になりうる。複数行クラスを適用する。 -->
            <p class="preText m-0">
              <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
                {{ props.row[props.column.field] }}
              </text-highlight>
            </p>
          </template>
          <template v-else>
            <text-highlight :queries="getGlobalSearchTermArray" :caseSensitive="false">
              {{ props.formattedRow[props.column.field] }}
            </text-highlight>
          </template>
        </template>
        <div slot="emptystate">
          <b-alert show variant="warning">
            該当するフレンズがいません。
          </b-alert>
        </div>
      </vue-good-table>
    </b-container>
  </b-container>
</template>

<script>
import friendsJson from '../json/friends.json';
import SearchFriendsAdvFilterModal from '@/components/SearchFriendsAdvFilterModal.vue';
import TypeSelectModalFriends from '@/components/TypeSelectModalFriends.vue';
import TypeNameToIcon from '@/components/TypeNameToIcon.vue';
import resizableTable from '@/mixins/resizableTable.js';

export default {
  mixins: [resizableTable],
  name: 'SearchFriends',
  components: {
    SearchFriendsAdvFilterModal,
    TypeSelectModalFriends,
    TypeNameToIcon,
  },
  data() {
    return {
      columns: [
        {
          field: '名前',
          label: '名前',
          sortable: true,
          filterOptions: {
            enabled: true,
            placeholder: 'フレンズ名',
          },
        },
        {
          field: '属性',
          label: '属性',
          sortable: true,
          hidden: false,
          tdClass: 'text-center',
          filterOptions: {
            //何故かfilterOptionsが無いとcustom filterが動作しなかったので空作成
            //customFilterは特に何も使ってない。
            customFilter: true,
          },
        },
        {
          field: '初期けも級',
          label: '初期けも級',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: false,
          filterOptions: {
            enabled: true,
            placeholder: '初期けも級',
            filterDropdownItems: [2, 3, 4],
          },
        },
        {
          field: 'フォトポケ',
          label: '最大フォトポケ',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          filterOptions: {
            enabled: true,
            placeholder: '最大フォトポケ',
            filterDropdownItems: [8, 12],
          },
        },
        {
          field: '野生解放',
          label: '最大野生解放',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          filterOptions: {
            enabled: true,
            placeholder: '最大野生解放',
            filterDropdownItems: [4, 5],
          },
        },
        {
          field: '70けもステ',
          label: 'けもステ',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '70体力',
          label: '体力',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '70攻撃',
          label: '攻撃',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '70守り',
          label: '守り',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '90けもステ',
          label: 'けもステ',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '90体力',
          label: '体力',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '90攻撃',
          label: '攻撃',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '90守り',
          label: '守り',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '99けもステ',
          label: 'けもステ',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '99体力',
          label: '体力',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '99攻撃',
          label: '攻撃',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '99守り',
          label: '守り',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '回避',
          label: '回避',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
        },
        {
          field: 'プラズム',
          label: 'プラズム',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: 'フラッグ補正',
          label: 'フラッグ補正',
          sortable: false,
          hidden: true,
        },
        {
          field: 'Beat補正',
          label: 'Beat補正',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
        },
        {
          field: 'Try補正',
          label: 'Try補正',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
        },
        {
          field: 'Action補正',
          label: 'Action補正',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
        },
        {
          field: 'フラッグ',
          label: 'フラッグ',
          sortable: false,
          hidden: true,
        },
        {
          field: 'flag1',
          label: 'フラッグ1',
          sortable: false,
          hidden: true,
        },
        {
          field: 'flag2',
          label: 'フラッグ2',
          sortable: false,
          hidden: true,
        },
        {
          field: 'flag3',
          label: 'フラッグ3',
          sortable: false,
          hidden: true,
        },
        {
          field: 'flag4',
          label: 'フラッグ4',
          sortable: false,
          hidden: true,
        },
        {
          field: 'flag5',
          label: 'フラッグ5',
          sortable: false,
          hidden: true,
        },
        {
          field: 'ミラクル',
          label: 'ミラクル',
          sortable: false,
          hidden: true,
        },
        {
          field: 'ミラクル名',
          label: 'ミラクル名',
          sortable: false,
          hidden: true,
        },
        {
          field: 'MP',
          label: 'MP',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: 'ミラクル+',
          label: 'ミラクル+',
          sortable: false,
          hidden: true,
          filterOptions: {
            enabled: true,
            placeholder: 'ミラクル+',
            filterDropdownItems: ['Beat', 'Action', 'Try'],
          },
        },
        {
          field: 'ミラクルlv5',
          label: 'ミラクル (Lv.5)',
          sortable: false,
          hidden: true,
        },
        {
          field: 'とくいわざ',
          label: 'とくいわざ',
          sortable: false,
          hidden: true,
        },
        {
          field: 'とくいわざ名',
          label: 'とくいわざ名',
          sortable: false,
          hidden: true,
        },
        {
          field: 'とくいわざ詳細',
          label: 'とくいわざ詳細',
          sortable: false,
          hidden: true,
        },
        {
          field: 'たいきスキル',
          label: 'たいきスキル',
          sortable: false,
          hidden: true,
        },
        {
          field: 'たいきスキル名',
          label: 'たいきスキル名',
          sortable: false,
          hidden: true,
        },
        {
          field: 'たいきスキル詳細',
          label: 'たいきスキル詳細',
          sortable: false,
          hidden: true,
        },
        {
          field: 'とくせい/キセキとくせい',
          label: 'とくせい/キセキとくせい',
          sortable: false,
          hidden: true,
        },
        {
          field: 'とくせい名',
          label: 'とくせい名',
          sortable: false,
          hidden: true,
        },
        {
          field: 'とくせい詳細',
          label: 'とくせい詳細',
          sortable: false,
          hidden: true,
        },
        {
          field: 'キセキとくせい名',
          label: 'キセキとくせい名',
          sortable: false,
          hidden: true,
        },
        {
          field: 'キセキとくせい詳細',
          label: 'キセキとくせい詳細',
          sortable: false,
          hidden: true,
        },
        {
          field: 'CV',
          label: 'CV',
          sortable: true,
          hidden: true,
          filterOptions: {
            enabled: true,
            placeholder: 'CV名',
          },
        },
        {
          label: '実装日',
          field: '実装日',
          sortable: true,
          hidden: false,
          type: 'date',
          dateInputFormat: 'yyyyMMdd',
          dateOutputFormat: 'yyyy/MM/dd',
          filterOptions: {
            enabled: false,
            placeholder: '実装日',
          },
        },
        {
          field: '備考',
          label: '備考',
          sortable: true,
          filterOptions: {
            enabled: true,
            placeholder: '備考',
          },
        },
      ],
      //columns配列についてfield名からindexを引くためのMap()。初期化はbeforeMountにて。
      columnsIndex: new Map(),
      //ステータス表示関係
      selectedLevel: 70,
      selectLevelOptions: [
        { value: 70, text: 'Lv.70' },
        { value: 90, text: 'Lv.90' },
        { value: 99, text: 'Lv.99' },
      ],
      levelStatusColumns: [
        { name: 'けもステ', hidden: true },
        { name: '体力', hidden: true },
        { name: '攻撃', hidden: true },
        { name: '守り', hidden: true },
      ],
      //フレンズのマスターデータ。内容はfriendsJsonと同等だがjson時の一部省略記法を復元している。詳細は初期化しているmounted参照。
      masterFriends: null,
      //その他ページ内で使用している変数。不要かもしれないが初期値絡みの面倒を避けるため一応定義しておく。
      globalSearchTerm: '',
      advFilter: {
        label: '',
        columns: '',
        regex: '',
      },
      typeFilter: '',
    };
  },
  computed: {
    //tableにセットする実データを作り出す(computedなのでキャッシュが効き、パラメータに変化があった場合のみ再計算される)。
    //masterFriendsを特殊条件でフィルタリングして作る。
    filterdFriends() {
      if (this.advFilter.label) {
        //filter()はmasterFriendsを１行ずつチェックし、合格した行のみを集めたオブジェクトを新たに生成して返す。
        //some()は配列の各要素に対してループし、コールバック関数が１つでもtrueを返せばsome()自身もtrueを返す。
        //これを組み合わせ、指定カラムのうちどれか１つが正規表現に合格するフレンズのみを抽出している。
        return this.masterFriends.filter(row =>
          this.advFilter.columns.some(col => row[col].match(this.advFilter.regex))
        );
      } else {
        return this.masterFriends;
      }
    },
    //検索文字列を半角または全角スペースでsplitし、表内検索やvue-text-hightlight等で使いやすい形式（正規表現の配列）に直して返す。
    //複数個所で利用しているのでキャッシュの効くcomputedとして提供する。
    getGlobalSearchTermArray() {
      //検索文字列配列を取得する。
      //tirmで前後空白を除き、正規表現の特殊文字をエスケープ、半または全角スペースでsplitする。
      //全角スペースをソースに直で書くとlintでエラーになるので文字コードで指定する。
      let queries = this.globalSearchTerm
        .trim()
        .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
        .split(/[\x20\u3000]/);

      //検索文字列配列から空文字要素を排除する（空文字要素があるとvue-text-hightlight内のロジックでフリーズする模様）。ページロード時などにそういう配列が生まれることがある。
      queries = queries.filter(i => i != '');

      //戻り値となる正規表現配列を定義する。
      const regex = [];
      //検索文字列が空（queriesの長さが１かつ空白）の場合は処理しない（vue-text-hightlight内のロジック絡みでフリーズする模様）
      //RegExpのコンストラクタに不正な正規表現を入れると例外がおきるが、先にエスケープしているので例外はおきないものとする。今後正規表現検索に対応したりする場合は例外を考慮のこと。
      //'i'オプションにより大文字小文字を区別しない。これによりbeatでBeatにHitするようになる。
      if (queries.length) {
        queries.forEach(i => regex.push(new RegExp(i, 'i')));
      }
      return regex;
    },
  },
  methods: {
    //vue-good-tableデータ生出力用formatter
    formatFnRaw(v) {
      return v;
    },
    //vue-good-table用numberカラムのsort用function
    //デフォルトのsortだと上のformatFnRawの影響か、空欄があったときにそこでソートが分割されてしまう。なので、空欄は0とみなし、正常にsortが行えるようにする。
    numberColumnSortFn(x, y) {
      const ix = x == '' ? 0 : x;
      const iy = y == '' ? 0 : y;
      return ix < iy ? -1 : ix > iy ? 1 : 0;
    },
    //表内検索。第4引数はglobalSearchTermだが使ってないので省略。
    globalSearch(row, col, cellValue) {
      //colがhiddenの場合は探索しない
      if (col['hidden']) return false;

      //代替検索カラム配列
      //現在のカラムが結合カラムや別に表示用カラム（formattedカラム）がある場合、これにカラム名を入れ、
      //検索は現在のカラムではなく別カラム群を検索対象とする。
      let altTargetColumns = null;

      //先に結合カラム関連から処理し、最後にformattedカラム関連を処理する。
      if (col.label == 'フラッグ補正') {
        altTargetColumns = ['Beat補正Formatted', 'Try補正Formatted', 'Action補正Formatted'];
      } else if (col.label == 'フラッグ') {
        altTargetColumns = ['flag1', 'flag2', 'flag3', 'flag4', 'flag5'];
      } else if (col.label == 'ミラクル') {
        altTargetColumns = ['ミラクル名', 'MP', 'ミラクル+', 'ミラクルlv5'];
      } else if (col.label == 'とくいわざ') {
        altTargetColumns = ['とくいわざ名', 'とくいわざ詳細'];
      } else if (col.label == 'たいきスキル') {
        altTargetColumns = ['たいきスキル名', 'たいきスキル詳細'];
      } else if (col.label == 'とくせい/キセキとくせい') {
        altTargetColumns = ['とくせい名', 'とくせい詳細', 'キセキとくせい名', 'キセキとくせい詳細'];
      } else if (['回避', 'Beat補正', 'Try補正', 'Action補正'].some(i => i == col.label)) {
        //formattedカラム関連。
        //処理はいずれも同じで対象カラムならfield名の後ろに'Formatted'を加える。
        altTargetColumns = [col.field + 'Formatted'];
      }

      //検索対象文字列定義
      let tmpCellString;

      //代替検索カラム配列をもとに検索対象文字列を作り出す
      if (altTargetColumns) {
        //代替検索必要
        //配列にて示された各セル値を結合して検索対象文字列とする。
        altTargetColumns.forEach(i => (tmpCellString = tmpCellString + row[i].toString() + '\r\n'));
      } else {
        //代替検索不要
        //検索対象文字列はセル値
        tmpCellString = cellValue.toString();
      }

      //検索条件（正規表現配列）で検索対象文字列をテストする。
      //and条件としたいのでevery()を用いる。(every()は全要素がテストに合格するか判断する)
      return this.getGlobalSearchTermArray.every(i => i.test(tmpCellString));
    },

    //advFilterボタンが押された時にこれを通してadvFilterに値をセットする。
    //regexは前後の/は不要。^や$などは使用可。
    setAdvFilter(label, columns, regex) {
      this.advFilter.label = label;
      this.advFilter.columns = columns;
      this.advFilter.regex = regex;
    },

    //行class生成
    rowStyleClassFn(row) {
      if (row.属性 === 'ファニー') return 'row-funny';
      if (row.属性 === 'フレンドリー') return 'row-friendly';
      if (row.属性 === 'リラックス') return 'row-relax';
      if (row.属性 === 'ラブリー') return 'row-lovely';
      if (row.属性 === 'アクティブ') return 'row-active';
      if (row.属性 === 'マイペース') return 'row-mypace';
      return '';
    },

    //レベルselectを変更したときの動作。新しく選択したレベルはボタン表示に合わせ、残りの非選択レベルは全て非表示にする。
    selectLevelSelected() {
      for (const i of this.selectLevelOptions) {
        for (const j of this.levelStatusColumns) {
          //対象fieldが現在selectにて選択されているレベルかどうかに応じて代入する値を変える。
          //選択レベルの場合：表示用ボタンが参照するlevelStatusColumnsの値に合わせる。
          //選択レベルでない場合：一律true(非表示)とする。
          const tmpValue = i.value == this.selectedLevel ? j.hidden : true;
          //columnsにセット。columnsIndexから対象Fieldのindexを取得している。
          this.$set(this.columns[this.columnsIndex.get(i.value + j.name)], 'hidden', tmpValue);
        }
      }
    },
    //['けもステ', '体力', '攻撃', '守り']ボタンを押したときの動作。ボタン自体の表示制御の他、columnsのhiddenを切り替えて回る。
    setLevelStatusColumnHidden(columnLabel, index) {
      //ボタン表示反転(dataが変更を検知できるよう$setで変更する。この動作は他の@clickでやってることと同じ。)
      this.$set(this.levelStatusColumns[index], 'hidden', !this.levelStatusColumns[index].hidden);
      //columns以下のhiddenを変更して回る
      for (const i of this.selectLevelOptions) {
        //対象fieldが現在selectにて選択されているレベルかどうかに応じて代入する値を変える。
        //選択レベルの場合：上にて既に変更した最新のボタン表示を反映させる。
        //選択レベルでない場合：一律true(非表示)とする。
        const tmpValue =
          i.value == this.selectedLevel ? this.levelStatusColumns[index].hidden : true;
        //columnsにセット。columnsIndexから対象Fieldのindexを取得している。
        this.$set(this.columns[this.columnsIndex.get(i.value + columnLabel)], 'hidden', tmpValue);
      }
    },

    //フラッグ関係カラムに使用する背景色classを取得する
    //['beat', 'try', 'action']などの文字列が来ることを想定し、頭1文字で判定して対応するclassを返す。
    //第一引数では背景色以外に適用したいクラスを受け付けている。
    getFlagCorrectionColumnClass(otherClassesStr, i) {
      let tmpFlag = '';
      if (i.match(/^b/i)) {
        tmpFlag = 'beat';
      } else if (i.match(/^a/i)) {
        tmpFlag = 'action';
      } else if (i.match(/^t/i)) {
        tmpFlag = 'try';
      }
      return otherClassesStr + ' color-' + tmpFlag;
    },
  },
  beforeMount() {
    //columnsIndexを初期化。
    //columnsIndexはtemplateにてcolumns[columnsIndex.get(i)].labelなどと参照されているが、columnsIndexの初期化が遅いと空であり、参照エラーになってしまう。
    //そのためpage描画が始まる前（elementがマウントされる前）であるここbeforeMountにて初期化を行う。
    this.columns.forEach((i, j) => this.columnsIndex.set(i.field, j));

    //masterFriends初期化
    //こちらもmountedに置くとmasterFriendsがまだnullのときにアクセスされてコンソールにエラーが出るのでここで初期化する。
    this.masterFriends = friendsJson;
    //省略記入されたカラムを表示に適した正しい文字列に復元してゆく。
    //元の値はそのまま残しつつ"Formatted"を付加したプロパティを別に作成する方法と、直接上書きしてしまう方法の２パターンが考えられる。
    //前者の利点は出力が"+1.0%"のような文字列であってもカラムのソートでは元fieldを参照することにより正しくソートができること。
    //前者の欠点は表のglobalSearchにおいて特殊処理を強いられること。
    //カラムによってどちらを使用するかは使い分ける。
    this.masterFriends.forEach(i => {
      //回避、フラッグ補正値関係。元の値を残す"Formatted"処理型。処理が同じなのでまとめる。
      ['回避', 'Beat補正', 'Try補正', 'Action補正'].forEach(
        j =>
          (i[j + 'Formatted'] =
            new Intl.NumberFormat('ja', {
              style: 'decimal',
              signDisplay: 'always',
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            }).format(i[j]) + '%')
      );
      //フラッグ関係。単純上書き型。処理が同じなのでまとめる。
      ['flag1', 'flag2', 'flag3', 'flag4', 'flag5'].forEach(j => {
        if (i[j].match(/^b/i)) {
          i[j] = 'Beat';
        } else if (i[j].match(/^a/i)) {
          i[j] = 'Action ' + i[j].substring(1);
        } else if (i[j].match(/^t/i)) {
          i[j] = 'Try ' + i[j].substring(1);
        }
      });
      //'ミラクル+'。単純上書き型。フラッグ関係と似ているがActionとTryに数値がない。分けたほうがスッキリするので混ぜずにここに書く。
      if (i['ミラクル+'].match(/^b/i)) {
        i['ミラクル+'] = 'Beat';
      } else if (i['ミラクル+'].match(/^a/i)) {
        i['ミラクル+'] = 'Action';
      } else if (i['ミラクル+'].match(/^t/i)) {
        i['ミラクル+'] = 'Try';
      }
    });
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/scss/paletton';

.multiLine_hr {
  margin: 0.25rem;
  border-style: dashed;
}

.color-beat {
  background: linear-gradient(90deg, $beat-color-1 2%, $beat-color-2 5%, transparent 100%);
  padding-left: 5%;
}
.color-action {
  background: linear-gradient(90deg, $action-color-1 2%, $action-color-2 5%, transparent 100%);
  padding-left: 5%;
}
.color-try {
  background: linear-gradient(90deg, $try-color-1 2%, $try-color-2 5%, transparent 100%);
  padding-left: 5%;
}

.search-option-grid {
  padding: 0.25rem 0.5rem;
  border-bottom: dashed 2px $color-primary-0;
  &:last-child {
    border-bottom: none;
  }
}
</style>
