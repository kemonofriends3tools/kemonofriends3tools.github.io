<template>
  <b-container fluid class="mt-2">
    <h1>フォト検索</h1>
    <b-alert show variant="warning" class="d-block d-sm-none mb-0 small">
      画面幅が狭いので、操作性の観点から一部絞り込み機能を省略しています(全文検索で代用は可能です)。<br />
      スマホの場合、横画面にすればすべての機能が利用できるようになります。
    </b-alert>

    <b-container fluid>
      <div class="text-right">
        <b-button v-b-toggle.collapse1.collapse2.collapse3.collapse4 variant="info">
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
              <b-col class="pl-0">
                <b-icon
                  class="table-attached-header-icon align-middle"
                  icon="arrowCounterclockwise"
                  variant="dark"
                  font-scale="1.5"
                />
                <b-button @click="resetQuery()" class="table-attached-header-view-button">
                  以下の検索条件をリセット
                </b-button>
              </b-col>
            </b-row>
          </b-container>
        </div>
        <div class="table-attached-header">
          <b-container fluid>
            <b-row class="align-items-baseline">
              <b-col cols="12">
                <b-collapse id="collapse1">
                  <b-alert show variant="info" class="small mb-1">
                    １：検索したい対象をここで指定します。たとえばワイルドフォトを検索結果から除外したいのであればワイルドフォトのチェックを外します。尚、ここでチェックを外すとデータ量が減るので後の動作が軽くなります。
                  </b-alert>
                </b-collapse>
              </b-col>
              <b-col class="pl-0 pr-4 font-weight-bold flex-grow-0 text-nowrap">
                <b-icon
                  class="table-attached-header-icon"
                  icon="server"
                  variant="dark"
                  font-scale="1.5"
                />
                検索対象
              </b-col>
              <b-col cols="12" sm="auto" class="pl-4 flex-grow-0">
                <b-form-checkbox-group v-model="searchTargetFlag" @change="setQuery()">
                  <b-checkbox value="normal">
                    通常フォト
                  </b-checkbox>
                  <b-checkbox value="wild">
                    ワイルドフォト
                  </b-checkbox>
                  <b-checkbox value="material">
                    強化素材
                  </b-checkbox>
                </b-form-checkbox-group>
              </b-col>
            </b-row>
          </b-container>
        </div>
        <div class="table-attached-header">
          <b-container fluid>
            <b-row class="align-items-baseline">
              <b-col cols="12">
                <b-collapse id="collapse2">
                  <b-alert show variant="info" class="small mb-1">
                    ２：特殊条件による絞り込みをしたい場合はここで指定してデータを絞り込みます。
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
                <SearchPhotoAdvFilterModal
                  @advFilterSelected="
                    (i1, i2) => {
                      setAdvFilter(i1, i2);
                      setQuery();
                    }
                  "
                >
                  特殊条件選択
                </SearchPhotoAdvFilterModal>
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
                <b-collapse id="collapse3">
                  <b-alert show variant="info" class="small mb-1">
                    ３：下の表の表示列を切り替えます。<br />
                    変化するのは列の表示のみで、行数が変化することはありません。ただしここの選択は４の『表内検索』と深く関係しています。<br />
                    ４の『表内検索』はここで表示させたものが検索対象となります。
                  </b-alert>
                </b-collapse>
                <b-alert show variant="warning" class="mt-2 mb-0 px-2 small">
                  表示を増やすとそれだけ重くなります。リセットしたい場合は「以下の検索条件をリセット」を押すかページをリロードしてください。
                </b-alert>
              </b-col>
            </b-row>
            <b-row
              v-for="[key, value] of new Map([
                ['基本', ['属性', '☆']],
                ['限界突破', null],
                ['とくせい', ['とくせい(変化前)', 'とくせい(変化後)']],
                ['その他', ['イラストレータ名', '実装日', '備考']],
              ])"
              :key="key"
              class="align-items-center search-option-grid m-1 px-1"
            >
              <b-col cols="12" sm="2" xl="1" class="p-0 font-weight-bold">{{ key }}</b-col>
              <b-col class="d-flex flex-wrap">
                <template v-if="key == '限界突破'">
                  <b-select
                    v-model.number="selectedLevel"
                    :options="selectLevelOptions"
                    @change="
                      selectLevelSelected();
                      setQuery();
                    "
                    style="width:4rem"
                    required
                  />
                  <div v-for="(i, index) of levelStatusColumns" :key="key + index">
                    <b-button
                      v-show="!i.hidden"
                      variant="secondary"
                      @click="
                        setLevelStatusColumnHidden(i.name, index);
                        setQuery();
                      "
                      class="table-attached-header-view-button"
                    >
                      {{ i.name }}
                    </b-button>
                    <b-button
                      v-show="i.hidden"
                      variant="outline-secondary"
                      @click="
                        setLevelStatusColumnHidden(i.name, index);
                        setQuery();
                      "
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
                        );
                        setQuery();
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
                        );
                        setQuery();
                      "
                      class="table-attached-header-view-button"
                    >
                      {{ columns[columnsIndex.get(i)].label }}
                    </b-button>
                  </div>
                </template>
              </b-col>
            </b-row>
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
                <b-collapse id="collapse4">
                  <b-alert show variant="info" class="small mb-1">
                    ４：表内検索を行います。
                    <ul class="pl-4 mb-0">
                      <li>
                        これは<span class="font-weight-bold"
                          >現在表内に表示されている各項目を対象に</span
                        >、入力された文字列でデータ行の絞り込みを行います。<br />
                        注意してほしいのは検索対象は<span class="font-weight-bold"
                          >現在表に表示されている項目だけ</span
                        >という点です。例えばとくせいに”くらくら耐性”を持つフォトがあったとしても、３で”とくせい”関係の列を表示させていないとHITしません。つまり３の表示／非表示で検索対象列を指定することが出来ます。
                      </li>
                      <li>
                        半角または全角スペースで区切るとAND条件で複数キーワードによる検索することが出来ます。
                      </li>
                      <li>
                        検索は各データ行中の各項目単位で判定されます。つまりキーワード１が"とくせい(変化前)"に<span
                          class="font-weight-bold"
                          >のみ</span
                        >、キーワード２が"とくせい(変化後)"に<span class="font-weight-bold"
                          >のみ</span
                        >存在する場合、この行には両方のキーワード満たす項目が１つも存在しなかったと判定され、そのデータ行は非表示となります。
                      </li>
                      <li>
                        ここで指定したキーワードは表内でハイライト(強調表示)されます。
                      </li>
                      <li>
                        「正規表現」は上級者向けです。チェックをいれると入力をそのまま正規表現として扱います（半角または全角スペースによるAND条件は効かなくなります）。また^や$を使用した場合検索結果は正しいのですが上手くハイライト表示されないことがあります。
                      </li>
                    </ul>
                  </b-alert>
                </b-collapse>
              </b-col>
            </b-row>
            <b-row class="w-100">
              <b-col cols="12" md="10" xl="11" class="pr-0">
                <b-form-input
                  class="vgt-input input-externalQuery my-1"
                  v-model="globalSearchTerm"
                  placeholder="表内検索"
                  type="search"
                  debounce="500"
                  @change="setQuery()"
                />
              </b-col>
              <b-col cols="12" md="2" xl="1" class="pr-0 align-self-center">
                <b-checkbox
                  v-model="globalSearchMode"
                  @change="setQuery()"
                  aria-controls="regexWarn"
                >
                  正規表現
                </b-checkbox>
              </b-col>
            </b-row>
            <b-row class="w-100">
              <b-col cols="12">
                <b-alert
                  show
                  variant="danger"
                  class="mb-1 p-1 pl-2 small font-weight-bold"
                  v-if="checkSyntaxOfGlobalSearchTerm == 'SyntaxError'"
                >
                  正規表現の構文解析に失敗しました。構文を見直して下さい。現在表示されている検索結果に正規表現は適用されていません。
                </b-alert>
                <b-alert
                  show
                  variant="danger"
                  class="mb-1 p-1 pl-2 small font-weight-bold"
                  v-if="checkSyntaxOfGlobalSearchTerm == 'notEnough'"
                >
                  正規表現が特殊文字のみで構成されています。このような正規表現はブラウザをフリーズさせる恐れがあるため、現在検索結果に正規表現は適用されていません。もう少し何らかの情報（文字）を追加して下さい。
                </b-alert>
                <b-collapse id="regexWarn" v-model="globalSearchMode">
                  <b-alert show variant="danger" class="m-0 p-1 pl-2">
                    <span class="small font-weight-bold">正規表現検索時は改行に注意！</span>
                    <b-button
                      v-b-toggle.regexWarnDetail
                      variant="info"
                      class="debugButton px-1 py-0"
                    >
                      詳細を表示
                    </b-button>
                    <b-collapse id="regexWarnDetail">
                      <b-alert show variant="warning" class="small mb-1">
                        <p>
                          正規表現で検索する場合、探したい文字列の途中に改行が入る可能性がないか注意して下さい。正規表現は強力ですが動作が厳密なため、そのような可能性は自分で考慮する必要があります。
                        </p>
                        <p>
                          具体例で示します。カルガモのミラクルは以下のようなものです。
                          <b-alert show variant="info" class="m-0 p-0">
                            自身が大幅に狙われやすくなり被ダメージが70%減少し(2ターン)<br />
                            自身を除いた味方全体の<br />
                            与ダメージが45%増加する(3ターン)
                          </b-alert>
                          『味方全体の与ダメージ』という正規表現で検索した場合、カルガモはHITしません。なぜならカルガモのミラクルは『味方全体の』と『与ダメージ』の間に改行が入っているからです（この改行はゲーム中の表記に準拠しています）。<br />
                          正規表現でカルガモを含むよう検索したい場合、『味方全体の(\n|)与ダメージ』などと改行が入る可能性を考慮する必要があります。
                        </p>
                        <p>
                          こういった問題を避けるには単語を中心に利用し、助詞などを避けて正規表現を組み立てることです。<br />
                          基本的に単語の途中に改行が入ることはありません。逆に助詞(てにおは)の周辺は改行が入りやすいです。<br />
                          上の例で言うなら『味方全体.{0,10}与ダメージ』などすると期待通りの結果が得られます。（正規表現検索はsフラグ付で行っているので改行は『.』でマッチします。10という数字に深い意味はありません。ただ『.*』としてしまうと長文がHITしてしまうためある程度の文字で絞ったまでです）
                        </p>
                        <p class="mb-0">
                          なお正規表現検索ではなく通常検索時はこの問題が発生しません。（改行を気にせず検索でき、途中改行があってもなくても両方HITします）<br />
                          理由（仕組み）は単純で、裏でこっそり検索文字列を途中改行を考慮した文字列に変換しているからです。<br />
                          具体的に言うと『味方全体の与ダメージ』という文字で通常検索をした場合、実際には『味(\n|)方(\n|)全(\n|)体(\n|)の(\n|)与(\n|)ダ(\n|)メ(\n|)ー(\n|)ジ』という文字列に変換して正規表現検索が行われています。これにより文中のどこに改行があってもマッチします。<br />
                          正規表現検索においても改行がどこに入るかよくわからないときは『(\n|)』を各文字の間に挟めばとりあえず解決します。
                        </p>
                      </b-alert>
                    </b-collapse>
                  </b-alert>
                </b-collapse>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
      <vue-good-table
        ref="vgt"
        compactMode
        :rows="filterdPhoto"
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
          perPage: $cookies.isKey('SearchPhoto_perPage')
            ? +$cookies.get('SearchPhoto_perPage')
            : 10,
          position: 'bottom',
          perPageDropdown: [10, 20, 30, 40, 50, 999],
          dropdownAllowAll: false,
          nextLabel: '次',
          prevLabel: '前',
          rowsPerPageLabel: 'ページあたりの表示件数',
          ofLabel: '/',
          infoFn: params =>
            `全${params.totalRecords}件中 ${params.firstRecordOnPage}件～${params.lastRecordOnPage}件目を表示`,
        }"
        @on-per-page-change="params => $cookies.set('SearchPhoto_perPage', params.currentPerPage)"
      >
        <template v-slot:table-column="props">
          {{ props.column.label }}
          <!-- resizable table用のハンドル。それとここの親であるthにposition:relativeを入れる必要があるが、.vgt-table thにて既にそう定義されているようなので特に何もしない。 -->
          <div class="resizableTableHandle" @mousedown="resizableTableEventHandler($event)">
            &nbsp;
          </div>
        </template>
        <template v-slot:column-filter="{ column, updateFilters }">
          <template
            v-if="
              Object.prototype.hasOwnProperty.call(column, 'filterOptions') &&
                Object.prototype.hasOwnProperty.call(column.filterOptions, 'type')
            "
          >
            <template v-if="column.filterOptions.type == 'type'">
              <TypeSelectModalPhoto
                @typePhotoSelected="
                  value => {
                    //バグなのか、同一ページ遷移後($router.replace等)、updateFiltersを実行するだけでは値が変わらなくなる。
                    //どうもfilterValueの値に引きずられているようなので、ここで毎回setする。
                    $set(column.filterOptions, 'filterValue', value);
                    updateFilters(column, value);
                    setQuery();
                  }
                "
              >
                <TypeNameToIcon :type="column.filterOptions.filterValue" :imgRemSize="1.8" />
              </TypeSelectModalPhoto>
            </template>
            <template v-else-if="column.filterOptions.type == 'input'">
              <b-input
                class="vgt-custom-filter"
                v-model="column.filterOptions.filterValue"
                :placeholder="column.filterOptions.placeholder"
                @change="
                  value => {
                    updateFilters(column, value);
                    setQuery();
                  }
                "
              />
            </template>
            <template v-else-if="column.filterOptions.type == 'select'">
              <b-select
                class="vgt-custom-filter"
                v-model.number="column.filterOptions.filterValue"
                :options="column.filterOptions.options"
                :placeholder="column.filterOptions.placeholder"
                @change="
                  value => {
                    updateFilters(column, value);
                    setQuery();
                  }
                "
              />
            </template>
          </template>
        </template>
        <template v-slot:table-row="props">
          <!-- カラム表示に関することなので基本的にprops.column.label (not field)と比較することとする。 -->
          <template v-if="props.column.label == '属性'">
            <TypeNameToIcon :type="props.row.属性" :imgRemSize="1.8" />
          </template>
          <template
            v-else-if="
              ['とくせい(変化前)', 'とくせい(変化後)', 'イラストレータ名', '備考'].some(
                i => i == props.column.label
              )
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
            該当するフォトがありません。
          </b-alert>
        </div>
      </vue-good-table>
    </b-container>
  </b-container>
