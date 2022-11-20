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
                    １：特殊条件による絞り込みをしたい場合はここで指定してデータを絞り込みます。
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
                <SearchFriendsAdvFilterModal
                  @advFilterSelected="
                    (i1, i2) => {
                      setAdvFilter(i1, i2);
                      setQuery();
                    }
                  "
                >
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
                    変化するのは列の表示のみで、行数が変化することはありません。ただしここの選択は３の『表内検索』と深く関係しています。<br />
                    ３の『表内検索』はここで表示させたものが検索対象となります。なので”とくいわざ”や”たいきスキル”の中身だけを厳密に検索したい場合は『その他詳細・個別カラム表示』から”とくいわざ詳細”や”たいきスキル詳細”を利用して下さい。
                  </b-alert>
                </b-collapse>
                <b-alert show variant="warning" class="mt-2 mb-0 px-2 small">
                  表示を増やすとそれだけ重くなります。リセットしたい場合は「以下の検索条件をリセット」を押すかページをリロードしてください。
                </b-alert>
              </b-col>
            </b-row>
            <b-row
              v-for="[key, value] of new Map([
                ['基本', ['属性', 'サブ属性', '初期けも級', 'フォトポケ', '野生解放']],
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
                    @change="
                      selectLevelSelected();
                      setQuery();
                    "
                    style="width:5.5rem"
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
                        );
                        setQuery();
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
                        );
                        setQuery();
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
                        半角または全角スペースで区切るとAND条件で複数キーワードによる検索することが出来ます。
                      </li>
                      <li>
                        検索は各データ行中の各項目単位で判定されます。つまりキーワード１が"とくいわざ"に<span
                          class="font-weight-bold"
                          >のみ</span
                        >、キーワード２が"たいきスキル"に<span class="font-weight-bold">のみ</span
                        >存在する場合、この行には両方のキーワード満たす項目が１つも存在しなかったと判定され、そのデータ行は非表示となります。<br />
                        "とくせい/キセキとくせい"のように1項目に複数の項目がまとまっている場合は"とくせい"と"キセキとくせい"を同時に検索することが出来ます。
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
          perPage: $cookies.isKey('SearchFriends_perPage')
            ? +$cookies.get('SearchFriends_perPage')
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
        @on-per-page-change="params => $cookies.set('SearchFriends_perPage', params.currentPerPage)"
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
              <TypeSelectModalFriends
                :field="column.field"
                @typeFriendsSelected="
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
              </TypeSelectModalFriends>
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
          <template v-else-if="props.column.label == 'サブ属性'">
            <TypeNameToIcon :type="props.row.サブ属性" :imgRemSize="1.8" />
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
import advFilterFriends from '@/mixins/advFilterFriends.js';

import TypeSelectModalFriends from '@/components/TypeSelectModalFriends.vue';
import TypeNameToIcon from '@/components/TypeNameToIcon.vue';
import resizableTable from '@/mixins/resizableTable.js';

//表に与える実データ。computedにてjsonをディープコピーして生成する
let masterFriends = null;

//カラムのうち改行を含み複数行になりうるもの。検索等で利用
const multiLineColumns = [
  'ミラクルlv5',
  'とくいわざ詳細',
  'たいきスキル詳細',
  'とくせい詳細',
  'キセキとくせい詳細',
];

