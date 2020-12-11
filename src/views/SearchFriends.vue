<template>
  <b-container fluid class="mt-2">
    <h1>フレンズ検索</h1>
    <b-alert show variant="warning" class="d-block d-sm-none mb-0 small">
      画面幅が狭いので、操作性の観点から一部絞り込み機能を省略しています(全文検索で代用は可能です)。<br />
      スマホの場合、横画面にすればすべての機能が利用できるようになります。
    </b-alert>

    <b-container fluid>
      <div>
        <div class="table-attached-header">
          <b-container fluid>
            <b-row class="align-items-baseline">
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
                <b-alert show variant="warning" class="mt-2 mb-0 px-2 small">
                  表示を増やすとそれだけ重くなります。<br />選択をリセットしたい場合はページをリロードして下さい。
                </b-alert>
              </b-col>
            </b-row>
            <b-row
              v-for="[key, value] of new Map([
                ['基本', ['属性', '初期けも級', 'フォトポケ', '野生解放']],
                ['ステータス(Lv)', null],
                ['ステータス(他)', ['回避', 'プラズム', 'フラッグ補正', 'フラッグ']],
                ['技・特性', ['ミラクル', 'とくいわざ', 'たいきスキル', 'とくせい/キセキとくせい']],
                ['その他', ['CV', '備考']],
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
          <b-icon
            class="table-attached-header-icon"
            icon="search"
            variant="dark"
            font-scale="1.5"
          />
          <b-form-input
            class="vgt-input input-externalQuery my-1"
            v-model="globalSearchTerm"
            placeholder="表内全文検索"
          />
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
        styleClass="vgt-table bordered condensed"
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
            {{ props.row[props.column.field + 'Formatted'] }}
          </template>
          <template v-else-if="props.column.label == 'フラッグ補正'">
            <p
              v-for="i of ['Beat補正', 'Try補正', 'Action補正']"
              :class="getFlagCorrectionColumnClass('m-0 text-right', i)"
              :key="'flagCorrection' + i"
            >
              {{ i.substring(0, 1).toUpperCase() + i.substring(1) }} :
              {{ props.row[i + 'Formatted'] }}
            </p>
          </template>
          <template v-else-if="props.column.label == 'フラッグ'">
            <div v-for="i of ['1', '2', '3', '4', '5']" :key="'flag' + i">
              <p :class="getFlagCorrectionColumnClass('m-0', props.row['flag' + i])">
                {{ props.row['flag' + i] }}
              </p>
            </div>
          </template>
          <template v-else-if="props.column.label == 'ミラクル'">
            <p class="font-weight-bold m-0">{{ props.row.ミラクル名 }}</p>
            <p class="m-0 pl-2">
              MP: {{ props.row.MP }}
              <span
                :class="getFlagCorrectionColumnClass('pr-3', props.row['ミラクル+'])"
                style="padding-left:0.5rem;"
              >
                {{ props.row['ミラクル+'] }}
              </span>
              Lv.5
            </p>
            <p class="preText m-0 pl-2">{{ props.row.ミラクルlv5 }}</p>
          </template>
          <template v-else-if="props.column.label == 'とくいわざ'">
            <p class="font-weight-bold m-0">{{ props.row.とくいわざ名 }}</p>
            <p class="preText m-0 pl-2">{{ props.row.とくいわざ詳細 }}</p>
          </template>
          <template v-else-if="props.column.label == 'たいきスキル'">
            <p class="font-weight-bold m-0">{{ props.row.たいきスキル名 }}</p>
            <p class="preText m-0 pl-2">{{ props.row.たいきスキル詳細 }}</p>
          </template>
          <template v-else-if="props.column.label == 'とくせい/キセキとくせい'">
            <p class="font-weight-bold m-0">{{ props.row.とくせい名 }}</p>
            <p class="preText m-0 pl-2">{{ props.row.とくせい詳細 }}</p>
            <hr class="multiLine_hr" />
            <p class="font-weight-bold m-0">{{ props.row.キセキとくせい名 }}</p>
            <p class="preText m-0 pl-2">{{ props.row.キセキとくせい詳細 }}</p>
          </template>
          <template
            v-else-if="['Beat補正', 'Try補正', 'Action補正'].some(i => i == props.column.label)"
          >
            <!-- ここも背景色を変えるが、値に入っているのは数値のみなのでgetFlagCorrectionColumnClassにはfield名を渡す。頭文字判定なので問題ない。 -->
            <p :class="getFlagCorrectionColumnClass('m-0 text-right', props.column.field)">
              {{ props.row[props.column.field + 'Formatted'] }}
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
              {{ props.row[props.column.field] }}
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
            <p class="preText m-0">{{ props.row[props.column.field] }}</p>
          </template>
          <template v-else>
            {{ props.formattedRow[props.column.field] }}
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