</template>

<script>
import photoNormalJson from '../json/photo_normal.json';
import photoWildJson from '../json/photo_wild.json';
import photoMaterialJson from '../json/photo_material.json';

import SearchPhotoAdvFilterModal from '@/components/SearchPhotoAdvFilterModal.vue';
import advFilterPhoto from '@/mixins/advFilterPhoto.js';

import TypeSelectModalPhoto from '@/components/TypeSelectModalPhoto.vue';
import TypeNameToIcon from '@/components/TypeNameToIcon.vue';
import resizableTable from '@/mixins/resizableTable.js';

export default {
  mixins: [resizableTable, advFilterPhoto],
  name: 'SearchPhoto',
  components: {
    SearchPhotoAdvFilterModal,
    TypeSelectModalPhoto,
    TypeNameToIcon,
  },
  data() {
    return {
      columns: [
        {
          field: '名前',
          label: '名前',
          sortable: true,
          hidden: false,
          hidden_default: false,
          filterOptions: {
            enabled: true,
            placeholder: 'フォト名',
            filterValue: '', //本来初期値用だがvalueとしても使用
            type: 'input', //独自。templateの分岐用。
          },
        },
        {
          field: '属性',
          label: '属性',
          sortable: true,
          hidden: false,
          hidden_default: false,
          tdClass: 'text-center',
          filterOptions: {
            enabled: true,
            filterValue: '', //本来初期値用だがvalueとしても使用。（特に属性についてはバグ？回避に必須。詳細はtypePhotoSelectedあたり参照。）
            type: 'type', //独自
          },
        },
        {
          field: '☆',
          label: '☆',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: false,
          hidden_default: false,
          filterOptions: {
            enabled: true,
            // placeholder: '☆',
            // filterDropdownItems: [1, 2, 3, 4],
            type: 'select', //独自
            options: [
              { value: '', text: '☆' },
              { value: '1', text: '1' },
              { value: '2', text: '2' },
              { value: '3', text: '3' },
              { value: '4', text: '4' },
            ], //独自。b-selectを使う場合の選択肢。
          },
        },
        {
          field: '0体力',
          label: '体力',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '0攻撃',
          label: '攻撃',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '0守り',
          label: '守り',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '4体力',
          label: '体力',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '4攻撃',
          label: '攻撃',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '4守り',
          label: '守り',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: 'とくせい(変化前)',
          label: 'とくせい(変化前)',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'とくせい(変化後)',
          label: 'とくせい(変化後)',
          sortable: false,
          hidden: false,
          hidden_default: false,
        },
        {
          field: 'イラストレータ名',
          label: 'イラストレータ名',
          sortable: true,
          hidden: true,
          hidden_default: true,
          filterOptions: {
            enabled: true,
            filterValue: '',
            placeholder: 'イラストレータ名',
            type: 'input', //独自
          },
        },
        {
          label: '実装日',
          field: '実装日',
          sortable: true,
          hidden: false,
          hidden_default: false,
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
          hidden: false,
          hidden_default: false,
          filterOptions: {
            enabled: true,
            filterValue: '',
            placeholder: '備考',
            type: 'input', //独自
          },
        },
      ],
      //columns配列についてfield名からindexを引くためのMap()。初期化はbeforeMountにて。
      columnsIndex: new Map(),
      //ステータス表示関係
      selectedLevel: 0,
      selectedLevel_default: 0,
      selectLevelOptions: [
        { value: 0, text: '0' },
        { value: 4, text: '4' },
      ],
      levelStatusColumns: [
        { name: '体力', hidden: true },
        { name: '攻撃', hidden: true },
        { name: '守り', hidden: true },
      ],
      //検索対象を管理する配列
      searchTargetFlag: ['normal', 'wild'],
      searchTargetFlag_default: ['normal', 'wild'],
      //その他ページ内で使用している変数。不要かもしれないが初期値絡みの面倒を避けるため一応定義しておく。
      globalSearchTerm: '',
      globalSearchMode: false,
      advFilter: {
        label: '',
        columns: '',
        regex: '',
        query: '',
      },
    };
  },
  computed: {
    //フォトのマスターデータ。検索対象チェックボックス配列の値を元に対応するJsonを結合して返す。
    masterPhoto() {
      let retArray = [];
      if (this.searchTargetFlag.includes('normal')) retArray = retArray.concat(photoNormalJson);
      if (this.searchTargetFlag.includes('wild')) retArray = retArray.concat(photoWildJson);
      if (this.searchTargetFlag.includes('material')) retArray = retArray.concat(photoMaterialJson);
      return retArray;
    },
    //tableにセットする実データを作り出す(computedなのでキャッシュが効き、パラメータに変化があった場合のみ再計算される)。
    //masterPhotoを特殊条件でフィルタリングして作る。
    filterdPhoto() {
      if (this.advFilter.label) {
        //filter()はmasterPhotoを１行ずつチェックし、合格した行のみを集めたオブジェクトを新たに生成して返す。
        //some()は配列の各要素に対してループし、コールバック関数が１つでもtrueを返せばsome()自身もtrueを返す。
        //これを組み合わせ、指定カラムのうちどれか１つが正規表現に合格するフォトのみを抽出している。
        return this.masterPhoto.filter(row =>
          this.advFilter.columns.some(col =>
            row[col].replace(/\r?\n/g, '').match(this.advFilter.regex)
          )
        );
      } else {
        return this.masterPhoto;
      }
    },

    //検索文字列を表内検索やvue-text-hightlight等で使いやすい形式（正規表現の配列）に直して返す。
    //正規表現検索モードの場合はそのままそれを格納した要素１の配列を返す
    //通常検索モードの場合は検索文字列を半角または全角スペースでsplitした配列を返す
    //複数個所で利用しているのでキャッシュの効くcomputedとして提供する。
    getGlobalSearchTermArray() {
      //戻り値となる正規表現配列を定義する。
      const regex = [];
      //正規表現検索フラグ確認
      if (this.globalSearchMode) {
        //正規表現検索モード
        //検索文字列が空であったり特殊文字だけだったりするとフリーズするので有効な文字列がある場合のみpushする
        if (this.globalSearchTerm.trim().replace(/[\\^$.*+?()[\]{}|]/g, '').length) {
          //正規表現を作れる場合のみpush
          try {
            //改行を"."で検索できるよう、正規表現フラグにsも追加する
            regex.push(new RegExp(this.globalSearchTerm, 'is'));
          } catch (error) {
            if (error instanceof SyntaxError) {
              console.log('RegExp SyntaxError:' + this.globalSearchTerm);
            }
          }
        }
      } else {
        //通常検索モード

        //検索文字列配列を取得する。
        //tirmで前後空白を除き、正規表現の特殊文字をエスケープ、半または全角スペースでsplitする。
        //全角スペースをソースに直で書くとlintでエラーになるので文字コードで指定する。
        let queries = this.globalSearchTerm
          .trim()
          .replace(/[\\^$.*+?()[\]{}|/]/g, '\\$&')
          .split(/[\x20\u3000]/);

        //検索文字列配列から空文字要素を排除する（空文字要素があるとvue-text-hightlight内のロジックでフリーズする模様）。ページロード時などにそういう配列が生まれることがある。
        queries = queries.filter(i => i != '');

        //検索文字列が空の場合は処理しない（空のqueriesを元にregexを作るとvue-text-hightlight内のロジック絡みでフリーズする模様）
        if (queries.length) {
          //通常検索モードでは途中改行文字列も探せるようにする
          //つまり探したい文字列がjsonデータ上では途中改行されていた場合でもHITさせたい。これは検索文字列の各文字の間に自動で(\n|)を挿入してあげることで対応出来る
          //なお正規表現時は改行を考慮するのはユーザーの責任ということでこの対応は行わない。
          queries.forEach((v, i) => {
            queries[i] = v.split('').join('(\n|)');
            //各文字の間に(\n|)を追加したが、正規表現エスケープ文字後にも追加されており構文エラーとなっているのでそれを消して修正する
            queries[i] = queries[i].replace(/\\\(\n\|\)/g, '\\');
          });

          //'i'オプションにより大文字小文字を区別しない。これによりbeatでBeatにHitするようになる。
          try {
            queries.forEach(i => regex.push(new RegExp(i, 'i')));
          } catch (error) {
            if (error instanceof SyntaxError) {
              console.log('SyntaxError:' + queries);
            }
          }
        }
      }
      return regex;
    },
    //入力された正規表現に問題がないか確認し、問題がある場合はその理由を返す。このメソッドの主目的はエラーメッセージ表示制御である
    checkSyntaxOfGlobalSearchTerm() {
      if (this.globalSearchMode && 0 < this.globalSearchTerm.trim().length) {
        //正規表現検索モード
        //SyntaxErrorが最も一般的な問題なので先にSyntaxErrorをチェックする
        try {
          //RegExpを作れるか確認
          new RegExp(this.globalSearchTerm, 'is');
        } catch (error) {
          if (error instanceof SyntaxError) {
            //SyntaxError
            return 'SyntaxError';
          }
        }
        //正規表現は正しいが特殊文字しか無く情報が不十分な場合（本質的にはフリーズ対策）
        if (this.globalSearchTerm.trim().replace(/[\\^$.*+?()[\]{}|]/g, '').length <= 0) {
          return 'notEnough';
        }
      }
      //ここまで何も無ければ空文字を返す
      return '';
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

      //フォトの場合属性は検索対象としない
      if (col.field == '属性') return false;

      //検索対象文字列はセル値
      const tmpCellString = cellValue.toString();

      //検索条件（正規表現配列）で検索対象文字列をテストする。
      //and条件としたいのでevery()を用いる。(every()は全要素がテストに合格するか判断する)
      //正規表現モードの場合はgetGlobalSearchTermArrayにはRegExpオブジェクト１つしか入ってないのでeveryでも問題ない
      return this.getGlobalSearchTermArray.every(i => i.test(tmpCellString));
    },

    //advFilterに値をセットする。
    //引数として指定された2つのindexを利用し、mixinにて定義された配列を参照して値を渡す。indexを経由させているのはクエリーにて利用したい為。
    //regexは前後の/は不要。^や$などは使用可。
    setAdvFilter(index1, index2) {
      //引数チェック。queryで来る可能性があるので厳密にチェックする。指定なし(undefined)が選ばれた場合もここで判別する。
      if (
        !isNaN(index1) &&
        !isNaN(index2) &&
        0 <= index1 &&
        0 <= index2 &&
        index1 < this.advFilterPhoto.length &&
        index2 < this.advFilterPhoto[index1].dataList.length
      ) {
        //指定有
        const data = this.advFilterPhoto[index1].dataList[index2];
        this.advFilter.label = data.labelFull;
        this.advFilter.columns = data.columns ? data.columns : this.advFilterPhoto_defaultColumns;
        this.advFilter.regex = data.regex;
        this.advFilter.query = index1 + ',' + index2;
      } else {
        //引数エラーもしくは指定なし
        this.advFilter.label = '';
        this.advFilter.columns = '';
        this.advFilter.regex = '';
        this.advFilter.query = '';
      }
    },
    //行class生成
    rowStyleClassFn(row) {
      if (row.属性 === 'photoType1') return 'row-photoType1';
      if (row.属性 === 'photoType2') return 'row-photoType2';
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
    //['体力', '攻撃', '守り']ボタンを押したときの動作。ボタン自体の表示制御の他、columnsのhiddenを切り替えて回る。
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

    //現在の検索条件からクエリーURLを作り出し、セットする。
    setQuery() {
      const query = {}; //空のクエリーオブジェクトを生成。これに追加してゆく。

      //検索対象
      //クリック順によって要素の順番が入れ替わっている可能性があるのでsort()してから文字列化して比較する。sort()は破壊的だが特に問題ない。
      if (
        this.searchTargetFlag.sort().toString() != this.searchTargetFlag_default.sort().toString()
      ) {
        query.j = this.searchTargetFlag.join(',');
      }

      //特殊条件
      if (this.advFilter.query) query.adv = this.advFilter.query;

      //表示列（ボタン）
      const visible = [];
      this.columns.forEach((c, index) => {
        if (c.hidden != c.hidden_default) {
          visible.push(index);
        }
      });
      if (0 < visible.length) query.v = visible.join(',');

      //表示列（レベル）
      if (this.selectedLevel != this.selectedLevel_default) query.lv = this.selectedLevel;

      //表内検索
      if (this.globalSearchTerm) query.s = this.globalSearchTerm;
      if (this.globalSearchMode) query.r = this.globalSearchMode;

      //vgtカラムフィルター。vgt内のcolumnFiltersオブジェクトを参照してフィルター値を取り出す。
      //クエリパラメータ名はcolumnsIndexを利用する。
      Object.keys(this.$refs.vgt.columnFilters).forEach(k => {
        if (this.$refs.vgt.columnFilters[k]) {
          query['t' + this.columnsIndex.get(k)] = this.$refs.vgt.columnFilters[k];
        }
      });

      //クエリーにセット
      //router.replaceは同じURLに遷移しようとするとNavigationDuplicatedエラーを起こす。
      //router.replaceはPromiseを返すので、それをcatchして処理している。catch内では特に処理は行わない。
      this.$router.replace({ query: query }).catch(() => {});
    },
    //検索条件及び表示列をリセットする
    reset() {
      //検索対象
      this.searchTargetFlag = this.searchTargetFlag_default.slice();
      //特殊条件
      this.setAdvFilter(undefined, undefined);
      //表示列（ボタン）
      this.columns.forEach(i => this.$set(i, 'hidden', i.hidden_default));
      //表示列（レベル）
      this.selectedLevel = this.selectedLevel_default;
      //表示列（ボタン：ステータス）
      this.levelStatusColumns.forEach(i => this.$set(i, 'hidden', true));
      //表内検索
      this.globalSearchTerm = '';
      this.globalSearchMode = false;
      //vgtカラムフィルター
      //クエリー文字列から確認すると面倒なのでcolumnsから走査する
      this.columns.forEach(c => {
        //filterOptionsがあるもののみ処理
        if (Object.prototype.hasOwnProperty.call(c, 'filterOptions')) {
          //filterValueをセットする。本来の目的であるvgtの初期値の他、見た目（入力欄）上の初期値も兼ねている。
          this.$set(c.filterOptions, 'filterValue', '');
        }
      });
    },
    //クエリ文字列を消去する。実際にはこれによりbeforeRouteUpdate()が走りそこでreset()が呼ばれるため、検索欄もあわせてリセットされる。
    resetQuery() {
      this.$router.replace({ query: {} }).catch(() => {});
    },
  },
  beforeMount() {
    //columnsIndexを初期化。
    //columnsIndexはtemplateにてcolumns[columnsIndex.get(i)].labelなどと参照されているが、columnsIndexの初期化が遅いと空であり、参照エラーになってしまう。
    //そのためpage描画が始まる前（elementがマウントされる前）であるここbeforeMountにて初期化を行う。
    this.columns.forEach((i, j) => this.columnsIndex.set(i.field, j));

    //クエリー処理ここから ========================================

    //検索対象
    if (this.$route.query.j != undefined) {
      //クエリ文字列を,で分離してそのままセット
      this.searchTargetFlag = this.$route.query.j.split(',');
    }

    //特殊条件
    if (this.$route.query.adv != undefined) {
      //クエリ文字列を,で分離し、2分割できたならsetAdvFilterに送る。値が正しいかはsetAdvFilterでチェックしている。
      const tmpAdvQuery = this.$route.query.adv.split(',');
      if (tmpAdvQuery.length == 2) this.setAdvFilter(tmpAdvQuery[0], tmpAdvQuery[1]);
    }

    //表示列（ボタン）
    if (this.$route.query.v != undefined) {
      //クエリ文字列を,で分離
      const tmpVQuery = this.$route.query.v.split(',');
      tmpVQuery.forEach(v => {
        //有効な数値の場合のみ処理
        if (!isNaN(v) && 0 <= v && v < this.columns.length) {
          //hiddenにhidden_defaultの逆をセットする
          this.$set(this.columns[v], 'hidden', !this.columns[v].hidden_default);
        }
      });
    }

    //表示列（レベル）
    //ステータス関連ボタンの表示に関わってくる為、ボタンよりも先にレベルを処理する。
    if (this.$route.query.lv != undefined) {
      //選択肢としてありえる数値の配列を作る
      const tmpLv = [];
      this.selectLevelOptions.forEach(i => tmpLv.push(i.value));
      //クエリから来た数値が有効ならセット
      if (tmpLv.includes(Number(this.$route.query.lv))) this.selectedLevel = this.$route.query.lv;
    }

    //表示列（ボタン：ステータス）
    //['体力', '攻撃', '守り']ボタン(levelStatusColumns)は特別な処理をしているのでここでセットする。
    //現在選択されているレベルの各表示状態を調べ、それをlevelStatusColumnsに反映させる。
    this.levelStatusColumns.forEach(
      i => (i.hidden = this.columns[this.columnsIndex.get(this.selectedLevel + i.name)].hidden)
    );

    //表内検索
    if (this.$route.query.s != undefined) this.globalSearchTerm = this.$route.query.s;
    if (this.$route.query.r != undefined && this.$route.query.r === 'true')
      //query.rをglobalSearchModeにそのまま代入するとString型となってしまうので、正しくbooleanで代入する
      this.globalSearchMode = true;

    //vgtカラムフィルター
    //クエリー文字列から確認すると面倒なのでcolumnsから走査する
    this.columns.forEach((c, index) => {
      //filterOptionsがあるもののみ処理
      if (Object.prototype.hasOwnProperty.call(c, 'filterOptions')) {
        //クエリに現在のカラムに関する指定があるかチェック
        if (this.$route.query['t' + index] != undefined) {
          //filterValueをセットする。本来の目的であるvgtの初期値の他、見た目（入力欄）上の初期値も兼ねている。
          this.$set(
            this.columns[index].filterOptions,
            'filterValue',
            this.$route.query['t' + index]
          );
        }
      }
    });

    //クエリー処理ここまで ========================================
  },
  //vue-routerによる遷移の間に実行される。初回（create等が走るとき）は実行されない。$router.pushや$router.replaceが走るたびに呼ばれる。
  //主にヘッダメニューでこのページを再選択したとき（同ページ、クエリー無し）に検索条件をリセットするために用いている（そうしないと検索後の状態が残ったままとなる）。
  beforeRouteUpdate(to, from, next) {
    //クエリが存在しない場合は検索条件をリセット
    if (Object.keys(to.query).length == 0) this.reset();
    //仕様によりnext()は必ず呼ぶ
    next();
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/scss/paletton';

.multiLine_hr {
  margin: 0.25rem;
  border-style: dashed;
}

//vue-good-tableのカスタムフィルター用。
//実際にはこれに加えてvue-bootstrapのclassが自動挿入されるので、importantで優先順位を上げている。
.vgt-custom-filter {
  padding: 0.375rem 1.75rem 0.375rem 0.5rem !important;
  font-size: 0.9rem !important;
  height: 2.2rem !important;
  line-height: 1 !important;
}

.search-option-grid {
  padding: 0.25rem 0.5rem;
  border-bottom: dashed 2px $color-primary-0;
  &:last-child {
    border-bottom: none;
  }
}
</style>