export default {
  mixins: [resizableTable, advFilterFriends],
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
          hidden: false,
          hidden_default: false,
          filterOptions: {
            enabled: true,
            placeholder: 'フレンズ名',
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
            filterValue: '', //本来初期値用だがvalueとしても使用。（特に属性についてはバグ？回避に必須。詳細はtypeFriendsSelectedあたり参照。）
            type: 'type', //独自
          },
        },
        {
          field: 'サブ属性',
          label: 'サブ属性',
          sortable: true,
          hidden: true,
          hidden_default: true,
          tdClass: 'text-center',
          filterOptions: {
            enabled: true,
            filterValue: '', //本来初期値用だがvalueとしても使用。（特に属性についてはバグ？回避に必須。詳細はtypeFriendsSelectedあたり参照。）
            type: 'type', //独自
          },
        },
        {
          field: '初期けも級',
          label: '初期けも級',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: false,
          hidden_default: false,
          filterOptions: {
            enabled: true,
            filterValue: '',
            // placeholder: '初期けも級',
            // filterDropdownItems: [2, 3, 4],  //vgtのフィルターを使う場合の選択肢。今は使ってない。
            type: 'select', //独自
            options: [
              { value: '', text: '初期けも級' },
              { value: '2', text: '2' },
              { value: '3', text: '3' },
              { value: '4', text: '4' },
            ], //独自。b-selectを使う場合の選択肢。
          },
        },
        {
          field: 'フォトポケ',
          label: '最大フォトポケ',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          filterOptions: {
            enabled: true,
            filterValue: '',
            // placeholder: '最大フォトポケ',
            // filterDropdownItems: [8, 12],
            type: 'select', //独自
            options: [
              { value: '', text: '最大フォトポケ' },
              { value: '8', text: '8' },
              { value: '12', text: '12' },
            ], //独自
          },
        },
        {
          field: '野生解放',
          label: '最大野生解放',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          filterOptions: {
            enabled: true,
            filterValue: '',
            // placeholder: '最大野生解放',
            // filterDropdownItems: [4, 5],
            type: 'select', //独自
            options: [
              { value: '', text: '最大野生解放' },
              { value: '4', text: '4' },
              { value: '5', text: '5' },
            ], //独自
          },
        },
        {
          field: '70けもステ',
          label: 'けもステ',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '70体力',
          label: '体力',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '70攻撃',
          label: '攻撃',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '70守り',
          label: '守り',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '90けもステ',
          label: 'けもステ',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '90体力',
          label: '体力',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '90攻撃',
          label: '攻撃',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '90守り',
          label: '守り',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '99けもステ',
          label: 'けもステ',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '99体力',
          label: '体力',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '99攻撃',
          label: '攻撃',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '99守り',
          label: '守り',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: '回避',
          label: '回避',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'プラズム',
          label: 'プラズム',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: 'フラッグ補正',
          label: 'フラッグ補正',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'Beat補正',
          label: 'Beat補正',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'Try補正',
          label: 'Try補正',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'Action補正',
          label: 'Action補正',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'フラッグ',
          label: 'フラッグ',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'flag1',
          label: 'フラッグ1',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'flag2',
          label: 'フラッグ2',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'flag3',
          label: 'フラッグ3',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'flag4',
          label: 'フラッグ4',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'flag5',
          label: 'フラッグ5',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'ミラクル',
          label: 'ミラクル',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'ミラクル名',
          label: 'ミラクル名',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'MP',
          label: 'MP',
          type: 'number',
          sortable: true,
          sortFn: this.numberColumnSortFn,
          hidden: true,
          hidden_default: true,
          formatFn: this.formatFnRaw,
        },
        {
          field: 'ミラクル+',
          label: 'ミラクル+',
          sortable: false,
          hidden: true,
          hidden_default: true,
          filterOptions: {
            enabled: true,
            filterValue: '',
            // placeholder: 'ミラクル+',
            // filterDropdownItems: ['Beat', 'Action', 'Try'],
            type: 'select', //独自
            options: [
              { value: '', text: 'ミラクル+' },
              { value: 'Beat', text: 'Beat' },
              { value: 'Action', text: 'Action' },
              { value: 'Try', text: 'Try' },
            ], //独自
          },
        },
        {
          field: 'ミラクルlv5',
          label: 'ミラクル (Lv.5)',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'とくいわざ',
          label: 'とくいわざ',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'とくいわざ名',
          label: 'とくいわざ名',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'とくいわざ詳細',
          label: 'とくいわざ詳細',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'たいきスキル',
          label: 'たいきスキル',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'たいきスキル名',
          label: 'たいきスキル名',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'たいきスキル詳細',
          label: 'たいきスキル詳細',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'とくせい/キセキとくせい',
          label: 'とくせい/キセキとくせい',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'とくせい名',
          label: 'とくせい名',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'とくせい詳細',
          label: 'とくせい詳細',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'キセキとくせい名',
          label: 'キセキとくせい名',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'キセキとくせい詳細',
          label: 'キセキとくせい詳細',
          sortable: false,
          hidden: true,
          hidden_default: true,
        },
        {
          field: 'CV',
          label: 'CV',
          sortable: true,
          hidden: true,
          hidden_default: true,
          filterOptions: {
            enabled: true,
            filterValue: '',
            placeholder: 'CV名',
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
      selectedLevel: 70,
      selectedLevel_default: 70, //クエリー生成時比較用
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
    //tableにセットする実データを作り出す(computedなのでキャッシュが効き、パラメータに変化があった場合のみ再計算される)。
    filterdFriends() {
      //masterFriends初期化(jsonからディープコピー。値を毎回破棄するのはハイライト用にデータが加工されている為)
      masterFriends = JSON.parse(JSON.stringify(friendsJson));

      //masterFriendsを特殊条件でフィルタリングする
      if (this.advFilter.label) {
        //filter()はmasterFriendsを１行ずつチェックし、合格した行のみを集めたオブジェクトを新たに生成して返す。
        //some()は配列の各要素に対してループし、コールバック関数が１つでもtrueを返せばsome()自身もtrueを返す。
        //これを組み合わせ、指定カラムのうちどれか１つが正規表現に合格するフレンズのみを抽出している。
        return masterFriends.filter(row =>
          this.advFilter.columns.some(col => {
            //調査対象が複数行カラムの場合、改行なしデータから検索する
            let tmpCol = multiLineColumns.includes(col) ? col + 'noCR' : col;
            return row[tmpCol].replace(/\r?\n/g, '').match(this.advFilter.regex);
          })
        );
      } else {
        //特殊条件が無い場合はそのまま
        return masterFriends;
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

      //検索対象カラム名配列の作成
      //現在のカラムが結合カラムの場合、別途表示カラム（formattedカラム）がある場合、改行を除いて検索したい場合は本来のカラムとは別のカラムを検索対象としたい。
      //そこで検索対象とするカラム名配列を作る。検索はそちらのカラムを対象に行う。
      let altTargetColumns = null;
      //先に結合カラム関連から処理
      if (col.label == 'フラッグ補正') {
        altTargetColumns = ['Beat補正Formatted', 'Try補正Formatted', 'Action補正Formatted'];
      } else if (col.label == 'フラッグ') {
        altTargetColumns = ['flag1', 'flag2', 'flag3', 'flag4', 'flag5'];
      } else if (col.label == 'ミラクル') {
        altTargetColumns = ['ミラクル名', 'MP', 'ミラクル+', 'ミラクルlv5noCR'];
      } else if (col.label == 'とくいわざ') {
        altTargetColumns = ['とくいわざ名', 'とくいわざ詳細noCR'];
      } else if (col.label == 'たいきスキル') {
        altTargetColumns = ['たいきスキル名', 'たいきスキル詳細noCR'];
      } else if (col.label == 'とくせい/キセキとくせい') {
        altTargetColumns = [
          'とくせい名',
          'とくせい詳細noCR',
          'キセキとくせい名',
          'キセキとくせい詳細noCR',
        ];
      } else if (['回避', 'Beat補正', 'Try補正', 'Action補正'].some(i => i == col.label)) {
        //別途表示カラム（formattedカラム）
        //処理はいずれも同じで対象カラムならfield名の後ろに'Formatted'を加える。
        altTargetColumns = [col.field + 'Formatted'];
      } else if (multiLineColumns.includes(col.label)) {
        //複数行カラム（単体表示指定された場合に発生）。改行なしを検索対象とする。
        altTargetColumns = [col.label + 'noCR'];
      }

      //検索対象カラム名配列をもとに検索対象文字列を作り出す
      //検索対象文字列定義
      let tmpCellString;
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
        index1 < this.advFilterFriends.length &&
        index2 < this.advFilterFriends[index1].dataList.length
      ) {
        //指定有
        const data = this.advFilterFriends[index1].dataList[index2];
        this.advFilter.label = data.labelFull;
        this.advFilter.columns = data.columns ? data.columns : this.advFilterFriends_defaultColumns;
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

    //現在の検索条件からクエリーURLを作り出し、セットする。
    setQuery() {
      const query = {}; //空のクエリーオブジェクトを生成。これに追加してゆく。

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

    //friendsJson初期化
    //masterFriendsがnullならページへの初アクセスであり初期化が必要
    //（importしたjsonはstaticであり、画面遷移をしても以下の変更処理を保持している為２回目以降は不要）
    if (masterFriends == null) {
      //初アクセス

      //省略記入されたカラムを表示に適した正しい文字列に復元してゆく。
      //元の値はそのまま残しつつ"Formatted"を付加したプロパティを別に作成する方法と、直接上書きしてしまう方法の２パターンが考えられる。
      //前者の利点は出力が"+1.0%"のような文字列であってもカラムのソートでは元fieldを参照することにより正しくソートができること。
      //前者の欠点は表のglobalSearchにおいて特殊処理を強いられること。
      //カラムによってどちらを使用するかは使い分ける。
      friendsJson.forEach(i => {
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

        //検索用に改行有カラムの改行無しデータを用意する。
        multiLineColumns.forEach(j => (i[j + 'noCR'] = i[j].replace(/\r?\n/g, '')));
      });
    }

    //クエリー処理ここから ========================================

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
    //['けもステ', '体力', '攻撃', '守り']ボタン(levelStatusColumns)は特別な処理をしているのでここでセットする。
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