//resizable table 1/3 https://stackoverflow.com/questions/52759087/resizable-vue-good-table-or-vue
//グローバル変数
var thElm;
var startOffset;

export default {
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
          hidden: true,
        },
        {
          field: '70体力',
          label: '体力',
          type: 'number',
          sortable: true,
          hidden: true,
        },
        {
          field: '70攻撃',
          label: '攻撃',
          type: 'number',
          sortable: true,
          hidden: true,
        },
        {
          field: '70守り',
          label: '守り',
          type: 'number',
          sortable: true,
          hidden: true,
        },
        {
          field: '90けもステ',
          label: 'けもステ',
          type: 'number',
          sortable: true,
          hidden: true,
        },
        {
          field: '90体力',
          label: '体力',
          type: 'number',
          sortable: true,
          hidden: true,
        },
        {
          field: '90攻撃',
          label: '攻撃',
          type: 'number',
          sortable: true,
          hidden: true,
        },
        {
          field: '90守り',
          label: '守り',
          type: 'number',
          sortable: true,
          hidden: true,
        },
        {
          field: '99けもステ',
          label: 'けもステ',
          type: 'number',
          sortable: true,
          hidden: true,
        },
        {
          field: '99体力',
          label: '体力',
          type: 'number',
          sortable: true,
          hidden: true,
        },
        {
          field: '99攻撃',
          label: '攻撃',
          type: 'number',
          sortable: true,
          hidden: true,
        },
        {
          field: '99守り',
          label: '守り',
          type: 'number',
          sortable: true,
          hidden: true,
        },
        {
          field: '回避',
          label: '回避',
          type: 'number',
          sortable: true,
          hidden: true,
        },
        {
          field: 'プラズム',
          label: 'プラズム',
          type: 'number',
          sortable: true,
          hidden: true,
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
          hidden: true,
        },
        {
          field: 'Try補正',
          label: 'Try補正',
          type: 'number',
          sortable: true,
          hidden: true,
        },
        {
          field: 'Action補正',
          label: 'Action補正',
          type: 'number',
          sortable: true,
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
          hidden: true,
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
          sortable: false,
          hidden: true,
        },
        {
          field: '備考',
          label: '備考',
          sortable: false,
        },
        {
          label: '入手可能期間',
          field: '入手可能期間',
          hidden: true,
          // type: 'date', //date-fnsのperseがうまくいってない
          // dateInputFormat: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
          // dateOutputFormat: 'YYYY/MM/DD',
          // sortable: true,
        },
      ],
      //columns配列についてfield名からindexを引くためのMap()。初期化はmountedにて。
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
  },
  methods: {
    //表内全文検索
    globalSearch(row, col, cellValue, globalSearchTerm) {
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

      //代替検索カラム配列に要素が存在するか
      if (altTargetColumns) {
        //代替検索必要
        //配列にて示された各カラムをsomeで調べる。比較は単純にindexOfで判定する。
        return altTargetColumns.some(i => row[i].toString().indexOf(globalSearchTerm) != -1);
      } else {
        //代替検索不要
        //セル値を単純にindexOfで判定する。
        return cellValue.toString().indexOf(globalSearchTerm) != -1;
      }
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

    //resizable table 3/3 https://stackoverflow.com/questions/52759087/resizable-vue-good-table-or-vue
    //th内ハンドルのmousedownに追加するイベントハンドラー。
    resizableTableEventHandler(event) {
      thElm = event.target.parentNode;
      startOffset = event.target.parentNode.offsetWidth - event.pageX;
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
  mounted() {
    //resizable table 2/3 https://stackoverflow.com/questions/52759087/resizable-vue-good-table-or-vue
    //グローバルなmousemove,mouseupイベントハンドラ追加
    document.addEventListener('mousemove', e => {
      if (thElm) thElm.style.width = startOffset + e.pageX + 'px';
    });
    document.addEventListener('mouseup', () => (thElm = undefined));
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
